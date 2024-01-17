import Button from 'react-bootstrap/Button'
import React, { useEffect, useRef, useState } from 'react'
import Form from 'react-bootstrap/Form'
import { useRouter } from 'next/navigation'
import Fetcher from '../../utils/fetcher'
import Layout from '../../components/layout'
import axios from 'axios'

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
  const [candidateId, setCandidateId] = useState({})
  const [voting, setVoting] = useState(false)
  const [dados, setDados] = useState(props.data);
  const intervalRef = useRef(null);

  const router = useRouter()

  async function buscarVotacaoDuplicada(){
    try{
      const {data} = await axios.get(`/api/login?voterJwt=${props.jwt}`);

      if(data){
        window.location.href = data;
      }
    }catch(err){}
  }

  async function atualizarDados(){
    const {data} = await axios.get(`/api/ballotbox?voterJwt=${props.jwt}`);
    setDados(data);
  }

  useEffect(()=>{
    setDados(props.data);
  }, [props.data]);

  useEffect(() =>{
    intervalRef.current = setInterval(  ()=> {
        if(!dados.electionStart){
          atualizarDados();
        }else if(dados.voteDatetime || dados.electionEnd){
          buscarVotacaoDuplicada();
        }
    }, 1000)

    return ()=> clearInterval(intervalRef.current);
  }, [dados])


  const handleClickCandidate = (id) => {
    const numero_selecoes = Object.keys(candidateId).filter(k => candidateId[k]).length;

    setCandidateId( c => {
      if(!c[id] && numero_selecoes >= dados.numero_selecoes_permitidas){
        alert(`Seleções permitidas: ${dados.numero_selecoes_permitidas}`)
        return c;
      }

      c[id] = !c[id];

      return {...c};
    })
  };

  const handleClickVote = async () => {
    setVoting(true)
    try {
      const selecao = Object.keys(candidateId).filter(k => candidateId[k]).map(n => parseInt(n));
      await Fetcher.post(`${props.API_URL_BROWSER}api/vote`, { voterJwt: props.jwt, candidateId: selecao }, { setErrorMessage })
      setVoting(false)
      window.location.reload();
    } catch (e) { }
    setVoting(false)
  };

  const candidateRows = dados.candidates.map((c, idx) => {
    return (
      <Form.Check key={c.id} type="radio" id={c.id} label={c.name} /*name="condidateId"*/ checked={candidateId[c.id] || false}
        onClick={() => handleClickCandidate(c.id)} />
    );
  });

  const voteDate = new Date(dados.voteDatetime).toLocaleDateString('pt-br');
  const voteTime = new Date(dados.voteDatetime).toLocaleTimeString('pt-br');

  return (
    <Layout errorMessage={errorMessage} setErrorMessage={setErrorMessage}>
      <h1 className='mb-4'>{dados.electionName}</h1>

      {dados.voteDatetime
        ? <p className='alert alert-success'>Prezado(a) {dados.voterName}, seu voto sigiloso foi registrado no dia {voteDate} às {voteTime}.</p>
        : !dados.electionStart
          ? <p className='alert alert-warning'>Prezado(a) {dados.voterName}, a eleição {dados.electionName} ainda não foi iniciada.</p>
          : dados.electionEnd
            ? <p className='alert alert-warning'>Prezado(a) {dados.voterName}, a eleição {dados.electionName} já está encerrada.</p>
            : <>
              <p>Prezado(a) {dados.voterName}, selecione o candidato na lista abaixo e clique em "votar" para registrar seu voto.</p>

              <div className="mt-4 p-5 bg-light rounded">
                <div className="row">
                  <div className="col">
                    <h3 className="mb-1">Candidatos</h3>
                    {candidateRows}
                  </div>
                </div>
                {
                  dados.electionStart && !dados.electionEnd &&
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
