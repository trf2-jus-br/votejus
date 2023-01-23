import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"
import { apiHandler } from "../../utils/apis"

const handler = async function (req, res) {
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

    if (process.env.LOG_LINKS) console.log(administratorLink)

    mailer.sendCreated(administratorEmail, electionId, electionName, administratorLink)

    res.status(200).json({ status: 'OK' });
}

export default apiHandler({
    'POST': handler
});