import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

export default function ModalItens(props) {
  const [itens, setItens] = useState([]);
  const [numeroSelecoesPermitidas, setNumeroSelecoesPermitidas] = useState();


  useEffect(()=>{
    setItens([...props.itens]);
    setNumeroSelecoesPermitidas(props.numeroSelecoesPermitidas);
  }, [props.show, props.itens])

  const handleOk = () => {
      props.onOk(itens, numeroSelecoesPermitidas)
  }

  function removerItem(indice){
    setItens(itens => {
      if(itens.length === 1)
        return itens;

      itens.splice(indice, 1);

      return [...itens];
    })
  }

  return (
    <>
      <Modal show={props.show} onHide={props.onCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3 d-flex justify-content-between align-items-center" controlId="voters">
              <Form.Label>Número de seleções permitidas</Form.Label>
              <Form.Control className='w-25 text-center' type="number" min={1} value={numeroSelecoesPermitidas} onChange={({target}) => setNumeroSelecoesPermitidas(parseInt(target.value))} required />
          </Form.Group>
          {itens.map( (item, indice) => <InputGroup key={item} className='mb-3 mt-3'>
              <Form.Control type="text" value={item} onChange={(evt) => { setEmail(evt.target.value) }} required disabled />
              <Button style={{opacity: 0.9}} variant='outline-danger' onClick={() => removerItem(indice)}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </InputGroup>
          )}
            
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onCancel}>Cancelar</Button>
          <Button variant="primary" onClick={handleOk}>OK</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}