const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

const obter = async (nome, uf) => {
    try{
        let municipios = await (await pool.query('select * from municipio where nome ilike $1 and uf ilike $2', [nome, uf])).rows
        if (municipios && municipios.length > 0){
            return municipios[0]
        }
        else{
            return null
        }
    }
    catch(error){
        console.log(chalk.red('Problema ao buscar município', error))
    } 
}

module.exports = {
    obter
}