import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"

export default async function handler(req, res) {
    const administratorJwt = req.body.administratorJwt
    const payload = await jwt.parseJwt(administratorJwt)
    const electionId = payload.electionId
    const election = await mysql.loadElection(electionId)

    await mysql.startElection(electionId)

    election.voters.forEach(async v => {
        const voterJwt = await jwt.buildJwt({ kind: "voter", electionId, voterId: v.id })

        const voterLink = `${process.env.API_URL_BROWSER}vote/${voterJwt}`

        console.log(voterLink)

        v.email.split(',').forEach(email => {
            const message = {
                from: mailer.from,
                to: email.trim(),
                subject: `${election.name}: Voto Solicitado`,
                text: `
Prezado(a) ${v.name},

A votação "${election.name}" foi iniciada.

Utilize o link abaixo para votar secretamente:

${voterLink}

Atenção: 

- Não compartilhe este link para que ninguém possa votar em seu nome.

- Não apague esse email pois sem o link acima não será possível votar.

- Depois de votar, não será possível trocar o voto.

Obrigado por utilizar o Votejus.

---
TRF2-VOTEJUS-${electionId}`}

            mailer.transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(info);
                }
            })
        })
    })



    res.status(200).json({ status: 'OK' });
}