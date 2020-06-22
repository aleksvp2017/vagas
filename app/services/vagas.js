const chalk = require('chalk')
var fs = require('fs')
var XLSX = require('xlsx')
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})
const Planilha = require('./planilha.js')
var Helper = require('./helper.js')
var Auditoria = require('./auditoria.js')


const alterar =  async (req, res) => {
  var jwt = require('jsonwebtoken')
  jwt.verify(req.token, process.env.SECRET, async (err, decoded) => {
      console.log(decoded)
      if (err){
          Helper.enviaErroAdequado(err, res)
      }
      else{
          try{
              let vaga = req.body.vaga
              await validar(vaga)
              let result = await pool.query(montarUpdate(req.body.vaga))
              vaga = result.rows[0]
              Auditoria.log(decoded.email, 'vagas.alterar', req.body.vaga, null)
              res.status(200).json( {message: 'Dados alterados com sucesso', vaga})    
          }
          catch (error){
              console.log(chalk.red('Erro ao alterar vagas, error'))
              Auditoria.log(decoded.email, 'vagas.alterar', new Date(), req.body.vaga, error)
              res.status(401).json({error: `Error ao gravar dados: ${error}`})
          }
      }
  })
}

async function validar(vaga) {
  await Promise.all(Object.entries(vaga).map(async (campo) => {
    let coluna = Planilha.estrutura.colunas[campo[0].toUpperCase()]
    if (coluna) {
      let msgErro = ''
      if (coluna.colunaDependente){
        msgErro = await coluna.validar(campo[1], vaga[coluna.colunaDependente.toLowerCase()])
      } else {
        msgErro = coluna.validar(campo[1])
      }
      if (msgErro) {
        throw msgErro
      }
    }
  }))
}

const montarUpdate = (vagas) => {
  var update = ''
  Planilha.estrutura.colunasAtualizaveis.map(coluna =>{
    if (vagas[coluna]){
      update += ',' + coluna + ' = \'' + vagas[coluna] + '\''
    }
  })
  return 'update vaga set ' + update.substring(1, update.length) + ' where vagaid = ' + vagas['vagaid'] + ' returning *'
}

const excluir =  async (req, res) => {
  var jwt = require('jsonwebtoken')
  jwt.verify(req.token, process.env.SECRET, async (err, decoded) => {
      if (err){
          Helper.enviaErroAdequado(err, res)
      }
      else{
          try{
              let ids = req.body.vagas.map(vaga => vaga.vagaid)
              await pool.query('delete from vaga where vagaid in (' + ids.join(',') + ')')
              res.status(200).json( {message: 'Vagas excluídas com sucesso'})    
          }
          catch (error){
              res.status(401).json({error: `Error ao excluir vagas ${error}`})
          } 
      }
  })
}

const listar = async (req, res) => {
  var jwt = require('jsonwebtoken')
  jwt.verify(req.token, process.env.SECRET, async (err, decoded) => {
      if (err) {
          Helper.enviaErroAdequado(err, res)
      }
      else {
          try{
              let vagas = await (await pool.query('select * from vaga order by vagaid')).rows
              res.status(200).json({ vagas })
          }
          catch(error){
              console.log(chalk.red('erro ao buscar vagas', error))
          }              
      }
  })
}


const importarPlanilha = async function (req, res) {
  try{
    let {linhas, cabecalho} = await carregarLinhasPlanilha(req)   
    verificarLinhasIdenticasNaPlanilha(linhas, cabecalho)
    await apagarLinhasIdenticas(linhas, cabecalho)
    const sqlInsert = montarInsert(cabecalho)
    const client = await pool.connect()
    for (const linha of linhas){
      await client.query(sqlInsert, linha)
    }
    res.status(200).json({ message: "Dados carregados com sucesso" })
  }
  catch (error){
    res.status(401).json({ error })
  }
}

//Apaga linhas iguais já persistidas 
async function apagarLinhasIdenticas(linhas, cabecalho){
  var clausulasExclusao = ""
  for (linha of linhas){
    var clausulaExclusao = ""
    Planilha.estrutura.colunasIdentificamUnicamente.map(coluna => {
      let posicao = cabecalho.indexOf(coluna.toUpperCase())
      if (posicao !== -1){
        clausulaExclusao += '\''+ linha[cabecalho.indexOf(coluna.toUpperCase())] + '\','
      }
    })
    clausulasExclusao += "(" + clausulaExclusao.slice(0, clausulaExclusao.length - 1) + "),"
  }
  var sqlDelete = montarDelete(cabecalho) + "(" + clausulasExclusao.slice(0, clausulasExclusao.length-1) + ")"
  const client = await pool.connect()
  await client.query(sqlDelete)
}

//Monta delete de acordo com as colunas que identificam unicamente uma vaga que estejam presentes no cabecalho
const montarDelete = (cabecalho) => {
  var colunas = []
  Planilha.estrutura.colunasIdentificamUnicamente.map(coluna => {
    if (cabecalho.indexOf(coluna.toUpperCase()) !== -1){
      colunas.push(coluna)
    }
  })
  return "delete from vaga where (" + colunas.join(',').toLowerCase() + ") in "
}

//Verifica linhas identicas na propria planilha
function verificarLinhasIdenticasNaPlanilha(linhas, cabecalho){
  var linhasIdenticas = []
  var indiceLinha = 0
  for (linha of linhas){
    var outrasLinhas = linhas.slice(indiceLinha+1)
    for (outraLinha of outrasLinhas){
      if (vagasIguais(linha, outraLinha, cabecalho)){
          linhasIdenticas.push(linha)
      }
    }
    indiceLinha ++
  }
  if (linhasIdenticas.length > 0){
    throw "Linhas idênticas encontradas na planilha: " + linhasIdenticas
  }
}

//Compara duas vagas pelos campos que identificam uma vaga
function vagasIguais(vagaA, vagaB, cabecalho){
  var snIguais = true
  Planilha.estrutura.colunasIdentificamUnicamente.map( coluna => {
    var indexColuna = cabecalho.indexOf(coluna.toUpperCase())
    if (vagaA[indexColuna] !== vagaB[indexColuna]){
      snIguais = false
    }
  })

  return snIguais
}


async function carregarLinhasPlanilha(req) {  
  //carrega o arquivo que veio na requisicao
  const streamifier = require('streamifier')
  if (req.files.length <= 0){
    throw 'Nenhum arquivo encontrado'
  }
  var stream = streamifier.createReadStream(req.files[0].buffer)
  var workbook = await transformStreamInWorkbook(stream)
  //carrega a aba
  var planilha = workbook.Sheets[Planilha.estrutura.nome]
  if (planilha == null){
    throw 'Nome da página / aba da planilha deve ser ' + Planilha.estrutura.nome
  }
  //carrega as linhas
  var matrizDados = XLSX.utils.sheet_to_json(planilha, { header: 1, raw: true, defval:null })
  if (matrizDados.length <= 1){
    throw 'Sem linhas de dados na planilha'
  }

  //remove colunas nao previstos na estrutura da planilha 
  let {cabecalho, colunasAExcluir} = removerColunasNaoPrevistasNaPlanilha(matrizDados[0])
  validarColunasObrigatorias(cabecalho)
  //extrai as linhas da matriz - tira so o cabecalho
  var linhas = matrizDados.splice(1,matrizDados.length)
  linhas = removerColunasNaoPrevistasNaPlanilhaDasLinhas(linhas, colunasAExcluir)
  //valida linhas de acordo com o previsto na estrutura da planilha
  await validarLinhas(cabecalho, linhas)
  
return {linhas, cabecalho}
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
function removerColunasNaoPrevistasNaPlanilha(cabecalho){
  var colunasAExcluir = []
  cabecalho = cabecalho.filter((item, index) => {
    if (Planilha.estrutura.colunasAtualizaveis.find(colunaAtualizavel => 
        colunaAtualizavel.toUpperCase() === item.toUpperCase()))
      {
      return true
    }
    else{
      colunasAExcluir.push(index)
      return false
    }
  })
  return {cabecalho, colunasAExcluir}
}



const montarInsert = (colunas) => {
  return "insert into vaga (" + colunas.join(',').toLowerCase() + ") values(" + montarValues(colunas.length) + ")"; 
}

const montarValues = (tamanho) => {
  values = ""
  for (i=1; i<= tamanho; i++){
    values += "$"+ i + "," 
  }
  return values.substring(0, values.length-1)
}

const validarColunasObrigatorias = (cabecalho) => {
  Planilha.estrutura.colunasObrigatorias.map((coluna) => {
    if (!cabecalho.find(elemento => elemento.toUpperCase() === coluna)){
      throw 'Coluna ' + coluna + ' não encontrada.'
    }
  })
}

const validarLinhas = async (cabecalho, linhas) => {
  for (let linha of linhas){
    var posicao = -1
    for (let celula of linha){
      posicao = posicao + 1
      var coluna = Planilha.estrutura.colunas[cabecalho[posicao].toUpperCase()]
      if (coluna){
        var msgValidacao = ''
        if (coluna.colunaDependente){
          msgValidacao = await coluna.validar(celula, linha[cabecalho.indexOf(coluna.colunaDependente)])
        } else {
          msgValidacao = coluna.validar(celula)
        }
        if (msgValidacao){
          throw msgValidacao
        }
      }
    }
  }


  // linhas.map(async (linha) => {
  //   await Promise.all(linha.map(async (celula, posicao) => {
  //     var coluna = Planilha.estrutura.colunas[cabecalho[posicao].toUpperCase()]
  //     if (coluna){
  //       var msgValidacao = ''
  //       if (coluna.depende){
  //         msgValidacao = await coluna.validar(celula, linha[cabecalho.indexOf(coluna.depende)])
  //       } else {
  //         msgValidacao = coluna.validar(celula)
  //       }
        
  //       if (msgValidacao){
  //         throw msgValidacao
  //       }
  //     }
  //   }))
  // })
}


  

module.exports = {
    importarPlanilha, listar, excluir, alterar 
}
