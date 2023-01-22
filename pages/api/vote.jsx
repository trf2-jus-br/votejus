import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"

export default async function handler(req, res) {
    const voterJwt = req.body.voterJwt
    const payload = await jwt.parseJwt(voterJwt)
    const electionId = payload.electionId
    const voterId = payload.voterId
    const candidateId = req.body.candidateId

    const election = await mysql.loadElection(electionId)
    const voter = election.voters.find(async v => v.id === voterId)

    if (!voter) throw `Votante ${voterId} não encontrado`

    await mysql.vote(electionId, voterId, candidateId)

    voter.email.split(',').forEach(email => {
        mailer.sendVoteAccepted(email, electionId, election.name, voter.name)
    })

    res.status(200).json({ status: 'OK' });
}