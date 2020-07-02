var express = require('express') //servidor http
var app = express()

//necessario para evitar o erro cors acessando localhost
var cors = require('cors')
app.use(cors())

//modulos necessários para leitura do token jwt
var bearerToken = require('express-bearer-token')
app.use(bearerToken())
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//para ler .env
const dotenv = require('dotenv')
dotenv.config()

//USUÁRIOS
var Usuario = require('./app/services/usuario.js')
app.post('/login', Usuario.login)
app.post('/usuarios', Usuario.registrar)
app.post('/usuarios/incluir', Usuario.incluir)
app.post('/recuperarSenha', Usuario.recuperarSenha)
app.post('/usuarios/:id', Usuario.alterar)
app.delete('/usuarios', Usuario.excluir)
app.post('/alterarSenha', Usuario.alterarSenha)
app.get('/usuarios', Usuario.listar)

//AUDITORIA
var Auditoria = require('./app/services/auditoria.js')
app.get('/auditoria', Auditoria.listar)

//Para ler arquivo enviado no posto
const multer = require("multer")
//VAGAS
var Vagas = require('./app/services/vagas.js')
//o nome tem que bater com o do parâmetro enviado no formdata
app.post('/vagas/importar', multer().array("fileuploaded"), Vagas.importarPlanilha)
app.get('/vagas', Vagas.listar)
app.delete('/vagas', Vagas.excluir)
app.post('/vagas/:id', Vagas.alterar)

//WELCOME
app.get('/bemvindo', (request, response, next) => {
    response.status(200).json({ mensagem: "Seja bem vindo ao Vagas local" })
} )


//MENSAGENS
var Mensagem = require('./app/services/mensagem.js')
app.post('/mensagem', Mensagem.enviar)

const chalk = require('chalk');
app.listen(process.env.PORT, () => { console.log(chalk.underline.blue('Server up and listening at ' + process.env.PORT))})

console.log(process.env.DATABASE_URL)