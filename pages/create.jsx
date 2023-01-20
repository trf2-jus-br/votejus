import Head from 'next/head'
import styles from '../styles/Home.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react'
import Fetcher from '../utils/fetcher'
import Layout from '../components/layout'

export async function getServerSideProps({ params }) {
  return {
    props: {
      API_URL_BROWSER: process.env.API_URL_BROWSER
    },
  };
}

export default function Create(props) {
  const [errorMessage, setErrorMessage] = useState(undefined)
  
  const exampleElectionName = 'Eleição para Presidente'
  const exampleAdministratorEmail = 'nome@empresa.com.br'
  const exampleVoters = `Fulano: fulano@exemplo.com.br\nBeltrano: beltrano@exemplo.com`
  const exampleCandidates = `Sicrano\nBeltrano`

  const defaultElectionName = 'Eleição para Presidente'
  const defaultAdministratorEmail = 'crivano@trf2.jus.br'
  const defaultVoters = `Renato Crivano: crivano@trf2.jus.br\nJoão Luís: joao.luis@trf2.jus.br`
  const defaultCandidates = `Fulano\nSicrano\nBeltrano`

  const [electionName, setElectionName] = useState(defaultElectionName)
  const [administratorEmail, setAdministratorEmail] = useState(defaultAdministratorEmail)
  const [voters, setVoters] = useState(defaultVoters)
  const [candidates, setCandidates] = useState(defaultCandidates)
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)

  const handleChangeElectionName = (evt) => { setElectionName(evt.target.value) };
  const handleChangeAdministratorEmail = (evt) => { setAdministratorEmail(evt.target.value) };
  const handleChangeVoters = (evt) => { setVoters(evt.target.value) };
  const handleChangeCandidates = (evt) => { setCandidates(evt.target.value) };

  const handleClickCreate = async () => {
    setCreating(true)
    await Fetcher.post(`${props.API_URL_BROWSER}api/create`, { electionName, administratorEmail, voters, candidates }, { setErrorMessage })
    setCreated(true)
    setCreating(false)
  };

  return (
    <Layout errorMessage={errorMessage} setErrorMessage={setErrorMessage}>
      <h1 className='mb-4'>Criação de Votação</h1>

      {created
        ? <>
          <p className='alert alert-success'>Eleição criada com sucesso. Consulte o email "{administratorEmail}" para obter o link para o painel e iniciar a votação.</p>
        </>
        : <>
          <p>
            Para criar uma nova votação, informe o nome da votação, o email do administrador, os nomes e e-mails dos votantes e a lista de candidatos.
          </p>

          <Form>

            <div className="row">
              <div className="col col-12 col-lg-6">
                <Form.Group className="mb-3" controlId="electionName">
                  <Form.Label>Nome da Eleição</Form.Label>
                  <Form.Control type="text" value={electionName} onChange={handleChangeElectionName} placeholder={exampleElectionName} />
                </Form.Group>
              </div>
              <div className="col col-12 col-lg-6">
                <Form.Group className="mb-3" controlId="administratorEmail">
                  <Form.Label>E-mail do Administrador</Form.Label>
                  <Form.Control type="email" value={administratorEmail} onChange={handleChangeAdministratorEmail} placeholder={exampleAdministratorEmail} />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col col-12 col-lg-6">
                <Form.Group className="mb-3" controlId="voters">
                  <Form.Label>Nome e E-mail dos Votantes</Form.Label>
                  <Form.Control as="textarea" rows="10" value={voters} onChange={handleChangeVoters} placeholder={exampleVoters} />
                  <Form.Text className="text-muted">
                    Em cada linha informe o nome do votante e seu email. Separe o nome do email com dois pontos.
                  </Form.Text>
                </Form.Group>
              </div>
              <div className="col col-12 col-lg-6">
                <Form.Group className="mb-3" controlId="voters">
                  <Form.Label>Candidatos</Form.Label>
                  <Form.Control as="textarea" rows="10" value={candidates} onChange={handleChangeCandidates} placeholder={exampleCandidates} />
                  <Form.Text className="text-muted">
                    Em cada linha informe o nome de um candidato.
                  </Form.Text>
                </Form.Group>
              </div>
            </div>

            <Button variant="primary" disabled={!electionName || !administratorEmail || !voters || !candidates} onClick={handleClickCreate}>
              Criar Votação
            </Button>
          </Form>
        </>
      }
    </Layout>
  )
}