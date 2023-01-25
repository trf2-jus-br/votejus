import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"
import { apiHandler } from "../../utils/apis"

const handler = async function (req, res) {
    const administratorJwt = req.body.administratorJwt
    const payload = await jwt.parseJwt(administratorJwt)
    const electionId = payload.electionId
    const election = await mysql.loadElection(electionId)

    await mysql.startElection(electionId)

    election.voters.forEach(async v => {
        const voterJwt = await jwt.buildJwt({ kind: "voter", electionId, voterId: v.id })
        const voterLink = `${process.env.API_URL_BROWSER}vote/${voterJwt}`

        if (process.env.LOG_LINKS) console.log(voterLink)

        v.email.split(',').forEach(email => {
            mailer.sendVoteRequest(email, electionId, election.name, v.name, voterLink)
        })
    })



    res.status(200).json({ status: 'OK' });
}

export default apiHandler({
    'POST': handler
});