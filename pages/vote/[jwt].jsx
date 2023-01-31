import Head from 'next/head'
import Button from 'react-bootstrap/Button'
import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import { useRouter } from 'next/navigation'
import Fetcher from '../../utils/fetcher'
import Layout from '../../components/layout'

export async function getServerSideProps({ params }) {
  const res = await fetch(`${process.env.API_URL_BROWSER}/api/ballotbox?voterJwt=${params.jwt}`);
  const data = await res.json();
  return {
    props: {
      jwt: params.jwt,
      API_URL_BROWSER: process.env.API_URL_BROWSER,
      data
    },
  };
}

export default function Vote(props) {
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [candidateId, setCandidateId] = useState(undefined)
  const [voting, setVoting] = useState(false)

  const router = useRouter()

  const handleClickCandidate = (id) => {
    setCandidateId(id)
  };

  const handleClickVote = async () => {
    setVoting(true)
    try {
      await Fetcher.post(`${props.API_URL_BROWSER}api/vote`, { voterJwt: props.jwt, candidateId }, { setErrorMessage })
      setVoting(false)
      router.refresh()
    } catch (e) { }
    setVoting(false)
  };

  const candidateRows = props.data.candidates.map((c, idx) => {
    return (
      <Form.Check key={c.id} type="radio" id={c.id} label={c.name} name="condidateId" value={candidateId === c.id}
        onChange={() => handleClickCandidate(c.id)} />
    );
  });

  const voteDate = new Date(props.data.voteDatetime).toLocaleDateString('pt-br');
  const voteTime = new Date(props.data.voteDatetime).toLocaleTimeString('pt-br');

  return (
    <Layout errorMessage={errorMessage} setErrorMessage={setErrorMessage}>
      <h1 className='mb-4'>{props.data.electionName}</h1>

      {props.data.voteDatetime
        ? <p className='alert alert-success'>Prezado(a) {props.data.voterName}, seu voto sigiloso foi registrado no dia {voteDate} às {voteTime}.</p>
        : !props.data.electionStart
          ? <p className='alert alert-warning'>Prezado(a) {props.data.voterName}, a eleição {props.data.electionName} ainda não foi iniciada.</p>
          : props.data.electionEnd
            ? <p className='alert alert-warning'>Prezado(a) {props.data.voterName}, a eleição {props.data.electionName} já está encerrada.</p>
            : <>
              <p>Prezado(a) {props.data.voterName}, selecione o candidato na lista abaixo e clique em "votar" para registrar seu voto.</p>

              <div className="mt-4 p-5 bg-light rounded">
                <div className="row">
                  <div className="col">
                    <h3 className="mb-1">Candidatos</h3>
                    {candidateRows}
                  </div>
                </div>
                {
                  props.data.electionStart && !props.data.electionEnd &&
                  <div className="mt-4">
                    <Button as="button" variant="warning" onClick={handleClickVote} disabled={voting || !candidateId}> Votar </Button>
                  </div>
                }
              </div>
            </>
      }
    </Layout >
  )
}
