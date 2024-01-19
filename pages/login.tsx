import { faCheckToSlot, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { FormEvent, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

function Login(props){
    const [senha, setSenha] = useState("");
    const [matricula, setMatricula] = useState("");
    const [ocultarSenha, setOcultarSenha] = useState(true);
    
    async function logar(event: FormEvent){
        event.preventDefault();

        try{
            const auth = 'Basic ' + btoa(matricula.toUpperCase() + ':' + senha)
            
            const {data} = await axios.post(`/api/login`, null, {
                headers: {
                    Authorization: auth
                }
            })

            window.location.href = data;
        }catch(err) {
            alert(err?.response?.data?.error?.message || "Erro inesperado");
        }
    }

    return (
        <div className="container content">
          <div className="px-4 py-5 my-5 text-center">
            <div className="col-lg-6 mx-auto">
                <h4 className="text-success font-weight-bold" style={{ fontSize: "400%" }}><FontAwesomeIcon icon={faCheckToSlot} /></h4>
                <h4 className="display-5 fw-bold">Votejus</h4>

                <form onSubmit={(event) => logar(event)}>
                    <Form.Control placeholder='Matricula SIGA' className='mt-5 w-100 text-center' type='input' value={matricula} onChange={e => setMatricula(e.target.value)}></Form.Control>

                    <InputGroup className='mt-1'>
                        <Form.Control placeholder='Senha SIGA'  className='text-center' type={ocultarSenha ? 'password' : 'text'} value={senha} onChange={e => setSenha(e.target.value)}></Form.Control>
                        {/*<Button size='sm' style={{opacity: 0.7}} variant="outline-primary" onClick={() => setOcultarSenha(!ocultarSenha)}>
                            <FontAwesomeIcon icon={ocultarSenha ? faEye : faEyeSlash}></FontAwesomeIcon>
                        </Button>*/} 
                    </InputGroup>
                    <Button type='submit' className="mt-2 w-100">Entrar</Button>
                </form>
                </div>
            </div>
        </div>
    )
}

export default Login;