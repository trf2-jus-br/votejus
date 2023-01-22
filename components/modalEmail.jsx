import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

export default function ModalResend(props) {
  const form = React.createRef()
  const [email, setEmail] = useState(undefined)
  const [validated, setValidated] = useState(false)

  const handleOk = () => {
    setValidated(true)
    if (form.current.checkValidity()) {
      props.onOk(email)
      setEmail(undefined)
      setValidated(false)
    }
  }

  return (
    <>
      <Modal show={props.show} onHide={props.onCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{props.text}</p>
          <Form validated={validated} ref={form}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>E-mail</Form.Label>
              <Form.Control type="email" value={email} onChange={(evt) => { setEmail(evt.target.value) }} placeholder="name@empresa.com.br" autoFocus required />
              <Form.Control.Feedback type="invalid">Informe um email válido.</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onCancel}>Cancelar</Button>
          <Button variant="primary" onClick={handleOk}>OK</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}