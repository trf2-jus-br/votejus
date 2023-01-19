import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"

export default async function handler(req, res) {
    const administratorEmail = req.body.administratorEmail
    const electionName = req.body.electionName
    const voters = req.body.voters
    const candidates = req.body.candidates

    const votersArray = []
    voters.trim().split('\n').forEach(l => {
        const split = l.split(':')
        const name = split[0].trim()
        const email = split[1].trim()
        votersArray.push({ name, email })
    })

    const candidatesArray = []
    candidates.trim().split('\n').forEach(l => {
        const name = l.trim()
        candidatesArray.push({ name })
    })

    const electionId = await mysql.createElection(electionName, administratorEmail, votersArray, candidatesArray)

    const administratorJwt = await jwt.buildJwt({ kind: "administrator", electionId, electionName, electionId, administratorEmail })

    const administratorLink = `${process.env.API_URL_BROWSER}dashboard/${administratorJwt}`

    console.log(administratorLink)

    const message = {
        from: mailer.from,
        to: administratorEmail,
        subject: `${electionName}: Criada`,
        text: `
A votação "${electionName}" foi criada com sucesso.

Utilize o link abaixo para iniciar a votação e acompanhar os resultados.

${administratorLink}

Atenção: 

- Não compartilhe este link pois só o administrados da votação deve ter acesso ao link.

- Não apague esse email pois sem o link acima não será possível acessar o painel de votação.

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

    res.status(200).json({ status: 'OK' });
}