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
  const form = React.createRef()
  const [validated, setValidated] = useState(false)
  const [errorMessage, setErrorMessage] = useState(undefined)

  const exampleElectionName = 'Eleição de Teste'
  const exampleAdministratorEmail = 'administrador@empresa.com.br'
  const exampleVoters = `Fulano: T20000\nBeltrano: beltrano@empresa.com.br`
  const exampleCandidates = `Sicrano\nBeltrano\n[Branco]\n[Nulo]`

  const [electionName, setElectionName] = useState(undefined)
  const [administratorEmail, setAdministratorEmail] = useState(undefined)
  const [administratorEmailCreated, setAdministratorEmailCreated] = useState(undefined)
  const [voters, setVoters] = useState(undefined)
  const [candidates, setCandidates] = useState(undefined)
  const [created, setCreated] = useState(false)
  const [embaralharCandidatos, setEmbaralharCandidatos] = useState(false);
  const [ocultarEleitores, setOcultarEleitores] = useState(false);
  const [numeroSelecoesPermitidas, setNumeroSelecoesPermitidas] = useState(1);

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

    setEmbaralharCandidatos(localStorage.getItem('embaralharCandidatos') === 'true');
    setOcultarEleitores(localStorage.getItem('ocultarEleitores') === 'true');
    setNumeroSelecoesPermitidas(parseInt(localStorage.getItem('numeroSelecoesPermitidas')) || 1);
  }, [])

  const handleChangeElectionName = (evt) => { setElectionName(evt.target.value) };
  const handleChangeAdministratorEmail = (evt) => { setAdministratorEmail(evt.target.value) };
  const handleChangeVoters = (evt) => { setVoters(evt.target.value) };
  const handleChangeCandidates = (evt) => { setCandidates(evt.target.value) };

  const handleClickCreate = async () => {
    setValidated(true)
    if (form.current.checkValidity()) {
      try {
        const votacao = await Fetcher.post(`${props.API_URL_BROWSER}api/create`, { electionName, administratorEmail, voters, candidates, numeroSelecoesPermitidas, embaralharCandidatos, ocultarEleitores }, { setErrorMessage })
        localStorage.setItem('electionName', electionName)
        localStorage.setItem('administratorEmail', administratorEmail)
        localStorage.setItem('voters', voters)
        localStorage.setItem('candidates', candidates)
        localStorage.setItem('embaralharCandidatos', embaralharCandidatos)
        localStorage.setItem('numeroSelecoesPermitidas', numeroSelecoesPermitidas)
        localStorage.setItem('ocultarEleitores', ocultarEleitores)

        setCreated(true)
        setAdministratorEmailCreated(administratorEmail)
        setElectionName(undefined)
        setAdministratorEmail(undefined)
        setVoters(undefined)
        setCandidates(undefined)
        setValidated(false)

        if( confirm("Deseja visualizar a votação criada") )
          window.location.href = votacao.url;
      } catch (e) { }
    }
  }

  return (
    <Layout errorMessage={errorMessage} setErrorMessage={setErrorMessage}>
      <h1 className='mb-4'>Criação de Votação</h1>

      {created
        ? <>
          <p className='alert alert-success'>Eleição criada com sucesso. Consulte o email "{administratorEmailCreated}" para obter o link para o painel e iniciar a votação.</p>
        </>
        : <>
          <p>
            Para criar uma nova votação, informe o nome da votação, o email do administrador, os nomes e e-mails dos eleitores e a lista de candidatos.
          </p>

          <Form validated={validated} ref={form}>

            <div className="row">
              <div className="col col-12 col-lg-6">
                <Form.Group className="mb-3" controlId="electionName">
                  <Form.Label>Nome da Eleição</Form.Label>
                  <Form.Control type="text" value={electionName} onChange={handleChangeElectionName} placeholder={exampleElectionName} required />
                  <Form.Control.Feedback type="invalid">Informe um nome válido.</Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col col-12 col-lg-6">
                <Form.Group className="mb-3" controlId="administratorEmail">
                  <Form.Label>E-mail do Administrador</Form.Label>
                  <Form.Control type="email" value={administratorEmail} onChange={handleChangeAdministratorEmail} placeholder={exampleAdministratorEmail} required />
                  <Form.Control.Feedback type="invalid">Informe um email válido.</Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col col-12 col-lg-6">
                <Form.Group className="mb-3" controlId="voters">
                  <Form.Label>Nome e Identificador (matrícula ou e-mail) dos Eleitores</Form.Label>
                  <Form.Control as="textarea" rows="10" value={voters} onChange={handleChangeVoters} placeholder={exampleVoters} required />
                  <Form.Text className="text-muted">
                    Em cada linha informe o nome do eleitor e seus identificadores. Separe os campos com dois pontos, vírgula ou tab. É possível colar neste campo uma tabela copiada do Excel.
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">Lista de eleitores deve ser preenchida.</Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col col-12 col-lg-6">
                <Form.Group className="mb-3" controlId="voters">
                  <Form.Label>Candidatos</Form.Label>
                  <Form.Control as="textarea" rows="10" value={candidates} onChange={handleChangeCandidates} placeholder={exampleCandidates} required />
                  <Form.Text className="text-muted">
                    Em cada linha informe o nome de um candidato. Inclua candidados com os nomes [Branco] e [Nulo], se for o caso.
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">Lista de candidatos deve ser preenchida.</Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="mb-3 col col-12 col-lg-6 d-flex flex-column" >
                <label onClick={() => setEmbaralharCandidatos(s => !s)}>
                  <Form.Check type="radio" label="Embaralhar Candidatos" checked={embaralharCandidatos} />
                </label>
                <label onClick={() => setOcultarEleitores(s => !s)}>
                  <Form.Check type="radio" label="Ocultar eleitores" checked={ocultarEleitores} />
                </label>
              </div>
              <Form.Group className="mb-3 col col-12 col-lg-6" controlId="voters">
                  <Form.Label>Número de seleções permitidas</Form.Label>
                  <Form.Control type="number" min={1} value={numeroSelecoesPermitidas} onChange={({target}) => setNumeroSelecoesPermitidas(parseInt(target.value))} required />
              </Form.Group>
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