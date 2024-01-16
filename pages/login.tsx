import axios from 'axios';
import React, { FormEvent, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

function Login(props){
    const [senha, setSenha] = useState("");
    const [matricula, setMatricula] = useState("");
    
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
            alert(err);
        }
    }

    return (
        <div className="container content">
          <div className="px-4 py-5 my-5 text-center">
            <div className="col-lg-6 mx-auto">
                <img className='w-100' src="/saia.png" />

                <form onSubmit={(event) => logar(event)}>
                    <Form.Control placeholder='Matricula SIGA' className='mt-5 w-100 text-center' type='input' value={matricula} onChange={e => setMatricula(e.target.value)}></Form.Control>
                    <Form.Control placeholder='Senha SIGA' className='mt-1 w-100 text-center' type='password' value={senha} onChange={e => setSenha(e.target.value)}></Form.Control>
                    <Button type='submit' className="mt-2 w-100">Entrar</Button>
                </form>
                </div>
            </div>
        </div>
    )
}

export default Login;