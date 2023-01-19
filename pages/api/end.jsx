import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"

export default async function handler(req, res) {
    const administratorJwt = req.body.administratorJwt
    const payload = await jwt.parseJwt(administratorJwt)
    const electionId = payload.electionId
    const election = await mysql.loadElection(electionId)

    await mysql.endElection(electionId)

    election.voters.forEach(async v => {
        const voterJwt = await jwt.buildJwt({ kind: "voter", electionId, voterId: v.id })

        const voterLink = `${process.env.API_URL_BROWSER}vote/${voterJwt}`

        v.email.split(',').forEach(email => {
            const message = {
                from: mailer.from,
                to: email.trim(),
                subject: `${election.name}: Eleição Finalizada`,
                text: `
Prezado(a) ${v.name},

A votação "${election.name}" foi encerrada.

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