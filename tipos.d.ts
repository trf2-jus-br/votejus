
type AxiosInstance = import('axios').AxiosInstance;
type PoolConnection = import('mysql2/promise').PoolConnection;

interface UsuarioSiga {
    identidadeId: string;
    cadastranteId: string;
    cadastranteSigla: string;
    cadastranteNome: string;
    cadastranteCpf: string;
    lotaCadastranteId: string;
    lotaCadastranteSigla: string;
    lotaCadastranteNome: string;
    titularId: string;
    titularSigla:string;
    titularNome: string;
    titularCpf: string;
    lotaTitularId: string;
    lotaTitularSigla: string;
    lotaTitularNome: string;
    substituicoesPermitidas: [];
}

interface SIGA_API_V1_USUARIO {
    usuario : UsuarioSiga
}

interface SIGA_GI_ACESSO {
    'soap:Envelope' : {
        'soap:Body' : {
            'ns2:acessoResponse' : {
                return: string
            }[]
        }[]
    }
}

interface SIGA_API_V1_LOGIN {
    token : string
}

interface EPROC_API_V1_LOGIN_ERROR {
    errormsg : string;
    errordetails: {
        context: string;
        service: string;
        stacktrace: string;
        presentable: boolean;
        logged: boolean;
        url: string;
    }[]
}

interface EPROC_API_V1_LOGIN {
    nome: string;
    cpf: string;
    codusu: string;
    perfil: "consulta-processo",
    interno: boolean;
}

type Sistema =  "EPROC" | "SIGA";