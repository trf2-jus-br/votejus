import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"
import { apiHandler } from "../../utils/apis"
import { validateElectionName, validateAdministratorEmail, validateVoterName, validateVoterEmail, validateCandidateName } from '../../utils/validate'
import validate from '../../utils/validate'

const handler = async function (req, res) {
    const administratorEmail = validate.administratorEmail(req.body.administratorEmail)
    const electionName = validate.electionName(req.body.electionName)
    const voters = req.body.voters
    const candidates = req.body.candidates

    const votersArray = []
    voters.trim().split('\n').forEach((l, idx) => {
        const context = `na linha ${idx + 1}: "${l}"`
        const split = l.split(/[:\t,]/)
        const name = validate.voterName(split[0], context)
        split.shift()
        const email = split.map(i => validate.voterEmail(i, context)).join(', ')
        votersArray.push({ name, email })
    })

    if (votersArray.length === 0) throw 'Nenhum eleitor informado'

    const candidatesArray = []
    candidates.trim().split('\n').forEach((l, idx) => {
        const context = `na linha ${idx + 1}: "${l}"`
        const name = validate.candidateName(l, context)
        candidatesArray.push({ name })
    })

    if (candidatesArray.length === 0) throw 'Nenhum candidato informado'

    const electionId = await mysql.createElection(electionName, administratorEmail, votersArray, candidatesArray)
    const administratorJwt = await jwt.buildJwt({ kind: "administrator", electionId, electionName, electionId, administratorEmail })
    const administratorLink = `${process.env.API_URL_BROWSER}dashboard/${administratorJwt}`

    if (process.env.LOG_LINKS) console.log(administratorLink)

    mailer.sendCreated(administratorEmail, electionId, electionName, administratorLink)

    res.status(200).json({ status: 'OK' });
}

export default apiHandler({
    'POST': handler
});