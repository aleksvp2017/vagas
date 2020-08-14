/*PERMISSOES
TABELA DE RECURSOS
	- Guarda os componentes que podem ou não serem itens de menu;
	- Quando são, têm uma correspondência com componentes da UI via o path;
	- Itens de menu têm que ser cadastrados aqui;
	- Coluna "nome" é o que vai aparecer no menu;
	- Coluna "path" é usada para mapear com as rotas definidas na UI;
	- Para ter acesso a um item de menu, tem que ter acesso a pelo menos uma operação.

TABELA DE OPERACOES
	- As permissões são checadas usando as operações;
	- Como o BE é acionado sempre através da chamada de um endpoint, URI, e um método
	http, é assim que é checada a permissão <uri, usuario, nomeOperacao>
		
routes.js na UI
	- Foi preciso manter esse arquivo, porque mapeia a rota (path) com o componente,
	que não é só uma string, é uma referência a um objeto;
	- O campo nome é usado para obter as rotas dentro da própria UI, quando preciso
	alguma navegação, via botão Registrar no Login, por exemplo;
	- path e component é o necessário para o Vue-Router;
	- requiredAuth é usado para "proteger" os paths que requerem autenticação,
	direcionando para a página de login na tentativa de acesso não logado.
	
routesjs no BE
	- De acordo com a uri e método htpp, mapeia o componente, o método respectivo e 
	se requer ou não autenticação;
*/

var Helper = require('./helper.js')
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})


const menu = async (req, res) => {
    try{
        var usuario = req.query.usuario.email
        var itensMenu = await obterMenu(usuario)
        res.status(200).json( {menu: itensMenu})
    }
    catch (error){
        res.status(401).json({error})
    }
}

const obterMenu = async(usuario) => {
    var sql = " select distinct r.* from recurso r  " +
                " inner join operacao op on op.recursoid = r.recursoid " +
                " inner join permissao p on op.operacaoid = p.operacaoid " +
                " inner join usuario u on u.usuarioid = p.usuarioid " +
                " where r.snmenu and u.email = $1 "
    var itensMenu = await (await pool.query(sql, [usuario])).rows
    return itensMenu
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
                req.app.usuario = decoded.email
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
        var temPermissao = await isTemPermissao(req.app.usuario, rota.uri, rota.metodo )
        if (!temPermissao){
            res.status(401).send({error: 'Usuário não autorizado para operação '})
        }
        else{
            next()
        }
    }
    else{
        next()
    }
}

const isTemPermissao = async (usuario, uri, metodo) => {
    //console.log(uri, metodo)
    var sql = " select * from permissao p " +
              " inner join operacao op on op.operacaoid = p.operacaoid " +
              " inner join recurso r on r.recursoid = op.recursoid " +
              " inner join usuario u on u.usuarioid = p.usuarioid " +
              " where u.email = $1 and op.nome = $2 and op.uri = $3 "
    var permissoes = await (await pool.query(sql, [usuario, metodo, uri])).rows
    return (permissoes && permissoes.length > 0)
}

module.exports = {
    menu, autenticacao, autorizacao, obterMenu
}