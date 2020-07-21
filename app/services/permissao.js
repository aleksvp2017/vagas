var Helper = require('./helper.js')
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

const menu = (email) => {
    var menuPadrao = ['Fale Conosco', 'Vagas']
    if (email === process.env.EMAIL_FALECONSCO){
        menuPadrao.push('Usuarios')
        menuPadrao.push('Auditoria')
    }
    return menuPadrao
}


const autenticacao = (req, res, next) => {
    var Rotas = require('../routes/routes.js')
    if (Rotas.isRotaRequerAutenticacao(req.originalUrl, req.method)){
        var jwt = require('jsonwebtoken')
        jwt.verify(req.token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                Helper.enviaErroAdequado(err, res)
            }
            else {    
                req.app.usuario = 'aleksvp@gmail.com'
                next()
            }
        })
    }
    else{
        next()
    }
}

const autorizacao = async (req, res, next) => {
    var Rotas = require('../routes/routes.js')
    if (Rotas.isRotaRequerAutenticacao(req.originalUrl, req.method)){
        var rota = Rotas.obterRota(req.originalUrl, req.method)
        var temPermissao = await isTemPermissao(req.app.usuario, rota.nomeComponente, rota.metodo )
        if (!temPermissao){
            res.status(401).send({error: 'Usuário não autorizado para essa funcionalidade'})
        }
        else{
            next()
        }
    }
    else{
        next()
    }
}

const isTemPermissao = async (usuario, componente, metodo) => {
    var temPermissao = false
    var sql = "select * from permissao p inner join usuario u on u.usuarioid = p.usuarioid " +
                " where u.email = $1 and p.componente = $2"
    var permissoes = await (await pool.query(sql, [usuario, componente])).rows
    if (permissoes && permissoes.length > 0){
        permissoes.map(permissao => {
            if (!permissao.metodo || permissao.metodo === metodo){
                temPermissao = true
            }
        })
    }
    return temPermissao
}


module.exports = {
    menu, autenticacao, autorizacao
}