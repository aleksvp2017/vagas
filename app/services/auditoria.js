const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

const log = async (usuario, metodo, mensagem, erro) => {
    const client = await pool.connect()
    client.query('insert into auditoria (usuario, metodo, mensagem, erro) values ($1, $2, $3, $4)', 
        [usuario, metodo, mensagem, erro])    
}

module.exports ={
    log
}