import { apiHandler } from "../../utils/apis";
import jwt from "../../utils/jwt";
import axios from "axios";
import { redirect } from "next/navigation";
import mysql from "../../utils/mysql"
import createHttpError from "http-errors";
import { NextApiRequest, NextApiResponse } from "next";

// Verifica as credenciais, obtém os dados do usuário através do SIGA.
async function logar(req: NextApiRequest, res : NextApiResponse){
    // obtém o login e senha
    const auth = req.headers.authorization;

    // envia as credenciais pro servidor do siga
    const {data: resposta_login} = await axios.post<SIGA_API_V1_LOGIN>('https://siga.jfrj.jus.br/siga/api/v1/autenticar', null, {
        headers: {
            Authorization: auth
        }
    });

    // busca os dados do usuário ( identificado pelo jwt)
    const { data } = await axios.get<SIGA_API_V1_USUARIO>('https://siga.jfrj.jus.br/siga/api/v1/usuario', {
        headers: {
            Authorization: resposta_login.token
        }
    })

    // Busca a última eleição que o usuário está administrando.
    const votacao = await mysql.loginAdmin(data.usuario.titularSigla);

    if(votacao){
        // Cria uma JWT compatível com a JWT que seria enviada por e-mail.
        const administratorJwt = await jwt.buildJwt({ 
            kind: "administrator", 
            electionName: votacao.election_name, 
            electionId: votacao.election_id,
            administratorEmail : votacao.election_administrator_email
        })

        // Define a url que o cliente deve acessar.
        const url = `${process.env.API_URL_BROWSER}dashboard/${administratorJwt}`;
        return res.send(url);
    }

    // Busca a última votação que o usuário foi cadastrado.
    const eleitor = await mysql.loginEleitor(data.usuario.titularSigla);

    if(eleitor){
        // Cria uma JWT compatível com a JWT que seria enviada por e-mail.
        const voterJwt = await jwt.buildJwt({ 
            kind: "voter", 
            electionId: eleitor.election_id, 
            voterId: eleitor.voter_id,
            sigla: data.usuario.titularSigla
        })
        
        // Define a url que o cliente deve acessar.
        const url = `${process.env.API_URL_BROWSER}vote/${voterJwt}`
        res.setHeader('Set-Cookie', `jwt=${voterJwt}; Secure; HttpOnly; Path=/`)
        return res.send(url);
    }
    
    // Notifica o erro, caso o usuário não pertença a nenhuma votação.
    throw createHttpError(403);
}

async function atualizarLogin(req: NextApiRequest, res: NextApiResponse){
    // Pega do cookie o usuário que está logado.
    const payload = await jwt.parseJwt(req.cookies['jwt'])

    // Busca a última votação que o usuário foi cadastrado.
    const eleitor = await mysql.loginEleitor(payload.sigla);

    if(eleitor && eleitor.election_id > payload.electionId){
        // Cria uma JWT compatível com a JWT que seria enviada por e-mail.
        const voterJwt = await jwt.buildJwt({ 
            kind: "voter", 
            electionId: eleitor.election_id, 
            voterId: eleitor.voter_id,
        })

        // Define a url que o cliente deve acessar.
        const url = `${process.env.API_URL_BROWSER}vote/${voterJwt}`
        return res.send(url);
    }

    return res.send(null);
}


export default apiHandler({
    "POST": logar,
    "GET" : atualizarLogin
})