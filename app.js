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

//guarda usuario em requisicoes autenticadas, setado pelo permissao.js, usado para auditoria
var usuario = ''

var Rotas = require('./app/routes/routes.js')

//Middleware para checar autenticação
var Permissao = require('./app/services/permissao.js')
app.use(Permissao.autenticacao)
app.use(Permissao.autorizacao)

//Monta rotas
Rotas.routes.map(rota => {
    if (rota.outroMiddleware){
        app[rota.metodohttp](rota.uri, rota.outroMiddleware, rota.componente[rota.metodo])
    }
    else{
        app[rota.metodohttp](rota.uri, rota.componente[rota.metodo])
    }
})

const chalk = require('chalk');
app.listen(process.env.PORT, () => { console.log(chalk.underline.blue('Server up and listening at ' + process.env.PORT))})

console.log(process.env.DATABASE_URL)