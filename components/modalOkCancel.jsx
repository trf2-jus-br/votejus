import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function ModalResend(props) {
  return (
    <>
      <Modal show={props.show} onHide={props.onCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.text}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onCancel}>Cancelar</Button>
          <Button variant="primary" onClick={props.onOk}>OK</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}