import { apiHandler } from "../../utils/apis";
import jwt from "../../utils/jwt";
import axios from "axios";
import mysql from "../../utils/mysql"
import createHttpError from "http-errors";
import { NextApiRequest, NextApiResponse } from "next";

// tenta logar com SIGA, lançará exceção em caso de erros.
async function logar_siga(auth: string){
    // envia as credenciais pro servidor do SIGA
    const {data: resposta_login} = await axios.post<SIGA_API_V1_LOGIN>(`${process.env.API_SIGA}/autenticar`, null, {
        headers: {
            Authorization: auth
        }
    });

    // busca os dados do usuário ( identificado pelo jwt)
    const { data } = await axios.get<SIGA_API_V1_USUARIO>(`${process.env.API_SIGA}/usuario`, {
        headers: {
            Authorization: resposta_login.token
        }
    })

    return data;
}

// tenta logar com EPROC, lançará exceção em caso de erros.
async function logar_eproc(auth: string, matricula: string) {
    const config = {headers:{Authorization: auth}}

    // verifica se o usuário tem cadastra em algum dos servidores do ePROC.
    const servidores = ['SJRJ', 'SJES', 'TRF2'];

    // a URL é criada utilizando a matricula, o servidor e a url base.
    const url = (servidor: string) => `${process.env[`API_EPROC_${servidor}`]}/usuario/${matricula}`

    // envia as credenciais pros servidores do eproc
    try{
        const requisicoes = servidores.map( s => axios.get<EPROC_API_V1_LOGIN>(url(s), config))
        const {data} = await Promise.any(requisicoes);
        return data;
    }catch({errors}){
        const msg = (e,i) => servidores[i].toUpperCase() + ": "+ e?.response?.data?.errormsg
        const respostas = errors?.map(msg).join("\n");

        throw createHttpError(403, respostas) ;
    }
}

// Verifica as credenciais, obtém os dados do usuário através do SIGA.
async function logar(req: NextApiRequest, res : NextApiResponse){
    try{
        const sistema : Sistema = req.body.sistema;
        const matricula : string = req.body.matricula;

        // obtém o login e senha
        const auth = req.headers.authorization;

        // tenta autenticar com o sistema especificado, lançando exceção em caso de erros.
        if(sistema === "EPROC"){
            await logar_eproc(auth, matricula);
        }else {
            await logar_siga(auth);
        }
        
        // Busca a última eleição que o usuário está administrando.
        const votacao = await mysql.loginAdmin(matricula);

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
        const eleitor = await mysql.loginEleitor(matricula);

        if(eleitor){
            // Cria uma JWT compatível com a JWT que seria enviada por e-mail.
            const voterJwt = await jwt.buildJwt({ 
                kind: "voter", 
                electionId: eleitor.election_id, 
                voterId: eleitor.voter_id,
                voter_email: matricula
            })
            
            // Define a url que o cliente deve acessar.
            const url = `${process.env.API_URL_BROWSER}vote/${voterJwt}`
            return res.send(url);
        }
        
        // Notifica o erro, caso o usuário não pertença a nenhuma votação.
        throw createHttpError(403, "Não há votações associadas à sua matricula.");
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