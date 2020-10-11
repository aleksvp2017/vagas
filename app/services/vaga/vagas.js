const chalk = require('chalk')
var XLSX = require('xlsx')
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})
const EstruturaVagas = require('./estruturavagas.js')
var Helper = require('../helper/helper.js')
var Auditoria = require('../auditoria/auditoria.js')
var Mensagem = require('../usuario/mensagem.js')


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
    let coluna = EstruturaVagas.estrutura.colunas[campo[0].toUpperCase()]
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
  EstruturaVagas.estrutura.colunasAtualizaveis.map(coluna =>{
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
      res.status(401).json({error: `Error ao consultar dados: ${error}`})
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
  var alterarLinhasJaExistentes = JSON.parse(req.body.snAlterarRegistrosExistentes)
  var resumoImportacao = []
  var jaRespondido = false
  var passos = []
  try{
    var inicioDaImportacao = Date.now()

    adicionaPassos(passos,'Carregando planilha')
    let {linhas, cabecalho} = await carregarLinhasPlanilha(req, passos, resumoImportacao)   
    adicionaPassos(passos,'Planilha carregada')

    //Esse limite é por duas coisas: usuário não ficar plantado esperando; 
    //depois de um tempo, vue-resource refaz a requisição se não tiver tido resposta
    if (linhas.length > 500){
      jaRespondido = true
      res.status(200).json({ message: "Não precisa esperar, você receberá um e-mail ao final do processamento da planilha." })
    }
    
    //verificarLinhasIdenticasNaPlanilha(linhas, cabecalho)

    //Na planilha as linhas podem vir com maior nível de detalhamento,
    //por exemplo por escola. Assim é preciso agrupar essas linhas
    adicionaPassos(passos,'Agrupando linhas identicas')
    linhas = await EstruturaVagas.agruparLinhasIdenticas(linhas, cabecalho)
    resumoImportacao.push({nome:'Número de linhas depois do agrupamento',detalhe: linhas.length})

    //A depender do caso, pode ser um insert ou update
    adicionaPassos(passos,'Montando sqls')
    const sqlInsert = montarInsertPlanilha(cabecalho)
    const sqlUpdate = montarUpdatePlanilha(cabecalho)

    const client = await pool.connect()

    adicionaPassos(passos,'Percorrendo linhas para inserir ou atualizar os dados')
    var linhasInseridas = 0
    var linhasAlteradas = 0
    for (const linha of linhas){
      var sql = sqlInsert
      //adicionaPassos(passos,'Verificando existencia da linha')
      var linhaExistente = await obterLinha(cabecalho, linha)
      if (linhaExistente){
        if (!alterarLinhasJaExistentes){
          sql = null
        }
        else{
          //verifica se tem algo a atualizar (ou seja, algum campo nao chave diferente)
          var mudouAlgumCampoNaoChave = false
          EstruturaVagas.estrutura.colunasNaoChave().map(colunaNaoChave => {
            var valorCampo = obterCampo(cabecalho, linha, colunaNaoChave)
            if (linhaExistente[colunaNaoChave.nomeColunaBanco] !== valorCampo){
              mudouAlgumCampoNaoChave = true
            }
          })
          if (mudouAlgumCampoNaoChave){
            linhasAlteradas++
            sql = sqlUpdate
          }
          else{
            sql = null
          }
        }
      } else{
        linhasInseridas++
      }
      if (sql){       
        //adicionaPassos(passos,'Executando sql:', sql) 
        await client.query(sql, linha)
        //passos = passos.slice(0, passos.length-1)
      }
      //passos = passos.slice(0, passos.length-1)
    }
    resumoImportacao.push({nome:'Linhas inseridas',detalhe: linhasInseridas})
    resumoImportacao.push({nome:'Linhas alteradas (já existiam na base antes da importação)',detalhe: linhasAlteradas})

    var fimDaImportacao = Date.now()
    var tempoTotal = ((fimDaImportacao - inicioDaImportacao)/1000) + ' segundos '
    console.log(tempoTotal)
    resumoImportacao.push({nome: 'Tempo de importação',detalhe:tempoTotal})
    if (!jaRespondido){
      res.status(200).json({ message: "Dados carregados com sucesso", detalheMensagem: resumoImportacao })
      var mensagem = formatarMensagem(resumoImportacao)
      Mensagem.enviarEmail('e-Vagas: Planilha processada', mensagem, req.app.usuario)
    }
    else{
      var mensagem = formatarMensagem(resumoImportacao)
      Mensagem.enviarEmail('e-Vagas: Planilha processada', mensagem, req.app.usuario)
    }
    Auditoria.log(req.app.usuario, 'vagas.importarplanilha', {cabecalho: cabecalho}, null)          
    console.log('Resumo da importação:')
    console.log(resumoImportacao)
  }
  catch (error){
    console.log('Passos realizados até o erro:', passos)
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

function formatarMensagem(resumoImportacao){
  var mensagem = ' <br/> Planilha processada com sucesso. <br/>'

  resumoImportacao.map(item => {
    mensagem += 
      "<li><b>" + item.nome + " </b> : " + item.detalhe + "</li>"
  })

  return mensagem
}

function obterCampo(cabecalho, linha, colunaNaoChave){
  var valorCampo = ''
  cabecalho.map((coluna, index) => {
    if (EstruturaVagas.estrutura.obterColuna(coluna).nomeColunaBanco === colunaNaoChave){
      valorCampo = linha[index]
    }
  })
  return valorCampo
}

async function obterLinha(cabecalho, linha){
  var sql = montarConsultaPelosCamposChave(cabecalho, linha)
  //console.log(sql)
  let vagas = await (await pool.query(sql)).rows
  if (vagas && vagas.length > 0){
    return vagas[0]
  }
  return null
}

async function carregarLinhasPlanilha(req, passos, resumoImportacao) {  
  //carrega o arquivo que veio na requisicao
  adicionaPassos(passos,'Carregando arquivo com streamifier')
  const streamifier = require('streamifier')
  if (req.files.length <= 0){
    throw 'Nenhum arquivo encontrado'
  }
  var stream = streamifier.createReadStream(req.files[0].buffer)
  var workbook = await transformStreamInWorkbook(stream)
  
  //carrega a aba, tem um nome padrão, mas pode vir especificado na requisição
  var nomeAba = EstruturaVagas.estrutura.nome
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
    //Pega a primeira aba da planilha se não tiver passado o nome nem for o nome padrão
    if (!req.body.nomeAba && workbook.SheetNames.length > 0){
      planilha = workbook.Sheets[workbook.SheetNames[0]]
    }
    else{
      throw 'Não encontra página / aba da planilha com nome ' + nomeAba
    }
  }
  resumoImportacao.push({nome:'Nome da aba carregada', detalhe: nomeAba})

  //carrega as linhas
  adicionaPassos(passos,'Carregando matriz de dados')
  var matrizDados = XLSX.utils.sheet_to_json(planilha, { header: 1, raw: false, defval:null })
  if (matrizDados.length <= 1){
    throw 'Sem linhas de dados na planilha'
  }
  resumoImportacao.push({nome:'Número de linhas na planilha (inclui linhas em branco)',detalhe: matrizDados.length})

  //extrai as linhas da matriz - tira so o cabecalho
  var linhas = matrizDados.splice(1,matrizDados.length)

  adicionaPassos(passos,'Removendo linhas vazias')
  linhas = removeLinhasComTodasColunasVazias(linhas)
  resumoImportacao.push({nome:'Número de linhas com dados preenchidas na planilha ',detalhe: linhas.length})
  
  //remove colunas nao previstas na estrutura da planilha 
  //retorna, alem do cabecalho ja sem as colunas, o indice das colunas que deverão
  //ser excluidas nas linhas
  adicionaPassos(passos,'Removendo colunas nao previstas do cabecalho')
  let {cabecalho, colunasAExcluir} = removerColunasNaoPrevistasNaPlanilhaDoCabecalho(matrizDados[0])
  resumoImportacao.push({nome:'Colunas consideradas',detalhe: cabecalho})

  //remove, das linhas, as colunas não previstas na estrutura da planilha
  adicionaPassos(passos,'Removendo colunas nao previstas das linhas')
  linhas = removerColunasNaoPrevistasNaPlanilhaDasLinhas(linhas, colunasAExcluir)

  //adicionaPassos(passos,'Replicando coluna mapeada para mais de uma coluna no BD')
  //replicaColunaDaPlanilhaMapeadaComMaisDeUmaColuna(linhas, cabecalho)
  
  adicionaPassos(passos,'Inferindo tipo de curso pela carga horária quando não especificado')
  infereTipoDeCurso(linhas, cabecalho)

  adicionaPassos(passos,'Infere rede pela instituição de ensino')
  await infereRedePelaInstituicao(linhas, cabecalho)

  adicionaPassos(passos,'Validando colunas obrigatorias')
  validarColunasObrigatorias(cabecalho)
    
  //Alguns parametros podem ser enviados via requisicao ou em cada linha
  //Faz sentido pois esses dados podem ser constantes em todas as linhas em alguns casos
  //Exemplo: dataaprovacao, datamatricula, periodo de pactuacao
  //Porém, especialmente pensando em grandes cargas, foi preciso manter a possibilidade 
  //de manter esses dados linha a linha
  adicionaPassos(passos,'Incluindo parametros que vieram via requisicao')
  incluiNasLinhasParametrosViaRequisicao(req, linhas, cabecalho)

  adicionaPassos(passos,'Incluindo nome da planilha de origem dos dados')
  incluiNasLinhasPlanilhaDeOrigemDosDados(linhas, cabecalho, req.files[0].originalname)

  adicionaPassos(passos,'Substituindo conteudo por valores padronizados')
  substituiConteudoPorValoresPadronizado(linhas, cabecalho)

  adicionaPassos(passos,'Substitui campos com valor monetarios por numérico')
  substituiCamposComValorMonetariosPorNumerico(linhas, cabecalho)

  //valida linhas de acordo com o previsto na estrutura da planilha
  //tem o await devido à possibilidade de validação que envolva BD
  await validarLinhas(cabecalho, linhas)
  
  linhas = aplicarUpperCaseNasColunasNaoNumericas(linhas)

return {linhas, cabecalho}
}

function adicionaPassos(passos, passo){
  passos.push(passo)
  console.log(passo)
}

function replicaColunaDaPlanilhaMapeadaComMaisDeUmaColuna(linhas, cabecalho){
  var indiceCabecalho = 0
  for (nomeColuna of cabecalho) {
    var colunas = EstruturaVagas.estrutura.obterColunas(nomeColuna)
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

function substituiCamposComValorMonetariosPorNumerico(linhas, cabecalho){
  var indiceLinha = 2 //por causa do cabecalho
  for (linha of linhas){
    var indiceColuna = 0
    for (nomeColuna of cabecalho){
      var coluna = EstruturaVagas.estrutura.obterColuna(nomeColuna)
      if (coluna.snMoeda){
        try{
          if (linha[indiceColuna]){
            linha[indiceColuna] = linha[indiceColuna].replace('R$','').replace('-','').trim()
            if (linha[indiceColuna] === ''){
              linha[indiceColuna] = 0
            }
          }
        }
        catch (error){
          throw error + ' (linha ' + indiceLinha + ')'
        }
      }
      else if (coluna.snNumero){
        try{
          if (linha[indiceColuna]){
            linha[indiceColuna] = linha[indiceColuna].replace(',','')
          }
        }
        catch (error){
          throw error + ' (linha ' + indiceLinha + ')'
        }
      }
      else {
        if (linha[indiceColuna]){
          linha[indiceColuna] = linha[indiceColuna].replace('\'','')
        }
      }

      indiceColuna++
    }
    indiceLinha++
  } 
}

function substituiConteudoPorValoresPadronizado(linhas, cabecalho){
  var indiceLinha = 2 //por causa do cabecalho
  for (linha of linhas){
    var indiceColuna = 0
    for (nomeColuna of cabecalho){
      var coluna = EstruturaVagas.estrutura.obterColuna(nomeColuna)
      if (coluna.snValoresPadrao){
        try{
          linha[indiceColuna] = coluna.obterValorPadrao(linha[indiceColuna])
        }
        catch (error){
          throw error + ' (linha ' + indiceLinha + ')'
        }
      }
      indiceColuna++
    }
    indiceLinha++
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
  //var hoje = new Date()
  // linhas.map(linha => linha.push(nomeAba + ' ' + hoje.toLocaleTimeString() + ' ' + 
  //   hoje.toLocaleDateString('pt-br')))
  linhas.map(linha => linha.push(nomeAba))    
  cabecalho.push(EstruturaVagas.estrutura.colunas.NOMEPLANILHA.nomeColunaBanco)
}

const listarInstituicoes = async (req, res) => {
  try{
      let instituicoes = await (await pool.query('select sigla, esfera from instituicaoensino')).rows
      return instituicoes
  }
  catch(error){
      console.log(chalk.red('erro ao buscar instituicoes', error))
  }              
}

async function infereRedePelaInstituicao(linhas, cabecalho){
  var instituicoesNaoEncontradas = ''
  //Se não veio a rede
  if (!temColuna(EstruturaVagas.estrutura.colunas.REDE, cabecalho)){
    var instituicoes = await listarInstituicoes()
    linhas.map(linha => {
      var posicao = Helper.obterPosicao(cabecalho, EstruturaVagas.estrutura.colunas.INSTITUICAO)
      var instituicao = linha[posicao]
      var achouInstituicao = false
      instituicoes.map(instituicaoCadastrada => {
        if (Helper.isIguais(instituicaoCadastrada.sigla, instituicao)){
          linha.push(instituicaoCadastrada.esfera)
          achouInstituicao = true
        }
      })
      //Se não achou a instituicao, o mais provável é que seja estadual
      if (!achouInstituicao){
        if (instituicoesNaoEncontradas.indexOf(instituicao) == -1){
          instituicoesNaoEncontradas += instituicao
          Mensagem.enviarEmail('e-Vagas: Instituição de ensino não cadastrada', 'Instituição não cadastrada: ' + instituicao, 'aleksvp@gmail.com')
        }
        linha.push('Estadual')
      }
    })
    cabecalho.push(EstruturaVagas.estrutura.colunas.REDE.nomeColunaBanco)
  }  
}

function infereTipoDeCurso(linhas, cabecalho){
  //Se não veio o tipo de curso, mas veio carga horária, infere o tipo pela carga
  if (!temColuna(EstruturaVagas.estrutura.colunas.TIPODECURSO, cabecalho) && 
        temColuna(EstruturaVagas.estrutura.colunas.CARGAHORARIA, cabecalho) ){
    const CARGA_HORARIA_MINIMA_CURSO_TECNICO = 800
    linhas.map(linha => {
      var posicao = Helper.obterPosicao(cabecalho, EstruturaVagas.estrutura.colunas.CARGAHORARIA)
      var cargaHoraria = parseInt(linha[posicao])
      if (cargaHoraria >= CARGA_HORARIA_MINIMA_CURSO_TECNICO){
        linha.push(EstruturaVagas.estrutura.colunas.TIPODECURSO.obterValorPadrao('tecnico'))
      }
      else{
        linha.push(EstruturaVagas.estrutura.colunas.TIPODECURSO.obterValorPadrao('fic'))
      }
    })
    cabecalho.push(EstruturaVagas.estrutura.colunas.TIPODECURSO.nomeColunaBanco)
  }  
}

function incluiNasLinhasParametrosViaRequisicao(req, linhas, cabecalho){
  //PERIODO
  //Checa se já não tem na planilha e se veio na requisicao
  if (!temColuna(EstruturaVagas.estrutura.colunas.PERIODOPACTUACAO, cabecalho) && req.body.periodoPactuacao){
    linhas.map(linha => linha.push(req.body.periodoPactuacao))
    cabecalho.push(EstruturaVagas.estrutura.obterColuna('periodopactuacao').nomeColunaBanco)
  }
  //DATAAPROVACAO
  if (!temColuna(EstruturaVagas.estrutura.colunas.DATAAPROVACAO, cabecalho) && req.body.dataAprovacao){
    linhas.map(linha => linha.push(req.body.dataAprovacao))
    cabecalho.push(EstruturaVagas.estrutura.colunas.DATAAPROVACAO.nomeColunaBanco)
  }  

  //DATAMATRICULA
  if (!temColuna(EstruturaVagas.estrutura.colunas.DATAMATRICULA, cabecalho) && req.body.dataMatricula){
    linhas.map(linha => linha.push(req.body.dataMatricula))
    cabecalho.push(EstruturaVagas.estrutura.colunas.DATAMATRICULA.nomeColunaBanco)
  }  

  //SNCONTRAPARTIDA
  if (!temColuna(EstruturaVagas.estrutura.colunas.SNCONTRAPARTIDA, cabecalho) && req.body.sncontrapartida){
    linhas.map(linha => linha.push(req.body.sncontrapartida))
    cabecalho.push(EstruturaVagas.estrutura.colunas.SNCONTRAPARTIDA.nomeColunaBanco)
  }  

  //SEI
  if (!temColuna(EstruturaVagas.estrutura.colunas.SEI, cabecalho) && req.body.sei){
    linhas.map(linha => linha.push(req.body.sei))
    cabecalho.push(EstruturaVagas.estrutura.colunas.SEI.nomeColunaBanco)
  }  

  //TED
  if (!temColuna(EstruturaVagas.estrutura.colunas.TED, cabecalho) && req.body.ted){
    linhas.map(linha => linha.push(req.body.ted))
    cabecalho.push(EstruturaVagas.estrutura.colunas.TED.nomeColunaBanco)
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
    if (!EstruturaVagas.isTodasColunasVazias(linha)){
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
      EstruturaVagas.estrutura.colunasAtualizaveis().map(colunaAtualizavel => {
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
  var colunasNaoChave = EstruturaVagas.estrutura.colunasNaoChave()
  var colunasNaoChavePlanilha = []
  var colunasChavePlanilha = []
  var parametrosNaoChave = []
  var parametrosChave = []
  //A montagem dos parametros foi feita assim, para poder preencher usando a propria
  //linha com argumento da query tal qual ela veio, logo eles têm que seguir a ordem exata dos campos que lá estão
  colunas.filter((coluna, index) => {
    if (colunasNaoChave.indexOf(EstruturaVagas.estrutura.obterColuna(coluna)) > -1){
      colunasNaoChavePlanilha.push(coluna)
      parametrosNaoChave.push('$'+(index+1))
    } else{
      colunasChavePlanilha.push(coluna)
      parametrosChave.push('$'+(index+1))
    }
  })
  var colunasBancoNaoChave = EstruturaVagas.estrutura.colunasBanco(colunasNaoChavePlanilha)
  var sql =  "update vaga set (" + colunasBancoNaoChave.join(',').toLowerCase() + ") = (" + parametrosNaoChave.join(',') + ")"; 

  colunasBanco = EstruturaVagas.estrutura.colunasBanco(colunasChavePlanilha)  
  var where = " where (" + colunasBanco.join(',').toLowerCase() + ") = (" + parametrosChave.join(',') + ")";

  return sql+where
}

const montarConsultaPelosCamposChave = (cabecalho, linha) => {
  var colunasBancoChave = []
  var parametrosChave = []
  cabecalho.filter((colunaCabecalho, index) => {
    var coluna = EstruturaVagas.estrutura.obterColuna(colunaCabecalho)
    if (coluna.snChave){
      colunasBancoChave.push(coluna.nomeColunaBanco)
      parametrosChave.push(linha[index])
    } 
  })
  var sql =  "select * from vaga where (" + colunasBancoChave.join(',').toLowerCase() + ") = ('" + parametrosChave.join("','") + "')"; 
  return sql
}

const montarInsertPlanilha = (colunas) => {
  var colunasBanco = EstruturaVagas.estrutura.colunasBanco(colunas)
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
  EstruturaVagas.estrutura.colunasObrigatorias().map((coluna) => {
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
      var coluna = EstruturaVagas.estrutura.obterColuna(cabecalho[posicao])
        //EstruturaVagas.estrutura.colunas[cabecalho[posicao].toUpperCase()]
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

const listarColunas =  (req, res) => {
  var colunas = EstruturaVagas.listarColunas()
  res.status(200).json( {colunas})    
}
  

const gerarRelatorio = async (req, res) => {
  var colunas = req.body.colunas
  var filtros = req.body.filtros

  var sqlColunas = ''
  colunas.map(coluna => {
    if (sqlColunas){
      sqlColunas += ', '
    }
    if (coluna.snSomavel){
      sqlColunas += ' sum('
    }
    sqlColunas += coluna.nomeColunaBanco.replace('mais','+')
    
    if (coluna.snSomavel){
      sqlColunas += ' ) as ' + coluna.nomeColunaBanco
    }    
  })

  var sqlAgrupador = ''
  colunas.map(coluna => {
    if (!coluna.snSomavel){
      if (sqlAgrupador){
        sqlAgrupador += ', '
      }
      sqlAgrupador += coluna.nomeColunaBanco
    }
  })
  if (sqlAgrupador){
    sqlAgrupador = ' group by ' + sqlAgrupador
  }

  var sqlFiltros = ''
  filtros.map(filtro => { 
    if (sqlFiltros){
        sqlFiltros += ' and  '
    }

    filtro.nomeColunaBanco = filtro.nomeColunaBanco.replace('mais','+')
    sqlFiltros += filtro.nomeColunaBanco + ' = \'' + filtro.valor + '\''
    if (filtro.operador){
      var coluna = EstruturaVagas.estrutura.obterColuna(filtro.nomeColunaBanco)
      if (filtro.operador == 'maior que'){
        sqlFiltros =  filtro.nomeColunaBanco + ' > \'' + filtro.valor + '\''
      } else if (filtro.operador == 'menor que'){
        sqlFiltros =  filtro.nomeColunaBanco + ' < \'' + filtro.valor + '\''
      } else if (filtro.operador == 'contém'){
        if (coluna.snSomavel || coluna.snMoeda){
          sqlFiltros =  filtro.nomeColunaBanco + ' = \'' + filtro.valor + '\''
        } else {
          sqlFiltros =  filtro.nomeColunaBanco + ' ilike \'%' + filtro.valor + '%\''
        }
      } else if (filtro.operador == 'não contém'){
        if (coluna.snSomavel || coluna.snMoeda){
          sqlFiltros =  filtro.nomeColunaBanco + ' <> \'' + filtro.valor + '\''
        } else {
          sqlFiltros =  filtro.nomeColunaBanco + ' not ilike \'%' + filtro.valor + '%\''
        }
      }
    }

  })

  var sql = 'select ' + sqlColunas + ' from vaga where ' + sqlFiltros + sqlAgrupador
  console.log(sql)
  try{
    let vagas = await (await pool.query(sql)).rows
    res.status(200).json({ vagas, colunas: colunas.map(coluna => ({...coluna, text:coluna.nome, value:coluna.nomeColunaBanco})) })
  }
  catch(error){
    console.log(chalk.red('erro ao buscar vagas', error))
    res.status(401).json({error: `Error ao consultar dados: ${error}`})
  }     

}






module.exports = {
    importarPlanilha, listar, excluir, alterar, excluirPlanilha, listarPlanilhas, listarColunas, gerarRelatorio
}
