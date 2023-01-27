import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"
import { apiHandler } from "../../utils/apis"
import validate from '../../utils/validate'

const handler = async function (req, res) {
    const administratorJwt = req.body.administratorJwt
    const payload = await jwt.parseJwt(administratorJwt)
    const electionId = payload.electionId
    const election = await mysql.loadElection(electionId)
    const voterEmail = validate.voterEmail(req.body.voterEmail)

    const voterId = req.body.voterId
    const voter = election.voters.find(v => v.id === voterId)
    if (!voter) throw `Eleitor ${voterId} não encontrado`

    if (election.end) throw `Eleição ${election.name} já foi finalizada`

    await mysql.addEmail(electionId, voterId, voterEmail)

    if (election.start) {
        const voterJwt = await jwt.buildJwt({ kind: "voter", electionId, voterId })
        const voterLink = `${process.env.API_URL_BROWSER}vote/${voterJwt}`
        if (process.env.LOG_LINKS) console.log(voterLink)
        mailer.sendVoteRequest(voterEmail, electionId, election.name, voter.name, voterLink)
    }
    res.status(200).json({ status: 'NOK' });
}

export default apiHandler({
    'POST': handler
});