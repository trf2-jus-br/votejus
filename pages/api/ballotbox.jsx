import mailer from "../../utils/mailer"
import jwt from "../../utils/jwt"
import mysql from "../../utils/mysql"

const shuffle = function (array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export default async function handler(req, res) {
    const voterJwt = req.query.voterJwt
    const payload = await jwt.parseJwt(voterJwt)
    const electionId = payload.electionId
    const voterId = payload.voterId

    const election = await mysql.loadElection(electionId)
    const voter = election.voters.find(v => v.id === voterId)

    if (!voter) throw `Votante ${voterId} não encontrado`

    const result = { electionId: election.id, electionName: election.name, electionStart: election.start, electionEnd: election.end, voterId: voter.id, voterName: voter.name, voteDatetime: voter.voteDatetime, voteIp: voter.voteIp, candidates: [] }

    election.candidates.forEach(c => result.candidates.push({ id: c.id, name: c.name }))

    shuffle(result.candidates)

    res.status(200).json(result);
}