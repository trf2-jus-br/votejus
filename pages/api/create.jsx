import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"
import { apiHandler } from "../../utils/apis"
import validate from '../../utils/validate'

const handler = async function (req, res) {
    const administratorEmail = validate.administratorEmail(req.body.administratorEmail);
    const embaralharCandidatos = req.body.embaralharCandidatos === true;
    const ocultarEleitores = req.body.ocultarEleitores === true;
    const numero_selecoes_permitidas = req.body.numeroSelecoesPermitidas;
    const electionName = validate.electionName(req.body.electionName)
    const voters = req.body.voters
    const candidates = req.body.candidates

    const votersArray = []
    voters.trim().split('\n').forEach((l, idx) => {
        const context = `na linha ${idx + 1}: "${l}"`
        const split = l.split(/[:\t,]/)
        const name = validate.voterName(split[0], context)
        split.shift()
        const emails = split.filter(s => !!s.trim())
        if (emails.length === 0) throw 'Nome e e-mail devem ser informados com separação de dois pontos, virgula ou tab ' + context
        const email = emails.map(i => validate.ehMatriculaSIGA(i) ? i : validate.voterEmail(i, context)).join(', ')
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

    const electionId = await mysql.createElection(electionName, administratorEmail, votersArray, candidatesArray, numero_selecoes_permitidas, embaralharCandidatos, ocultarEleitores)
    const administratorJwt = await jwt.buildJwt({ 
        kind: "administrator", 
        electionId, 
        electionName, 
        electionId,
        administratorEmail 
    })
    
    const administratorLink = `${process.env.API_URL_BROWSER}dashboard/${administratorJwt}`

    if (process.env.LOG_LINKS) console.log(administratorLink)

    mailer.sendCreated(administratorEmail, electionId, electionName, administratorLink)

    res.status(200).json({ status: 'OK', url: administratorLink });
}

export default apiHandler({
    'POST': handler
});