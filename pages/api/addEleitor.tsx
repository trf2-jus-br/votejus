import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"
import { apiHandler } from "../../utils/apis"

const handler = async function (req, res) {
    const { administratorJwt, nome, email } = req.body;
    const { electionId } = await jwt.parseJwt(administratorJwt) as any;

    const {eleicao, idEleitor} = await mysql.addEleitor(electionId, nome, email)

    if (eleicao.election_start && !eleicao.election_end) {
        const voterJwt = await jwt.buildJwt({ kind: "voter", electionId, idEleitor })
        const voterLink = `${process.env.API_URL_BROWSER}vote/${voterJwt}`
        if (process.env.LOG_LINKS) 
            console.log(voterLink)

        mailer.sendVoteRequest(email, electionId, eleicao.election_name, nome, voterLink)
    }

    res.status(200).json({ status: 'NOK' });
}

export default apiHandler({
    'POST': handler
});