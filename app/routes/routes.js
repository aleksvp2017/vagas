const Usuario = require('../services/usuario.js')
const Auditoria = require('../services/auditoria.js')
const Vagas = require('../services/vagas.js')
const multer = require("multer")
const Mensagem = require('../services/mensagem.js')


const outroMiddleware = multer().array("fileuploaded")

var routes = [
    //USUARIOS
    { uri: '/login', metodohttp: 'post', componente: Usuario, metodo: 'login', requerAutenticacao: false},
    { uri: '/usuarios', metodohttp: 'post', componente: Usuario, metodo: 'registrar', requerAutenticacao: false},
    { uri: '/usuarios/incluir', metodohttp: 'post', componente: Usuario, metodo: 'incluir', requerAutenticacao: true},
    { uri: '/recuperarSenha', metodohttp: 'post', componente: Usuario, metodo: 'recuperarSenha', requerAutenticacao: true},
    { uri: '/usuarios/:id', metodohttp: 'post', componente: Usuario, metodo: 'alterar', requerAutenticacao: true},
    { uri: '/usuarios', metodohttp: 'delete', componente: Usuario, metodo: 'excluir', requerAutenticacao: true},
    { uri: '/alterarSenha', metodohttp: 'post', componente: Usuario, metodo: 'alterarSenha', requerAutenticacao: true},
    { uri: '/usuarios', metodohttp: 'get', componente: Usuario, metodo: 'listar', requerAutenticacao: true},
    //AUDITORIA
    { uri: '/auditoria', metodohttp: 'get', componente: Auditoria, metodo: 'listar', requerAutenticacao: true},
    //VAGAS
    { uri: '/vagas/importar', metodohttp: 'post', componente: Vagas, metodo: 'importarPlanilha', requerAutenticacao: true,
        outroMiddleware: multer().array("fileuploaded")},
    { uri: '/vagas', metodohttp: 'get', componente: Vagas, metodo: 'listar', requerAutenticacao: true},
    { uri: '/vagas', metodohttp: 'delete', componente: Vagas, metodo: 'excluir', requerAutenticacao: true},
    { uri: '/vagas/:id', metodohttp: 'post', componente: Vagas, metodo: 'alterar', requerAutenticacao: true},
    //MENSAGEM
    { uri: '/mensagem', metodohttp: 'post', componente: Mensagem, metodo: 'enviar', requerAutenticacao: true},
];

function isRotaRequerAutenticacao(uri) {
    var requerAutenticacao = false
    routes.map(route => {
        if (route.uri === uri){
            requerAutenticacao = route.requerAutenticacao
        }
    })
    return requerAutenticacao
}

module.exports = {
    routes, isRotaRequerAutenticacao
}
