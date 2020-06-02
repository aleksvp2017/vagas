const menu = (email) => {
    var menuPadrao = ['Fale Conosco', 'Vagas']
    if (email === process.env.EMAIL_FALECONSCO){
        menuPadrao.push('Usuarios')
    }
    return menuPadrao
}

module.exports = {
    menu
}