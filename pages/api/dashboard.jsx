import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"

export default async function handler(req, res) {
    const administratorJwt = req.query.administratorJwt
    const payload = await jwt.parseJwt(administratorJwt)

    const election = await mysql.loadElection(payload.electionId)

    if (!election.end) election.candidates.forEach(c => c.votes = null)

    const administratorLink = `${process.env.API_URL_BROWSER}dashboard/${administratorJwt}`

    res.status(200).json(election);
}