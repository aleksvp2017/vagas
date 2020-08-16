const chalk = require('chalk')
var XLSX = require('xlsx')
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})
const Planilha = require('./planilha.js')
var Helper = require('./helper.js')
var Auditoria = require('./auditoria.js')
var Mensagem = require('./mensagem.js')


const alterar =  async (req, res) => {
  try{
      let vaga = req.body.vaga
      await validar(vaga)
      var sqlUpdate = montarUpdate(req.body.vaga)
      let result = await pool.query(sqlUpdate)
      vaga = result.rows[0]
      res.status(200).json( {message: 'Dados alterados com sucesso', vaga})    
      Auditoria.log(req.app.usuario, 'vagas.alterar', req.body.vaga, null)              
  }
  catch (error){
      console.log(chalk.red('Erro ao alterar vagas', error))
      res.status(401).json({error: `Error ao gravar dados: ${error}`})
      Auditoria.log(req.app.usuario, 'vagas.alterar', new Date(), req.body.vaga, error)              
  }
}

async function validar(vaga) {
  await Promise.all(Object.entries(vaga).map(async (campo) => {
    let coluna = Planilha.estrutura.colunas[campo[0].toUpperCase()]
    if (coluna) {
      let msgErro = ''
      if (coluna.validar){
        if (coluna.colunaDependente){
          msgErro = await coluna.validar(campo[1], vaga[coluna.colunaDependente.toLowerCase()])
        } else {
          msgErro = coluna.validar(campo[1])
        }
        if (msgErro) {
          throw msgErro
        }
      }
    }
  }))
}

const montarUpdate = (vagas) => {
  var update = ''
  Planilha.estrutura.colunasAtualizaveis.map(coluna =>{
      let valor = (vagas[coluna] !== null ? vagas[coluna] : null)
      if (valor == null){
        update += `,  ${coluna}  = ${valor}`
      }
      else {
        update += ',' + coluna + ' = \'' + valor + '\''
      }
  })
  return 'update vaga set ' + update.substring(1, update.length) + ' where vagaid = ' + vagas['vagaid'] + ' returning *'
}

const excluir =  async (req, res) => {
  try{
      let ids = req.body.vagas.map(vaga => vaga.vagaid)
      await pool.query('delete from vaga where vagaid in (' + ids.join(',') + ')')
      res.status(200).json( {message: 'Vagas excluídas com sucesso'})    
      Auditoria.log(req.app.usuario, 'vagas.excluir', req.body.vagas, null)              
  }
  catch (error){
      res.status(401).json({error: `Error ao excluir vagas ${error}`})
      Auditoria.log(req.app.usuario, 'vagas.excluir', req.body.vagas, error)              
  } 
}


const excluirPlanilha =  async (req, res) => {
  try{
      let nomePlanilha = req.body.nomePlanilha
      if (!nomePlanilha){
        res.status(401).json( {message: 'Planilha não especificada'})      
      }
      else{
        await pool.query('delete from vaga where nomeplanilha = \'' + nomePlanilha + '\'')
        res.status(200).json( {message: 'Todas as vagas incluídas pela planilha ' + nomePlanilha + ' foram excluídas'})    
        Auditoria.log(req.app.usuario, 'vagas.excluirPlanilha', req.body.nomePlanilha, null)              
      }
  }
  catch (error){
      res.status(401).json({error: `Error ao excluir vagas da planilha ${error}`})
      Auditoria.log(req.app.usuario, 'vagas.excluirPlanilha', req.body.nomePlanilha, error)              
  } 
}

const listar = async (req, res) => {
  try{
      let vagas = await (await pool.query('select * from vaga order by vagaid')).rows
      res.status(200).json({ vagas })
  }
  catch(error){
      console.log(chalk.red('erro ao buscar vagas', error))
  }              
}

const listarPlanilhas = async (req, res) => {
  try{
      let planilhas = await (await pool.query('select distinct nomeplanilha from vaga')).rows
      var planilhasNomes = []
      planilhas.map(planilha => { planilhasNomes.push(planilha.nomeplanilha)})
      res.status(200).json({ planilhas: planilhasNomes})
  }
  catch(error){
      console.log(chalk.red('erro ao buscar planilhas', error))
  }              
}


const importarPlanilha = async function (req, res) {
  var jaRespondido = false
  try{
    console.time('Planilha importada em ')
    let {linhas, cabecalho} = await carregarLinhasPlanilha(req)   

    //Esse limite é por duas coisas: usuário não ficar plantado esperando; 
    //depois de um tempo, vue-resource refaz a requisição se não tiver tido resposta
    if (linhas.length > 500){
      jaRespondido = true
      res.status(200).json({ message: "Não precisa esperar, você receberá um e-mail ao final do processamento da planilha." })
    }
    
 
    //verificarLinhasIdenticasNaPlanilha(linhas, cabecalho)

    //Na planilha as linhas podem vir com maior nível de detalhamento,
    //por exemplo por escola. Assim é preciso agrupar essas linhas
    linhas = await Planilha.agruparLinhasIdenticas(linhas, cabecalho)

    //A depender do caso, pode ser um insert ou update
    const sqlInsert = montarInsertPlanilha(cabecalho)
    const sqlUpdate = montarUpdatePlanilha(cabecalho)

    const client = await pool.connect()

    for (const linha of linhas){
      var sql = sqlInsert
      var linhaExistente = await obterLinha(cabecalho, linha)
      if (linhaExistente){
        //verifica se tem algo a atualizar (ou seja, algum campo nao chave diferente)
        var mudouAlgumCampoNaoChave = false
        Planilha.estrutura.colunasNaoChave().map(colunaNaoChave => {
          var valorCampo = obterCampo(cabecalho, linha, colunaNaoChave)
          if (linhaExistente[colunaNaoChave.nomeColunaBanco] !== valorCampo){
            mudouAlgumCampoNaoChave = true
          }
        })
        if (mudouAlgumCampoNaoChave){
          sql = sqlUpdate
        }
        else{
          sql = null
        }
      }
      if (sql){        
        await client.query(sql, linha)
      }
    }

    console.timeEnd('Planilha importada em ')
    if (!jaRespondido){
      res.status(200).json({ message: "Dados carregados com sucesso" })
    }
    else{
      Mensagem.enviarEmail('Planilha processada', 'Planilha processada com sucesso', req.app.usuario)
    }
    Auditoria.log(req.app.usuario, 'vagas.importarplanilha', {cabecalho: cabecalho}, null)          
    
  }
  catch (error){
    console.log(chalk.red(`Erro ao importarPlanilha ${error}`))
    if (!jaRespondido){
      res.status(401).json({ error })
    }
    else{
      Mensagem.enviarEmail('Erro ao processar planilha', error, req.app.usuario)
    }
    Auditoria.log(req.app.usuario, 'vagas.importarplanilha', '', error)          
  }
}

function obterCampo(cabecalho, linha, colunaNaoChave){
  var valorCampo = ''
  cabecalho.map((coluna, index) => {
    if (Planilha.estrutura.obterColuna(coluna).nomeColunaBanco === colunaNaoChave){
      valorCampo = linha[index]
    }
  })
  return valorCampo
}

async function obterLinha(cabecalho, linha){
  var sql = montarConsultaPelosCamposChave(cabecalho, linha)
  let vagas = await (await pool.query(sql)).rows
  if (vagas && vagas.length > 0){
    return vagas[0]
  }
  return null
}

async function carregarLinhasPlanilha(req) {  
  //carrega o arquivo que veio na requisicao
  const streamifier = require('streamifier')
  if (req.files.length <= 0){
    throw 'Nenhum arquivo encontrado'
  }
  var stream = streamifier.createReadStream(req.files[0].buffer)
  var workbook = await transformStreamInWorkbook(stream)
  
  //carrega a aba, tem um nome padrão, mas pode vir especificado na requisição
  var nomeAba = Planilha.estrutura.nome
  if (req.body.nomeAba){
    nomeAba = req.body.nomeAba
  }
  // console.log(workbook.SheetNames)
  var planilha = null
  workbook.SheetNames.map(aba => {
    if (Helper.isIguais(aba, nomeAba)){
      planilha = workbook.Sheets[aba]
    }
  })
  if (planilha == null){
    throw 'Não encontra página / aba da planilha com nome ' + nomeAba
  }

  //carrega as linhas
  var matrizDados = XLSX.utils.sheet_to_json(planilha, { header: 1, raw: true, defval:null })
  if (matrizDados.length <= 1){
    throw 'Sem linhas de dados na planilha'
  }

  //remove colunas nao previstas na estrutura da planilha 
  //retorna, alem do cabecalho ja sem as colunas, o indice das colunas que deverão
  //ser excluidas nas linhas
  let {cabecalho, colunasAExcluir} = removerColunasNaoPrevistasNaPlanilhaDoCabecalho(matrizDados[0])

  
  //extrai as linhas da matriz - tira so o cabecalho
  var linhas = matrizDados.splice(1,matrizDados.length)

  //remove, das linhas, as colunas não previstas na estrutura da planilha
  linhas = removerColunasNaoPrevistasNaPlanilhaDasLinhas(linhas, colunasAExcluir)

  linhas = removeLinhasComTodasColunasVazias(linhas)

  replicaColunaDaPlanilhaMapeadaComMaisDeUmaColuna(linhas, cabecalho)
  
  validarColunasObrigatorias(cabecalho)
    
  //Alguns parametros podem ser enviados via requisicao ou em cada linha
  //Faz sentido pois esses dados podem ser constantes em todas as linhas em alguns casos
  //Exemplo: ano, mes, periodo de pactuacao
  //Porém, especialmente pensando em grandes cargas, foi preciso manter a possibilidade 
  //de manter esses dados linha a linha
  incluiNasLinhasParametrosViaRequisicao(req, linhas, cabecalho)


  incluiNasLinhasPlanilhaDeOrigemDosDados(linhas, cabecalho, nomeAba)

  substituiConteudoPorValoresPadronizado(linhas, cabecalho)

  //valida linhas de acordo com o previsto na estrutura da planilha
  //tem o await devido à possibilidade de validação que envolva BD
  await validarLinhas(cabecalho, linhas)
  
  linhas = aplicarUpperCaseNasColunasNaoNumericas(linhas)

return {linhas, cabecalho}
}

function replicaColunaDaPlanilhaMapeadaComMaisDeUmaColuna(linhas, cabecalho){
  var indiceCabecalho = 0
  for (nomeColuna of cabecalho) {
    var colunas = Planilha.estrutura.obterColunas(nomeColuna)
    if (colunas && colunas.length > 1){
      cabecalho[indiceCabecalho] = colunas[0].nomeColunaBanco
      var indiceColuna = 0
      for (coluna of colunas){
        if (indiceColuna > 0){
          linhas = linhas.map(linha => {
            linha[cabecalho.length]  = linha[indiceCabecalho]
            return linha
          })
          cabecalho[cabecalho.length] = coluna.nomeColunaBanco
        }
        indiceColuna ++
      }
    }
    indiceCabecalho++
  }
}

function substituiConteudoPorValoresPadronizado(linhas, cabecalho){
  for (linha of linhas){
    var indiceColuna = 0
    for (nomeColuna of cabecalho){
      var coluna = Planilha.estrutura.obterColuna(nomeColuna)
      if (coluna.snValoresPadrao){
        linha[indiceColuna] = coluna.obterValorPadrao(linha[indiceColuna])
      }
      indiceColuna++
    }
  }
}

function aplicarUpperCaseNasColunasNaoNumericas(linhas){
  var linhasAdaptadas = []
  linhas.map(linha => {
    var linhaAdaptada = []
    linha.map(item => {
      if (isNaN(item)){
        linhaAdaptada.push(item.toUpperCase())
      }
      else{
        linhaAdaptada.push(item)
      }
    })
    linhasAdaptadas.push(linhaAdaptada)
  })
  return linhasAdaptadas
}

function incluiNasLinhasPlanilhaDeOrigemDosDados(linhas, cabecalho, nomeAba){
  var hoje = new Date()
  linhas.map(linha => linha.push(nomeAba + hoje.toLocaleTimeString() + ' ' + hoje.toLocaleDateString()))
  cabecalho.push(Planilha.estrutura.colunas.NOMEPLANILHA.nomeColunaBanco)
}

function incluiNasLinhasParametrosViaRequisicao(req, linhas, cabecalho){
  //PERIODO
  //Checa se já não tem na planilha e se veio na requisicao
  if (!temColuna(Planilha.estrutura.colunas.PERIODOPACTUACAO, cabecalho) && req.body.periodoPactuacao){
    linhas.map(linha => linha.push(req.body.periodoPactuacao))
    cabecalho.push(Planilha.estrutura.obterColuna('periodopactuacao').nomeColunaBanco)
  }
  //MES
  if (!temColuna(Planilha.estrutura.colunas.MES, cabecalho) && req.body.mes){
    linhas.map(linha => linha.push(req.body.mes))
    cabecalho.push(Planilha.estrutura.obterColuna('mes').nomeColunaBanco)
  }  

  //ANO
  if (!temColuna(Planilha.estrutura.colunas.ANO, cabecalho) && req.body.ano){
    linhas.map(linha => linha.push(req.body.ano))
    cabecalho.push(Planilha.estrutura.obterColuna('ano').nomeColunaBanco)
  }  

    //SNCONTRAPARTIDA
    if (!temColuna(Planilha.estrutura.colunas.SNCONTRAPARTIDA, cabecalho) && req.body.sncontrapartida){
      linhas.map(linha => linha.push(req.body.sncontrapartida))
      cabecalho.push(Planilha.estrutura.obterColuna('contrapartida').nomeColunaBanco)
    }  

}

function temColuna(coluna, cabecalho){
  var achou = false
  coluna.getNomesPossiveis().map(nomePossivel => {
    cabecalho.map(itemCabecalho => {
      if (Helper.isIguais(itemCabecalho, nomePossivel)){
        achou = true
      }
    })
  })
  return achou
}

function removeLinhasComTodasColunasVazias(matrizDados){
  matrizDadosSemLinhasVazias = []
  matrizDados.map(linha => {
    if (!Planilha.isTodasColunasVazias(linha)){
      matrizDadosSemLinhasVazias.push(linha)
    }
  })
  return matrizDadosSemLinhasVazias
}

async function transformStreamInWorkbook(stream){
  var buffers = [];
  stream.on('data', function(data) { buffers.push(data); });
  var workbook = null
  await stream.on('end', function() {
    var buffer = Buffer.concat(buffers);
    workbook = XLSX.read(buffer, {type:"buffer"});
  });
  return workbook
}

//remove células das linhas que correspondem as colunas nao previstas na estrutura da planilha
function removerColunasNaoPrevistasNaPlanilhaDasLinhas(linhas, colunasAExcluir){
  var linhasFiltradas = []
  linhas.map( (linha) => {
    linha = linha.filter((celula, index) => {
      return colunasAExcluir.indexOf(index) === -1 
    })
    linhasFiltradas.push(linha)
  })
  return linhasFiltradas
}

//remove colunas nao previstas na estrutura da planilha
function removerColunasNaoPrevistasNaPlanilhaDoCabecalho(cabecalho){
  var colunasAExcluir = []
  var cabecalhoFiltrado = []
  var colunasJaEncontradas = [] //fiz esse controle para o caso de repetição da mesma coluna na planilha
  var index = 0
  for (item of cabecalho) {
    var achouColuna = false
    if (item != null){
      Planilha.estrutura.colunasAtualizaveis().map(colunaAtualizavel => {
        colunaAtualizavel.getNomesPossiveis().map(nomePossivel =>{
          if (Helper.isIguais(item, nomePossivel) &&
            colunasJaEncontradas.indexOf(colunaAtualizavel) == -1){
            colunasJaEncontradas.push(colunaAtualizavel)
            achouColuna = true
          }
        })
      })
    }
    if (achouColuna){
      cabecalhoFiltrado.push(item)
    }
    else{
      colunasAExcluir.push(index)
    }
    index ++
  }
  cabecalho = cabecalhoFiltrado
  return {cabecalho, colunasAExcluir}
}


/* Monta o update considerando os campos que compoe a chave (e vieram na planilha)
na clausula where e os campos que nao compoe a chave logica (e vieram na planilha)
para serem atualizados */
const montarUpdatePlanilha = (colunas) => {
  var colunasNaoChave = Planilha.estrutura.colunasNaoChave()
  var colunasNaoChavePlanilha = []
  var colunasChavePlanilha = []
  var parametrosNaoChave = []
  var parametrosChave = []
  //A montagem dos parametros foi feita assim, para poder preencher usando a propria
  //linha tal qual ela veio, logo eles têm que seguir a ordem exata dos campos que lá estão
  colunas.filter((coluna, index) => {
    if (colunasNaoChave.indexOf(Planilha.estrutura.obterColuna(coluna)) > -1){
      colunasNaoChavePlanilha.push(coluna)
      parametrosNaoChave.push('$'+(index+1))
    } else{
      colunasChavePlanilha.push(coluna)
      parametrosChave.push('$'+(index+1))
    }
  })
  var colunasBancoNaoChave = Planilha.estrutura.colunasBanco(colunasNaoChavePlanilha)
  var sql =  "update vaga set (" + colunasBancoNaoChave.join(',').toLowerCase() + ") = (" + parametrosNaoChave.join(',') + ")"; 

  colunasBanco = Planilha.estrutura.colunasBanco(colunasChavePlanilha)  
  var where = " where (" + colunasBanco.join(',').toLowerCase() + ") = (" + parametrosChave.join(',') + ")";

  return sql+where
}

const montarConsultaPelosCamposChave = (cabecalho, linha) => {
  var colunasBancoChave = []
  var parametrosChave = []
  cabecalho.filter((colunaCabecalho, index) => {
    var coluna = Planilha.estrutura.obterColuna(colunaCabecalho)
    if (coluna.snChave){
      colunasBancoChave.push(coluna.nomeColunaBanco)
      parametrosChave.push(linha[index])
    } 
  })
  var sql =  "select * from vaga where (" + colunasBancoChave.join(',').toLowerCase() + ") = ('" + parametrosChave.join("','") + "')"; 

  return sql
}

const montarInsertPlanilha = (colunas) => {
  var colunasBanco = Planilha.estrutura.colunasBanco(colunas)
  return "insert into vaga (" + colunasBanco.join(',').toLowerCase() + ") values(" + montarValues(colunasBanco.length) + ")"; 
}

const montarValues = (tamanho, inicio) => {
  values = ""
  var ind = (inicio ? inicio : 1)
  for (i=ind; i<= (tamanho+ind-1); i++){
    values += "$"+ i + "," 
  }
  return values.substring(0, values.length-1)
}

const validarColunasObrigatorias = (cabecalho) => {
  Planilha.estrutura.colunasObrigatorias().map((coluna) => {
    var achouColuna = false
    coluna.getNomesPossiveis().map(nomePossivel => {
      if (cabecalho.find(elemento => Helper.isIguais(elemento, nomePossivel))){  
        achouColuna = true
      }
    })
    if (!achouColuna){
      throw 'Coluna ' + coluna.nome + ' não encontrada. Nomes possíveis (acentos e espaços não importam):' + 
        coluna.getNomesPossiveis().map(nome => (' ' + nome))
    }
  })
}

//Valida conteúdo das celulas de acordo com métodos previstos na estrutura
//da planilha
const validarLinhas = async (cabecalho, linhas) => {
  for (let linha of linhas){
    var posicao = -1
    for (let celula of linha){
      posicao = posicao + 1
      var coluna = Planilha.estrutura.obterColuna(cabecalho[posicao])
        //Planilha.estrutura.colunas[cabecalho[posicao].toUpperCase()]
      if (coluna){
        if (coluna.validar){
          var msgValidacao = ''
          if (coluna.colunaDependente){
            msgValidacao = await coluna.validar(celula, 
              linha[Helper.obterPosicao(cabecalho, coluna.colunaDependente())])
              //linha[cabecalho.indexOf(coluna.colunaDependente)])
          } else {
            msgValidacao = coluna.validar(celula)
          }
          if (msgValidacao){
            throw msgValidacao
          }
        }
      }
    }
  }
}


  

module.exports = {
    importarPlanilha, listar, excluir, alterar, excluirPlanilha, listarPlanilhas
}
