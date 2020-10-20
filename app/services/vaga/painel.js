
var Helper = require('../helper/helper.js')
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})



const incluirConsulta = async(req, res) => {
    try{
        let consultaPainel = req.body.consultapainel
        validaConsultaPainel(consultaPainel)
        var filtros = consultaPainel.filtros
        var saidas = consultaPainel.saidas
        var nome = consultaPainel.nome
        var sql = ''
        if (consultaPainel.consultaPainelId === null){
            sql = 'insert into consultapainel '
            if (filtros.length > 0){
                sql += '(nome, filtros, saidas) values (\'' + nome + '\',\'' + filtros.join() + '\',\'' + saidas.join() + '\')'
            } else {
                sql += '(nome, saidas) values (\'' + nome + '\',\'' + saidas.join() + '\')'
            }
        }
        await pool.query(sql)
        res.status(200).json( {message: 'Consulta salva com sucesso', vaga})    
        Auditoria.log(req.app.usuario, 'painel.salvarconsulta', req.body.consultapainel, null)              
    }
    catch (error){
        console.log(chalk.red('Erro ao alterar vagas', error))
        res.status(401).json({error: `Error ao gravar dados: ${error}`})
        Auditoria.log(req.app.usuario, 'vagas.alterar', new Date(), req.body.vaga, error)              
    }    
}

module.exports = {
    incluirConsulta
}