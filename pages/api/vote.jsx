import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"
import { apiHandler } from "../../utils/apis"

const handler = async function (req, res) {
    const voterJwt = req.body.voterJwt
    const payload = await jwt.parseJwt(voterJwt)
    const electionId = payload.electionId
    const voterId = payload.voterId
    const candidateId = req.body.candidateId
    const xFormardedFor = req.headers['x-forwarded-for']
    const remoteAddress = req.socket.remoteAddress
    const ip = xFormardedFor ? xFormardedFor : remoteAddress

    const election = await mysql.loadElection(electionId)
    const voter = election.voters.find(v => v.id === voterId)
    if (!voter) throw `Eleitor ${voterId} não encontrado`

    await mysql.vote(electionId, voterId, candidateId, ip)

    voter.email.split(',').forEach(email => {
        mailer.sendVoteAccepted(email, electionId, election.name, voter.name, ip)
    })

    res.status(200).json({ status: 'OK' });
}

export default apiHandler({
    'POST': handler
});