function gerarId(itens){
    var id = 0;
    itens.map((item)=> {
        item.id > id ? id = item.id : id = id
    })
    return ++id
}

function carregaDadosBanco(){
    const fs = require('fs');
    let rawdata = fs.readFileSync(process.env.DB_FILE_PATH);
    return JSON.parse(rawdata);
}

const gravaDadosBanco = async (dados) => {
    const fs = require('fs');
    return fs.writeFile(process.env.DB_FILE_PATH, JSON.stringify(dados, null, 2), 
        (error) => {
            return error
        });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function enviaErroAdequado(err, res) {
    let msgErro = "Token não encontrado"
    if (err.name.startsWith('TokenExpiredError')) {
        console.log('Token expirado')
        msgErro = "Sessão expirada, atualize a página para realizar novo login"
    }
    res.status(440).send({error: msgErro})
}

function encripta(senha) {
    const crypto = require('crypto')
    let senhaHash = crypto.createHash('sha512').update(senha).digest('hex')
    return senhaHash
}

module.exports = {
    gerarId, carregaDadosBanco, gravaDadosBanco, 
    sleep, enviaErroAdequado, encripta
  };
