const chalk = require('chalk');

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

function trocaCaracteresAcentuados(texto){
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function isIguais(texto1, texto2){
    const parsedTexto1 = texto1.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
    const parsedTexto2 = texto2.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
    // console.log(chalk.green(parsedTexto1, ' é igual a ', parsedTexto2))
    return parsedTexto1 === parsedTexto2
}  

//obtem posicao do texto no vetor, desconsiderando maiusculas/minusculas e acentos
function obterPosicao(vetorDeTextos, texto){
    var posicaoDoTexto = -1
    vetorDeTextos.map((item, indice) => {
        if (isIguais(item, texto)){
            posicaoDoTexto = indice
        }
    })
    return posicaoDoTexto
}

module.exports = {
    gerarId, carregaDadosBanco, gravaDadosBanco, 
    sleep, enviaErroAdequado, encripta, isIguais, obterPosicao,
    trocaCaracteresAcentuados
  };

  