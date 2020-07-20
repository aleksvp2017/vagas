var Helper = require('./helper.js')

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
    if (Rotas.isRotaRequerAutenticacao(req.originalUrl)){
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

module.exports = {
    menu, autenticacao
}