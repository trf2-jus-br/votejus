import Head from 'next/head'
import styles from '../styles/Home.module.css';
import Button from 'react-bootstrap/Button';
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
    await Fetcher.post(`${props.API_URL_BROWSER}api/create`, { electionName, administratorEmail, voters, candidates })
    setCreated(true)
    setCreating(false)
  };

  return (
    <Layout>
      <h1 className='mb-4'>Criação de Votação</h1>

      {created
        ? <>
          <p className='alert alert-success'>Eleição criada com sucesso. Consulte o email "{administratorEmail}" para obter o link para o painel e iniciar a votação.</p>
        </>
        : <>
          <p>
            Para criar uma nova votação, informe o nome da votação, o email do administrador, os nomes e e-mails dos votantes e a lista de candidatos.
          </p>

          <div className="row">
            <div className="col col-12 col-lg-6">
              <div className="mb-3">
                <label for="electionName" className="form-label">Nome da Eleição</label>
                <input type="text" value={electionName} onChange={handleChangeElectionName} className="form-control" id="electionName" placeholder="Eleição para Presidente" />
              </div>
            </div>
            <div className="col col-12 col-lg-6">
              <div className="mb-3">
                <label for="administratorEmail" className="form-label">E-mail do Administrador</label>
                <input type="email" value={administratorEmail} onChange={handleChangeAdministratorEmail} className="form-control" id="administratorEmail" placeholder="nome@exemplo.com.br" />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col col-12 col-lg-6">
              <div className="mb-3">
                <label for="votantesFormControl" className="form-label">Nome e E-mail dos Votantes</label>
                <textarea value={voters} onChange={handleChangeVoters} className="form-control" id="votantesFormControl" rows="10" placeholder={exampleVoters}></textarea>
                <div id="votantesHelp" className="form-text">Em cada linha informe o nome do votante e seu email. Separe o nome do email com dois pontos.</div>
              </div>
            </div>
            <div className="col col-12 col-lg-6">
              <div className="mb-3">
                <label for="opcoesFormControl" className="form-label">Candidatos</label>
                <textarea value={candidates} onChange={handleChangeCandidates} className="form-control" id="opcoesFormControl" rows="10" placeholder={exampleCandidates}></textarea>
                <div id="opcoesHelp" className="form-text">Em cada linha informe o nome de um candidato.</div>
              </div>
            </div>
          </div>

          <Button variant="primary" disabled={!electionName || !administratorEmail || !voters || !candidates} onClick={handleClickCreate}>
            Criar Votação
          </Button>
        </>
      }
    </Layout>
  )
}