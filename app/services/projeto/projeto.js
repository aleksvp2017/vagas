const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

const listar = async function (req, res, next) {
    try{     
        var projetos = await buscar()
        res.status(200).json( {projetos: projetos})
    }
    catch(error){
        res.status(401).json({error: `Error ao listar projetos ${error}`})
    }
}

const buscar = async () => {
    try{
        var sql = 'select * from projeto '
        var projetos = await (await pool.query(sql)).rows
        return projetos
    }
    catch(error){
        console.log(chalk.red('Problema ao buscar projetos: ', error))
        throw 'Problema ao buscar projetos: ' + error
    }
}

module.exports ={
    listar
}