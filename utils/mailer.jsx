const nodemailer = require('nodemailer')

const options = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secureConnection: false, // TLS requires secureConnection to be false
    secure: false,
    ignoreTLS: true,
    tls: {
        rejectUnauthorized: false
    }
}

export default {
    mailer: nodemailer,

    transporter: nodemailer.createTransport(options),

    from: process.env.SMTP_FROM,

    send(message) {
        this.transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                // console.log(info);
            }
        })
    },

    footer(electionId) {
        return `

Obrigado por utilizar o Votejus.

---
TRF2-VOTEJUS-${electionId}`
    },

    sendCreated(email, electionId, electionName, administratorLink) {
        this.send({
            from: this.from,
            to: email,
            subject: `${electionName}: Criada`,
            text: `A votação "${electionName}" foi criada com sucesso.
    
Utilize o link abaixo para iniciar a votação e acompanhar os resultados.

${administratorLink}

Atenção:

- Os eleitores só reberão um link por e-mail para votar quando a votação for iniciada.

- Não compartilhe este link pois só o administrados da votação deve ter acesso ao link.

- Não apague esse email pois sem o link acima não será possível acessar o painel de votação.` + this.footer(electionId)
        })
    },

    sendVoteRequest(email, electionId, electionName, voterName, voterLink) {
        this.send({
            from: this.from,
            to: email.trim(),
            subject: `${electionName}: Voto Solicitado`,
            text: `Prezado(a) ${voterName},

A votação "${electionName}" foi iniciada.

Utilize o link abaixo para votar sigilosamente:

${voterLink}

Atenção: 

- Não compartilhe este link para que ninguém possa votar em seu nome.

- Não apague esse email pois sem o link acima não será possível votar.

- Depois de votar, não será possível trocar o voto.` + this.footer(electionId)
        })
    },

    sendVoteAccepted(email, electionId, electionName, voterName, voterIp) {
        this.send({
            from: this.from,
            to: email.trim(),
            subject: `${electionName}: Voto Registrado`,
            text: `Prezado(a) ${voterName},

Seu voto sigiloso foi registrado para a eleição "${electionName}".` + this.footer(electionId)
        })
    },

    sendElectionEnded(email, electionId, electionName, voterName) {
        this.send({
            from: this.from,
            to: email.trim(),
            subject: `${electionName}: Eleição Finalizada`,
            text: `Prezado(a) ${voterName},

A votação "${electionName}" foi encerrada.` + this.footer(electionId)
        })
    }

}