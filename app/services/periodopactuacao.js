const chalk = require('chalk')
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

const obter = async (req, res) => {
    try{
        let periodos = await (await pool.query('select * from periodopactuacao where snaberto')).rows
        if (periodos && periodos.length > 0){
            res.status(200).json({ periodopactuacao: periodos[0] })
        }
        else{
            return null
        }
    }
    catch(error){
        console.log(chalk.red('Problema ao buscar período', error))
    } 
}

module.exports = {
    obter
}