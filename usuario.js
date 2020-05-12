var Helper = require('./helper.js')
var Mensagem = require('./mensagem.js')
const chalk = require('chalk')

const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
/*
//export DATABASE_URL=postgres://quintoitinerario:quintoitinerario@localhost:5432/postgres
*/

const validar = async (email, password) => {
    var validUser = null
    try{
        let result = await pool.query('select * from usuario where email=$1 and senha=$2', [email, password])
        if (result){
            validUser = result.rows[0]
        }
    }
    catch(error){
        console.log(chalk.red('erro ao buscar usuarios', error))
    }
    return validUser
}


const login = async function (req, res, next) {
    var usuario = await validar(req.body.usuario.email, req.body.usuario.senha)
    if (usuario != null) {
        var jwt = require('jsonwebtoken')
        let token = jwt.sign({
            name: usuario.nome,
            email: usuario.email
        }, process.env.SECRET, {
            expiresIn: 6000
        })
        res.status(200).json({ auth: true, usuario: { ...usuario, senha: '', token: token } })
        next()
    }
    else {
        res.status(401).json({ error: 'E-mail ou senha incorretos' })
    }
}

const buscar = async (filtro) => {
    var user = null
    try{
        var result = null
        if (filtro.email){
            result = await pool.query('select * from usuario where email=$1', [filtro.email])
        }
        else if (filtro.id){
            result = await pool.query('select * from usuario where id=$1', [filtro.id])
        }
        if (result){
            user = result.rows[0]
        }
    }
    catch(error){
        console.log(chalk.red('erro ao buscar usuarios', error))
    }
    console.log(user)
    return user
}

const registrar = async function(req, res, next) {
    //verifica se ja existe email na base
    var usuario = await buscar({email:req.body.usuario.email})
    if (usuario == null){
        try{
            usuario = req.body.usuario
            await pool.query('insert into usuario (nome, email, senha) values ($1,$2,$3)', 
                [usuario.nome, usuario.email, usuario.senha])
            res.status(200).json( {message: 'Usuário registrado com sucesso'})
        }
        catch(error){
            res.status(401).json({error: `Error ao gravar dados ${error}`})
        }
    }
    else{
        res.status(401).json({error: 'E-mail já registrado'})
    }
}

async function regerarSenhaUsuario(usuario) {
    let senhaGerada = Math.random().toString(36).slice(-8)
    usuario.senha = Helper.encripta(senhaGerada)
    let erroAoGravar = false
    try{
        await pool.query('update usuario set senha = $1 where usuarioid = $2', 
            [usuario.senha, usuario.usuarioid])
    }
    catch(error){
        erroAoGravar = true
    }
    return { erroAoGravar, senhaGerada }
}

const recuperarSenha = async function (req, res, next) {
    var usuario = await buscar({ email: req.body.email })
    if (usuario == null) {
        res.status(401).json({ error: 'Email não cadastrado' })
    }
    else {
        let { erroAoGravar, senhaGerada } = await regerarSenhaUsuario(usuario)
        if (erroAoGravar) {
            res.status(401).json({ error: `Error ao gravar dados ${erroAoGravar}` })
        }
        else {
            Mensagem.enviarEmail('Redefinição de senha', `Sua nova senha é ${senhaGerada}`, req.body.email).then((mensagem) => {
                res.status(200).json({ message: 'Nova senha enviada com sucesso' })
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
                res.status(200).json( {message: 'Dados alterados com sucesso'})
            }
            catch(error){
                res.status(401).json({error: `Error ao gravar dados ${error}`})
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
                await pool.query('delete from usuario where usuarioid = $1', [req.params.id])
                res.status(200).json( {message: 'Usuário excluído com sucesso'})
            }
            catch(error){
                res.status(401).json({error: `Error ao gravar dados ${error}`})
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
                    res.status(200).json( {message: 'Senha alterada com sucesso'})
                }
                catch(error){
                    res.status(401).json({error: `Error ao alterar senha ${error}`})
                }
            }
        }
    })
}

module.exports = {
    login, registrar, buscar, recuperarSenha, alterar, excluir, alterarSenha
}