const chalk = require('chalk')

const enviarEmail = (assunto, mensagem, destinatario) => {
    return new Promise((resolve,reject)=>{
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: 'aleksvp@gmail.com',
            pass: process.env.SECRET_PROVEDOR_EMAIL
            }
        });
        
        var mailOptions = {
            from: 'aleksvp@gmail.com',
            to: destinatario,
            subject: assunto,
            html: mensagem
        };
        

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error)
            }
            else {
                resolve('Mensagem enviada com sucesso')
            }
        });
    })
}

const enviar = async function (req, res, next) {
    console.log(req)
    enviarEmail(req.body.assunto, req.body.mensagem, req.body.destinatario).then((message) => {
        res.status(200).json({ message })
    }).catch(error => {
        console.log(chalk.red(error))
        res.status(401).json({ error: `Error ao enviar mensagem ${error}` })
    })
}

module.exports = {
    enviar, enviarEmail
}
