const chalk = require('chalk')
var fs = require('fs')
var XLSX = require('xlsx')
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})
const Planilha = require('./planilha.js')
var Helper = require('./helper.js')


const alterar =  async (req, res) => {
  var jwt = require('jsonwebtoken')
  jwt.verify(req.token, process.env.SECRET, async (err, decoded) => {
      if (err){
          Helper.enviaErroAdequado(err, res)
      }
      else{
          try{
              let vaga = req.body.vaga
              validar(vaga)
              let result = await pool.query(montarUpdate(req.body.vaga))
              vaga = result.rows[0]
              res.status(200).json( {message: 'Dados alterados com sucesso', vaga})    
          }
          catch (error){
              console.log(chalk.red('Erro ao alterar vagas, error'))
              res.status(401).json({error: `Error ao gravar dados: ${error}`})
          }
      }
  })
}

function validar(vaga) {
  Object.entries(vaga).map((campo) => {
    let coluna = Planilha.estrutura.colunas[campo[0].toUpperCase()]
    if (coluna) {
      let msgErro = coluna.validar(campo[1])
      if (msgErro) {
        throw msgErro
      }
    }
  })
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
              let vagas = await (await pool.query('select * from vaga')).rows
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
    const sqlInsert = montarInsert(cabecalho)
    console.log(sqlInsert)
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

async function carregarLinhasPlanilha(req) {  
  const streamifier = require('streamifier')
  if (req.files.length <= 0){
    throw 'Nenhum arquivo encontrado'
  }
  var stream = streamifier.createReadStream(req.files[0].buffer)
  var workbook = await transformStreamInWorkbook(stream)
  var planilha = workbook.Sheets[Planilha.estrutura.nome]
  if (planilha == null){
    throw 'Nome da página / aba da planilha deve ser ' + Planilha.estrutura.nome
  }
  var matrizDados = XLSX.utils.sheet_to_json(planilha, { header: 1, raw: true })
  if (matrizDados.length <= 1){
    throw 'Sem linhas de dados na planilha'
  }

  
  let {cabecalho, colunasAExcluir} = removerColunasAdicionais(matrizDados[0])
  console.log(colunasAExcluir)
  validarCabecalho(cabecalho)
  var linhas = matrizDados.splice(1,matrizDados.length)
  linhas = removerColunasAdicionaisDasLinhas(linhas, colunasAExcluir)
  console.log(linhas)
  validarLinhas(cabecalho, linhas)
return {linhas, cabecalho}
}

function removerColunasAdicionaisDasLinhas(linhas, colunasAExcluir){
  var linhasFiltradas = []
  linhas.map( (linha) => {
    linha = linha.filter((celula, index) => {
      return colunasAExcluir.indexOf(index) === -1 
    })
    linhasFiltradas.push(linha)
  })
  return linhasFiltradas
}

function removerColunasAdicionais(cabecalho){
  var colunasAExcluir = []
  cabecalho = cabecalho.filter((item, index) => {
    if (Planilha.estrutura.colunasAtualizaveis.indexOf(item) > -1){
      return true
    }
    else{
      colunasAExcluir.push(index)
      return false
    }
  })
  return {cabecalho, colunasAExcluir}
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

const validarCabecalho = (cabecalho) => {
  Planilha.estrutura.colunasObrigatorias.map((coluna) => {
    if (!cabecalho.find(elemento => elemento.toUpperCase() === coluna)){
      throw 'Coluna ' + coluna + ' não encontrada.'
    }
  })
}

const validarLinhas = (cabecalho, linhas) => {
  linhas.map((linha) => {
    linha.map((celula, posicao) => {
      var coluna = Planilha.estrutura.colunas[cabecalho[posicao].toUpperCase()]
      if (coluna){
        let msgValidacao = coluna.validar(celula)
        if (msgValidacao){
          throw msgValidacao
        }
      }
    })
  })
}


  

module.exports = {
    importarPlanilha, listar, excluir, alterar 
}
