var Helper = require('./helper.js')
var mensagem = require('./mensagem.js')
const chalk = require('chalk')
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const Permissao = require('./permissao')

const validar = async (email, senha) => {
    var usuarioValido = null
    try{
        let usuarios = await buscar({email:email, senha: senha})
        if (usuarios){
            usuarioValido = usuarios[0]
        }
        return usuarioValido
    }
    catch(error){
        console.log(chalk.red('Problema ao validar usuário: ', error))
        throw 'Problema ao validar usuário: ' + error
    }
}


const login = async function (req, res, next) {
    var usuario = await validar(req.body.usuario.email, req.body.usuario.senha)
    if (usuario != null) {
        if (!usuario.snativo){
            res.status(401).json({ error: 'Usuário não ativo, por gentileza, aguarde a ativação.' })
            return
        }
        var jwt = require('jsonwebtoken')
        let token = jwt.sign({
            name: usuario.nome,
            email: usuario.email
        }, process.env.SECRET, {
            expiresIn: 86400 //24h
        })
        res.status(200).json({ auth: true, usuario: { ...usuario, senha: '', token: token, menu: Permissao.menu(usuario.email) }})
        next()
    }
    else {
        res.status(401).json({ error: 'E-mail ou senha incorretos' })
    }
}

const listar = async function (req, res, next) {
    var jwt = require('jsonwebtoken')
    jwt.verify(req.token, process.env.SECRET, async (err, decoded) => {
        if (err) {
            Helper.enviaErroAdequado(err, res)
        }
        else {
            try{     
                var usuarios = await buscar()
                res.status(200).json( {usuarios: usuarios})
            }
            catch(error){
                res.status(401).json({error: `Error ao listar usuários ${error}`})
            }
        }
    })
}

const buscar = async (filtro) => {
    var usuarios = null
    try{
        var sql = 'select * from usuario where true = true '
        if (filtro){
            if (filtro.email){
                sql += ' and email = \'' + filtro.email + '\''
            }
            if (filtro.id){
                sql += ' and usuarioid = ' + filtro.usuarioid
            }
            if (filtro.senha){
                sql += ' and senha = \'' + filtro.senha + '\''
            }
        }
        var usuarios = await (await pool.query(sql)).rows
        return usuarios
    }
    catch(error){
        console.log(chalk.red('Problema ao buscar usuarios: ', error))
        throw 'Problema ao buscar usuarios: ' + error
    }
}

const inserir = async(usuario) => {
    try{
        let result = await pool.query('insert into usuario (nome, email, senha, snativo) values ($1,$2,$3, $4) returning *', 
                [usuario.nome, usuario.email, usuario.senha, usuario.snativo])
        return result.rows[0]      
    }
    catch (error){
        console.log(chalk.red('Problema ao inserir usuario: ', error))
        throw 'Problema ao inserir usuario: ' + error        
    }
}
const registrar = async function(req, res, next) {
    var usuarios = await buscar({email:req.body.usuario.email})
    if (!usuarios || usuarios.length === 0){
        try{
            var usuario = req.body.usuario
            await inserir({...usuario, snativo: false})
            res.status(200).json( {mensagem: 'Usuário registrado com sucesso'})
            mensagem.enviarEmail('Usuário a espera de aprovação:' + usuario.email, 'Usuário a espera de aprovação:' + usuario.email, 
                process.env.EMAIL_FALECONSCO)
        }
        catch(error){
            res.status(401).json({error: `Problema ao gravar dados ${error}`})
        }
    }
    else{
        res.status(401).json({error: 'E-mail já registrado'})
    }
}

const incluir = async function(req, res, next) {
    var usuarios = await buscar({email:req.body.usuario.email})
    if (!usuarios || usuarios.length === 0){
        try{
            usuario = req.body.usuario
            var {senhaHash, senha} = gerarSenha()
            usuario.senha = senhaHash
            usuario = await inserir({...usuario, snativo: false})
            var mensagem = 'Usuário cadastrado com sucesso.'
            if (usuario.snativo){
                mensagem.enviarEmail('Cadastro no sistema Vagas',
                    'Você foi cadastrado no sistema <a href=\'https://vagas-ui.herokuapp.com/\'>Vagas</a>. '+ "<br/>" +
                    'Caso não queria manter esse cadastro, responda esse e-mail com a palavra cancelar ou exclua sua conta pelo próprio sistema no menu de Dados Pessoais. '+ "<br/>"+
                    'Seu usuário é ' + usuario.email + ' e sua senha ' + senha + "<br/>", usuario.email)
                    mensagem += ' Foi enviado e-mail ao usuário com sua senha.'
            }else{
                mensagem += ' Não foi enviado e-mail ao usuário pois ele encontra-se não ativo.'
            }
            usuario.senha = ''
            res.status(200).json( {mensagem, usuario})
        }
        catch(error){
            res.status(401).json({error: `Problema ao gravar dados ${error}`})
        }
    }
    else{
        res.status(401).json({error: 'E-mail já registrado'})
    }
}

function gerarSenha(){
    let senhaGerada = Math.random().toString(36).slice(-8)
    return {senhaHash: Helper.encripta(senhaGerada), senha: senhaGerada}
}

async function regerarSenhaUsuario(usuario) {
    var {senhaHash, senha} = gerarSenha()
    usuario.senha = senhaHash
    let erroAoGravar = false
    try{
        await pool.query('update usuario set senha = $1 where usuarioid = $2', 
            [usuario.senha, usuario.usuarioid])
    }
    catch(error){
        erroAoGravar = true
    }
    return { erroAoGravar, senhaGerada: senha }
}

const recuperarSenha = async function (req, res, next) {
    var usuarios = await buscar({email:req.body.email})
    if (!usuarios || usuarios.length === 0){
        res.status(401).json({ error: 'Email não cadastrado' })
    }
    else {
        var usuario = usuarios[0]
        let { erroAoGravar, senhaGerada } = await regerarSenhaUsuario(usuario)
        if (erroAoGravar) {
            res.status(401).json({ error: `Error ao gravar dados ${erroAoGravar}` })
        }
        else {
            mensagem.enviarEmail('Redefinição de senha', `Sua nova senha no Vagas é ${senhaGerada}`, req.body.email).then((mensagem) => {
                res.status(200).json({ mensagem: 'Nova senha enviada com sucesso' })
                next()
            }).catch(error => {
                console.log(chalk.red(error))
                res.status(401).json({ error: `Error ao enviar mensagem ${error}` })
            })
        }
    }
}

const alterar = async function (req, res, next) {
    var jwt = require('jsonwebtoken')
    jwt.verify(req.token, process.env.SECRET, async (err, decoded) => {
        if (err) {
            Helper.enviaErroAdequado(err, res)
        }
        else {
            try{
                let usuario = req.body.usuario
                await pool.query('update usuario set nome = $1, email = $2 where usuarioid = $3', 
                    [usuario.nome, usuario.email, usuario.usuarioid])
                res.status(200).json( {mensagem: 'Dados alterados com sucesso'})
            }
            catch(error){
                res.status(401).json({error: `Problema ao gravar dados ${error}`})
            }
        }
    })
}

const excluir = async function (req, res) {
    var jwt = require('jsonwebtoken')
    jwt.verify(req.token, process.env.SECRET, async (err, decoded) => {
        if (err) {
            Helper.enviaErroAdequado(err, res)
        }
        else {
            try{
                let ids = req.body.usuarios.map(usuario => usuario.usuarioid)
                await pool.query('delete from usuario where usuarioid in (' + ids.join(',') + ')')
                res.status(200).json( {mensagem: 'Usuário(s) excluído(s) com sucesso'})
            }
            catch(error){
                res.status(401).json({error: `Problema ao gravar dados ${error}`})
            }
        }
    })
}

const alterarSenha = async function (req, res, next) {
    var jwt = require('jsonwebtoken')
    jwt.verify(req.token, process.env.SECRET, async (err, decoded) => {
        if (err) {
            Helper.enviaErroAdequado(err, res)
        }
        else {
            var usuario = await validar(req.body.usuario.email, req.body.usuario.senha)
            if (usuario == null) {
                res.status(401).json({ error: 'Senha atual incorreta' })
            }
            else {
                try{
                    let usuario = req.body.usuario
                    await pool.query('update usuario set senha = $1 where usuarioid = $2', 
                        [req.body.senhaNova, usuario.usuarioid])
                    res.status(200).json( {mensagem: 'Senha alterada com sucesso'})
                }
                catch(error){
                    res.status(401).json({error: `Error ao alterar senha ${error}`})
                }
            }
        }
    })
}

module.exports = {
    login, registrar, recuperarSenha, alterar, excluir, alterarSenha, listar, incluir
}