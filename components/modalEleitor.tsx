import React, { useImperativeHandle, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

interface InclusaoEleitor {
    resolve: (value: any) => void;
    reject: (value: any) => void;
}

function ModalEleitor(props, ref){
    const [email, setEmail] = useState<string>('');
    const [nome, setNome] = useState<string>('');
    const [promise, setPromise] = useState<InclusaoEleitor>(null);

    const formRef = useRef(null);

    useImperativeHandle(ref, () => ({
        exibir: () => {
            return new Promise((resolve, reject)=>{
                setPromise({resolve, reject});
            });
        }
    }))

    function limparFormulario(){
        setNome('');
        setEmail('');
        setPromise(null);
    }

    function cancelar(){
        promise.reject("Inclusão cancelada pelo usuário.");
        limparFormulario();
    }

    async function incluirEleitor(event){
        event.preventDefault();

        promise.resolve({nome, email});
        limparFormulario();
    }

    

    return <Modal show={promise !== null}>
        <Modal.Header closeButton onHide={cancelar}>
            <Modal.Title>Incluir Eleitor</Modal.Title> 
        </Modal.Header>
        <Modal.Body>
            <Form ref={formRef} onSubmit={incluirEleitor}>
                <Form.Label>Nome</Form.Label>
                <Form.Control value={nome} onChange={({target}) => setNome(target.value)} autoFocus required />
                <Form.Label>E-mail</Form.Label>
                <Form.Control type="email" value={email} onChange={({target}) => setEmail(target.value)} required />
                <Button type='submit' className='w-100 mt-4'>Incluir</Button>
            </Form>
        </Modal.Body>
    </Modal>    
}


export default React.forwardRef(ModalEleitor);