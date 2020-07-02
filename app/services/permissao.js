const menu = (email) => {
    var menuPadrao = ['Fale Conosco', 'Vagas']
    if (email === process.env.EMAIL_FALECONSCO){
        menuPadrao.push('Usuarios')
        menuPadrao.push('Auditoria')
    }
    return menuPadrao
}

module.exports = {
    menu
}