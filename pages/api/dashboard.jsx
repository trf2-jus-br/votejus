import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"
import { apiHandler } from "../../utils/apis";

const handler = async function (req, res) {
    const administratorJwt = req.query.administratorJwt
    const payload = await jwt.parseJwt(administratorJwt)

    const election = await mysql.loadElection(payload.electionId)

    if (!election.end) election.candidates.forEach(c => c.votes = null)

    const administratorLink = `${process.env.API_URL_BROWSER}dashboard/${administratorJwt}`

    res.status(200).json(election);
}

export default apiHandler({
    'GET': handler
});