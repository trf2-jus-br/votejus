import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function ModalResend(props) {
  return (
    <>
      <Modal show={props.show} onHide={props.onCancel}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.text}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={props.onOk}>OK</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}