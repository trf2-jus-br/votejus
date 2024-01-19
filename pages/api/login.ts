import { apiHandler } from "../../utils/apis";
import jwt from "../../utils/jwt";
import axios from "axios";
import { redirect } from "next/navigation";
import mysql from "../../utils/mysql"
import createHttpError from "http-errors";
import { NextApiRequest, NextApiResponse } from "next";

// Verifica as credenciais, obtém os dados do usuário através do SIGA.
async function logar(req: NextApiRequest, res : NextApiResponse){
    try{
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
                voter_email: data.usuario.titularSigla
            })
            
            // Define a url que o cliente deve acessar.
            const url = `${process.env.API_URL_BROWSER}vote/${voterJwt}`
            return res.send(url);
        }
        
        // Notifica o erro, caso o usuário não pertença a nenhuma votação.
        throw createHttpError(403);
    }catch(err){
        let msg = err?.response?.data?.errormsg;
        
        if(!msg)
            throw err;

        if(msg?.indexOf("Usuário ou senha incorretos") !== -1)
            msg = "Usuário ou senha incorretos";

        throw createHttpError(403, msg);
    }
}

async function atualizarLogin(req: NextApiRequest, res: NextApiResponse){
    // Pega o jwt do usuário que está logado.
    const payload = await jwt.parseJwt(req.query.voterJwt)

    // Busca a última votação que o usuário foi cadastrado.
    const eleitor = await mysql.loginEleitor(payload.voter_email);

    if(eleitor && eleitor.election_id > payload.electionId){
        // Cria uma JWT compatível com a JWT que seria enviada por e-mail.
        const voterJwt = await jwt.buildJwt({ 
            kind: "voter", 
            electionId: eleitor.election_id, 
            voterId: eleitor.voter_id,
            voter_email: eleitor.voter_email
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