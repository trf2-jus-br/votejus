import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { CSSProperties, FormEvent, useState } from 'react';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';

function Login(props){
    const [senha, setSenha] = useState("");
    const [matricula, setMatricula] = useState("");
    const [ocultarSenha, setOcultarSenha] = useState(true);
    const [carregando, setCarregando] = useState(false);

    async function logar(event: FormEvent){
        event.preventDefault();
        //@ts-ignore
        const sistema : Sistema = event.nativeEvent?.submitter?.getAttribute("name") || "EPROC";

        try{
            setCarregando(true);
            
            const matriculaFormatada = matricula.trim().toUpperCase();
            const auth = 'Basic ' + btoa(matriculaFormatada + ':' + senha)
            
            const config = {
                headers: {
                    Authorization: auth
                }
            };

            const body = {
                matricula: matriculaFormatada,
                sistema
            }

            const {data} = await axios.post(`/api/login`, body, config);

            window.location.href = data;
        }catch(err) {
            alert(err?.response?.data?.error?.message || "Erro inesperado");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <>
            <div className="container content">
            <div className="px-4 py-5 my-5 text-center">
                <div className="col-lg-6 mx-auto">
                    <h4 className="text-success font-weight-bold" style={{ fontSize: "400%" }}><FontAwesomeIcon icon={faCheckToSlot} /></h4>
                    <h4 className="display-5 fw-bold">Votejus</h4>

                    <form onSubmit={logar}>
                        <Form.Control placeholder='Matricula' required className='mt-5 w-100 text-center' type='input' value={matricula} onChange={e => setMatricula(e.target.value)}></Form.Control>

                        <InputGroup className='mt-1'>
                            <Form.Control placeholder='Senha' required className='text-center' type={ocultarSenha ? 'password' : 'text'} value={senha} onChange={e => setSenha(e.target.value)}></Form.Control>
                            {/*<Button size='sm' style={{opacity: 0.7}} variant="outline-primary" onClick={() => setOcultarSenha(!ocultarSenha)}>
                                <FontAwesomeIcon icon={ocultarSenha ? faEye : faEyeSlash}></FontAwesomeIcon>
                            </Button>*/} 
                        </InputGroup>
                        
                        <div className='d-flex' style={{gap: 10}}>
                            <Button type='submit' name='EPROC' variant='outline-success' className="mt-2 w-100 d-flex justify-content-center align-items-center">
                                <span></span>
                                <span>Entrar com</span>
                                <img style={{width:"30px", margin: "0px 10px"}} src="https://eproc.trf2.jus.br/eproc/css/images/logo_eproc.png?h=19e7233d789662dad12b703d82ac6dc0" alt="" />
                            </Button>
                            {/*<Button type='submit' name='SIGA' className="mt-2 w-100 d-flex justify-content-center align-items-center">
                                <span></span>
                                <span>Entrar com</span>
                                <img style={{width:"40px", margin: "7px 10px 0"}} src="https://siga.jfrj.jus.br/siga/imagens/logo-siga-novo-38px.png" alt="" />
                        </Button>*/}
                        </div>
                    </form>
                    </div>
                </div>
            </div>

            {carregando && <div style={e.telaCarregamento}>
                <div style={e.iconeCarregamento}>
                    <span className='text-success'>Carregando</span> 
                    <Spinner variant='success'></Spinner>
                </div>
            </div>}
        </>
    )
}

const e : {[prop: string]: CSSProperties} = {
    iconeCarregamento: {
        position: 'absolute', 
        right: 30, 
        bottom: 30,
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: 5
    },
    telaCarregamento : {
        position: 'absolute',
        backgroundColor: '#0003',
        height: '100vh',
        width: '100vw',
        top: 0,
        left: 0,
    }
}


export default Login;