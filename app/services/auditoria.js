const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

const log = async (usuario, metodo, mensagem, erro) => {
    const client = await pool.connect()
    client.query('insert into auditoria (usuario, metodo, mensagem, erro) values ($1, $2, $3, $4)', 
        [usuario, metodo, mensagem, erro])    
}

const listar = async function (req, res, next) {
    var jwt = require('jsonwebtoken')
    jwt.verify(req.token, process.env.SECRET, async (err, decoded) => {
        if (err) {
            Helper.enviaErroAdequado(err, res)
        }
        else {
            try{     
                var registrosAuditoria = await buscar()
                res.status(200).json( {registrosAuditoria: registrosAuditoria})
            }
            catch(error){
                res.status(401).json({error: `Error ao listar dados de auditoria ${error}`})
            }
        }
    })
}

const buscar = async (filtro) => {
    var auditorias = null
    try{
        var sql = 'select * from auditoria where true = true '
        if (filtro){
            if (filtro.usuario){
                sql += ' and usuario = \'' + filtro.usuario + '\''
            }
            if (filtro.metodo){
                sql += ' and metodo = ' + filtro.metodo
            }
            if (filtro.datahorainicio && filtro.datahorafim){
                sql += ' and datahora between \'' + filtro.datahorainicio + '\' and \'' + filtro.datahorafim + '\''
            }
        }
        var auditorias = await (await pool.query(sql)).rows
        return auditorias
    }
    catch(error){
        console.log(chalk.red('Problema ao buscar dados de auditoria: ', error))
        throw 'Problema ao buscar dados de auditorias: ' + error
    }
}

module.exports ={
    log, listar
}