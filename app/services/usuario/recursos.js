const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})


const listarTodosItensMenu = async () =>{
    var sql = "select * from recurso where snmenu "
    var itensMenu = await (await pool.query(sql)).rows
    return itensMenu 
}

module.exports = {
    listarTodosItensMenu
}