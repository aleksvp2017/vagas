
var Helper = require('../helper/helper.js')
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})



const consultar = async() => {
    
}

module.exports = {
    consultar
}