const Usuario = require('../services/usuario.js')
const Auditoria = require('../services/auditoria.js')
const Vagas = require('../services/vagas.js')
const multer = require("multer")
const Mensagem = require('../services/mensagem.js')
const Helper = require('../services/helper.js')
const Permissao = require('../services/permissao.js')

var routes = [
    //nome do componente tem que bater com o nome do recurso 
    //PERMISSOES
    { uri: '/menu', metodohttp: 'get', componente: Permissao,  metodo: 'menu', requerAutenticacao: true},
    //USUARIOS
    { uri: '/login', metodohttp: 'post', componente: Usuario,  metodo: 'login', requerAutenticacao: false},
    { uri: '/usuarios', metodohttp: 'post', componente: Usuario, metodo: 'registrar', requerAutenticacao: false},
    { uri: '/usuarios/incluir', metodohttp: 'post', componente: Usuario, metodo: 'incluir', requerAutenticacao: true},
    { uri: '/recuperarSenha', metodohttp: 'post', componente: Usuario, metodo: 'recuperarSenha', requerAutenticacao: true},
    { uri: '/usuarios/:[0-9]+', metodohttp: 'post', componente: Usuario, metodo: 'alterar', requerAutenticacao: true},
    { uri: '/usuarios', metodohttp: 'delete', componente: Usuario, metodo: 'excluir', requerAutenticacao: true},
    { uri: '/alterarSenha', metodohttp: 'post', componente: Usuario, metodo: 'alterarSenha', requerAutenticacao: true},
    { uri: '/usuarios', metodohttp: 'get', componente: Usuario, metodo: 'listar', requerAutenticacao: true},
    //AUDITORIA
    { uri: '/auditoria', metodohttp: 'get', componente: Auditoria, metodo: 'listar', requerAutenticacao: true},
    //VAGAS
    { uri: '/vagas/importar', metodohttp: 'post', componente: Vagas,  metodo: 'importarPlanilha', requerAutenticacao: true,
        outroMiddleware: multer().array("fileuploaded")},
    { uri: '/vagas', metodohttp: 'get', componente: Vagas,  metodo: 'listar', requerAutenticacao: true},
    { uri: '/vagas', metodohttp: 'delete', componente: Vagas,  metodo: 'excluir', requerAutenticacao: true},
    { uri: '/vagas/:[0-9]+', metodohttp: 'post', componente: Vagas,  metodo: 'alterar', requerAutenticacao: true},
    //MENSAGEM
    { uri: '/mensagem', metodohttp: 'post', componente: Mensagem, metodo: 'enviar', requerAutenticacao: true},
];

function isRotaRequerAutenticacao(uri, metodohttp) {
    var rota = obterRota(uri, metodohttp)
    return rota.requerAutenticacao
}

function obterRota(uri, metodohttp) {
    var rota = {}
    routes.map(route => {
        let uriExp = new RegExp(route.uri)
        if (uriExp.test(uri) && Helper.isIguais(route.metodohttp,metodohttp)){
            rota = route
        }
    })
    return rota
}

module.exports = {
    routes, isRotaRequerAutenticacao, obterRota
}
