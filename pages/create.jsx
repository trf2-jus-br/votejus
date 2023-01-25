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

  const exampleElectionName = 'Eleição de Teste'
  const exampleAdministratorEmail = 'administrador@trf2.jus.br'
  const exampleVoters = `Fulano: fulano@trf2.jus.br\nBeltrano: beltrano@trf2.jus.br`
  const exampleCandidates = `Sicrano\nBeltrano\n[Branco]\n[Nulo]`

  const [electionName, setElectionName] = useState(undefined)
  const [administratorEmail, setAdministratorEmail] = useState(undefined)
  const [voters, setVoters] = useState(undefined)
  const [candidates, setCandidates] = useState(undefined)
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)

  // Load fields from localStorage
  React.useEffect(() => {
    let defaultElectionName = localStorage.getItem('electionName')
    if (defaultElectionName && !electionName) {
      // Acrescenta um sufixo ' #2' para diferenciar
      const regex = / #([0-9])+$/
      if (regex.test(defaultElectionName))
        defaultElectionName = defaultElectionName.replace(regex, (match, num) => ` #${parseInt(num) + 1}`)
      else
        defaultElectionName += ' #2'
      setElectionName(defaultElectionName)
    }
    const defaultAdministratorEmail = localStorage.getItem('administratorEmail')
    if (defaultAdministratorEmail && !administratorEmail) setAdministratorEmail(defaultAdministratorEmail)
    const defaultVoters = localStorage.getItem('voters')
    if (defaultVoters && !voters) setVoters(defaultVoters)
    const defaultCandidates = localStorage.getItem('candidates')
    if (defaultCandidates && !candidates) setCandidates(defaultCandidates)
  }, [])

  const handleChangeElectionName = (evt) => { setElectionName(evt.target.value) };
  const handleChangeAdministratorEmail = (evt) => { setAdministratorEmail(evt.target.value) };
  const handleChangeVoters = (evt) => { setVoters(evt.target.value) };
  const handleChangeCandidates = (evt) => { setCandidates(evt.target.value) };

  const handleClickCreate = async () => {
    setCreating(true)
    try {
      await Fetcher.post(`${props.API_URL_BROWSER}api/create`, { electionName, administratorEmail, voters, candidates }, { setErrorMessage })
      localStorage.setItem('electionName', electionName)
      localStorage.setItem('administratorEmail', administratorEmail)
      localStorage.setItem('voters', voters)
      localStorage.setItem('candidates', candidates)
      setCreated(true)
    } catch (e) { }
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
            Para criar uma nova votação, informe o nome da votação, o email do administrador, os nomes e e-mails dos eleitores e a lista de candidatos.
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
                  <Form.Label>Nome e E-mail dos Eleitores</Form.Label>
                  <Form.Control as="textarea" rows="10" value={voters} onChange={handleChangeVoters} placeholder={exampleVoters} />
                  <Form.Text className="text-muted">
                    Em cada linha informe o nome do eleitor e seus e-mails. Separe os campos com dois pontos, vírgula ou tab. É possível colar neste campo uma tabela copiada do Excel.
                  </Form.Text>
                </Form.Group>
              </div>
              <div className="col col-12 col-lg-6">
                <Form.Group className="mb-3" controlId="voters">
                  <Form.Label>Candidatos</Form.Label>
                  <Form.Control as="textarea" rows="10" value={candidates} onChange={handleChangeCandidates} placeholder={exampleCandidates} />
                  <Form.Text className="text-muted">
                    Em cada linha informe o nome de um candidato. Inclua candidados com os nomes [Branco] e [Nulo], se for o caso.
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