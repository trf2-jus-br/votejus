import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"

export default async function handler(req, res) {
    const administratorJwt = req.body.administratorJwt
    const payload = await jwt.parseJwt(administratorJwt)
    const electionId = payload.electionId
    const election = await mysql.loadElection(electionId)
    const voterEmail = req.body.voterEmail.trim().toLowerCase()

    const voterId = req.body.voterId
    const voter = election.voters.find(async v => v.id !== voterId)
    if (!voter) throw `Votante ${voterId} não encontrado`

    await mysql.addEmail(electionId, voterId, voterEmail)

    const voterJwt = await jwt.buildJwt({ kind: "voter", electionId, voterId })
    const voterLink = `${process.env.API_URL_BROWSER}vote/${voterJwt}`

    if (process.env.LOG_LINKS) console.log(voterLink)

    mailer.sendVoteRequest(voterEmail, electionId, election.name, voter.name, voterLink)

    res.status(200).json({ status: 'OK' });
}