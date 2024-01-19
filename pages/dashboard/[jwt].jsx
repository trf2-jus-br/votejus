import Head from 'next/head'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faCircleCheck, faPaperPlane, faPencil, faEllipsis } from '@fortawesome/free-solid-svg-icons'
import Dropdown from 'react-bootstrap/Dropdown'
import React, { useState } from 'react'
import useSWR, { SWRConfig } from 'swr'
import { useRouter } from 'next/navigation'
import Fetcher from '../../utils/fetcher'
import Layout from '../../components/layout'
import ModalOkCancel from '../../components/modalOkCancel'
import ModalEmail from '../../components/modalEmail'
import ModalItens from '../../components/modalItens'

export function getServerSideProps({ params }) {
  return {
    props: {
      jwt: params.jwt,
      API_URL_BROWSER: process.env.API_URL_BROWSER
    },
  };
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </a>
));

export default function Dashboard(props) {
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [showModalResendEmail, setShowModalResendEmail] = useState(false)
  const [showModalElectionEnd, setShowModalElectionEnd] = useState(false)
  const [selectedVoterId, setSelectedVoterId] = useState(undefined)
  const [selectedVoterName, setSelectedVoterName] = useState(undefined)
  const [showModalAddEmail, setShowModalAddEmail] = useState(false)
  const [exibirModalDuplicacao, setExibirModalDuplicacao] = useState(false);

  const router = useRouter()

  const handleClickStart = async () => {
    try {
      await Fetcher.post(`${props.API_URL_BROWSER}api/start`, { administratorJwt: props.jwt }, { setErrorMessage })
      router.refresh()
    } catch (e) { }
  };

  const handleElectionEnd = async () => {
    try {
      await Fetcher.post(`${props.API_URL_BROWSER}api/end`, { administratorJwt: props.jwt }, { setErrorMessage })
      router.refresh()
    } catch (e) { }
  };

  const openModalElectionEnd = () => {
    setShowModalElectionEnd(true)
  }

  const closeModalElectionEnd = () => {
    setShowModalElectionEnd(false)
  }

  const openModalResendEmail = (voterId, voterName) => {
    setSelectedVoterId(voterId)
    setSelectedVoterName(voterName)
    setShowModalResendEmail(true)
  }

  const closeModalResendEmail = () => {
    setShowModalResendEmail(false)
    setSelectedVoterId(undefined)
    setSelectedVoterName(undefined)
  }

  const handleResendEmail = async () => {
    try {
      await Fetcher.post(`${props.API_URL_BROWSER}api/resend`, { administratorJwt: props.jwt, voterId: selectedVoterId }, { setErrorMessage })
    } catch (e) { }
    closeModalResendEmail()
  }

  const openModalAddEmail = (voterId, voterName) => {
    setSelectedVoterId(voterId)
    setSelectedVoterName(voterName)
    setShowModalAddEmail(true)
  }

  const closeModalAddEmail = () => {
    setShowModalAddEmail(false)
    setSelectedVoterId(undefined)
    setSelectedVoterName(undefined)
  }

  function duplicarVotacao(candidatos, numero_selecoes_permitadas){
    localStorage.setItem('electionName', data.name)
    localStorage.setItem('administratorEmail', data.administratorEmail)
    localStorage.setItem('voters', data.voters.map(v => `${v.name}:${v.email}`).join('\n'))
    localStorage.setItem('candidates', candidatos.join('\n'))
    localStorage.setItem('embaralharCandidatos', data.embaralhar_candidatos)
    localStorage.setItem('numeroSelecoesPermitidas', numero_selecoes_permitadas)


    const url = `${props.API_URL_BROWSER}create`
    window.open(url, '_blank').focus();
    setExibirModalDuplicacao(false)
  }

  const handleAddEmail = async (voterEmail) => {
    try {
      await Fetcher.post(`${props.API_URL_BROWSER}api/addEmail`, { administratorJwt: props.jwt, voterId: selectedVoterId, voterEmail }, { setErrorMessage })
      router.refresh()
    } catch (e) { }
    closeModalAddEmail()
  };

  const handleAddVoter = async (voterName, voterEmail) => {
    try {
      await Fetcher.post(`${props.API_URL_BROWSER}api/addVoter`, { administratorJwt: props.jwt, voterName, voterEmail }, { setErrorMessage })
      router.refresh()
    } catch (e) { }
  };

  const { data, error, isLoading } = useSWR(`/api/dashboard?administratorJwt=${props.jwt}`, Fetcher.fetcher, { refreshInterval: 2000 });

  if (error) return <div>falhou em carregar</div>
  if (isLoading) return <div>carregando...</div>

  let voteCount = 0
  let voterCount = data.voters.length
  data.voters.map(v => { if (v.voteDatetime) voteCount++ })
  const voterPerc = Math.ceil((voteCount / voterCount) * 100)

  const voterRows = data.voters.map((v, idx) => {
    const voteDate = new Date(v.voteDatetime).toLocaleDateString('pt-br');
    const voteTime = new Date(v.voteDatetime).toLocaleTimeString('pt-br');
    return (
      <tr key={v.id}>
        <th scope="row">{idx + 1}</th>
        <td>{v.name}</td>
        <td>{v.email}</td>
        <td>{v.voteDatetime && <span>{voteDate} às {voteTime}</span>}</td>
        <td>{v.voteIp}</td>
        <td style={{ textAlign: "right" }}>
          {v.voteDatetime
            ? <span className="text-success font-weight-bold"><FontAwesomeIcon icon={faCircleCheck} /></span>
            : data.end
              ? <span className="text-danger font-weight-bold"><FontAwesomeIcon icon={faCircleXmark} /></span>
              : <Dropdown align="end" className="d-print-none">
                <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                  <FontAwesomeIcon icon={faEllipsis} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {data.start && !data.end && <Dropdown.Item onClick={() => openModalResendEmail(v.id, v.name)}>Reenviar o e-mail</Dropdown.Item>}
                  <Dropdown.Item onClick={() => openModalAddEmail(v.id, v.name)}>Adicionar outro e-mail</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
          }
        </td>
      </tr>
    );
  });

  const voterCards = data.voters.map((v, idx) => {
    return (
      <div key={v.id} className="col">
        {v.voteDatetime
          ? <p className="alert alert-success p-2 m-0 h-100">{v.name}</p>
          : data.end
            ? <p className="alert alert-danger p-2 m-0 h-100">{v.name}</p>
            : <p className="alert alert-secondary p-2 m-0 h-100">{v.name}</p>
        }
      </div>
    );
  });

  function eh_branco_ou_nulo(id){
    const nome = dados.candidates.find(c => c.id == id).name.toLowerCase();
    return nome === "[branco]" || nome === "[nulo]";
  }
  
  const candidatosValidos =  data.candidates.filter(c => c.name.toLowerCase() !== "[branco]" && c.name.toLowerCase() !== "[nulo]");
  const candidateRows = candidatosValidos.map((c, idx) => {
    return (
      <tr key={c.id} style={idx === candidatosValidos.length - 1 ? {borderBottom: 'solid 1px #333'} : {}}>
        <th scope="row">{idx + 1}</th>
        <td>{c.name}</td>
        <td style={{ textAlign: "right" }}>{c.votes}</td>
      </tr>
    );
  });

  const BrancoeNulos = data.candidates.filter(c => c.name.toLowerCase() === "[branco]" || c.name.toLowerCase() === "[nulo]").map((c, idx) => {
    return (
      <tr key={c.id}>
        <th scope="row"></th>
        <td style={{fontWeight: "bold" }}>{c.name.toLowerCase() === "[branco]" ? "Votos Brancos" : "Votos Nulos"}</td>
        <td style={{ textAlign: "right" }}>{c.votes}</td>
      </tr>
    );
  });

  const startDate = new Date(data.start).toLocaleDateString('pt-br');
  const startTime = new Date(data.start).toLocaleTimeString('pt-br');
  const endDate = new Date(data.end).toLocaleDateString('pt-br');
  const endTime = new Date(data.end).toLocaleTimeString('pt-br');

  return (
    <Layout errorMessage={errorMessage} setErrorMessage={setErrorMessage}>
      <h4 className='mb-0 text-end'>VOTEJUS-{data.id}</h4>
      <h1 className='mb-4'>{data.name}</h1>

      <div>
        <div className='d-flex align-items-start justify-content-between'>
          <div>
            {data.start && <p className="mb-1">Início: {startDate} às {startTime}</p>}
            <p className="mb-1">Votos recebidos: {voteCount}/{voterCount}</p>
          </div>
          {data.end && <Button as="a" variant="success" onClick={() => setExibirModalDuplicacao(true)}>Duplicar Votação </Button>}
        </div>
        <div className="progress d-print-none" role="progressbar" aria-label="Votos recebidos" aria-valuenow={voterPerc} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-bar bg-info" style={{ width: voterPerc + "%" }}></div>
        </div>
        {data.end && <p className="mb-1">Término: {endDate} às {endTime}</p>}
      </div>

      {
        !data.start &&
        <div className="mt-4 d-print-none">
          <p className="alert alert-warning">Clique no botão abaixo para iniciar a votação. O sistema enviará emails a todos os eleitores solicitando que registrem seus votos.</p>
          <Button as="a" variant="primary" onClick={handleClickStart}> Iniciar a Votação </Button>
        </div>
      }

      {data.start && !data.end &&
        <div className="d-print-none">
          <h3 className="mb-1 mt-4">Painel de Acompanhamento</h3>
          <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 row-cols-xl-8 row-cols-xxl-10 g-2 mt-0">
            {voterCards}
          </div>
        </div>
      }

      <div className="mt-4">
        <h3 className="mb-1">Eleitores</h3>
        <table className="table table-sm table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nome</th>
              <th scope="col">E-mail</th>
              <th scope="col">Registro</th>
              <th scope="col">IP</th>
              <th scope="col" style={{ textAlign: "right" }}>Status</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {voterRows}
          </tbody>
        </table>
      </div>

      {
        data.start && !data.end &&
        <div className="mt-4 d-print-none">
          <p className="alert alert-warning">Clique no botão abaixo para terminar a votação. O sistema interromperá o recebimento de votos e apresentará o resultado.</p>
          <Button as="a" variant="danger" onClick={openModalElectionEnd}> Finalizar a Votação </Button>
        </div>
      }

<div className="mt-4">
        <h3 className="mb-1">Candidatos</h3>
        <table className="table table-sm table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nome</th>
              <th scope="col" style={{ textAlign: "right" }}>Votos</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {candidateRows}
            {BrancoeNulos}
          </tbody>
        </table>
      </div>

      <ModalOkCancel show={showModalElectionEnd} onOk={handleElectionEnd} onCancel={closeModalElectionEnd} title="Finalizar Votação" text={`Atenção, esta operação não poderá ser revertida. Tem certeza que deseja finalizar a votação?`} />
      <ModalOkCancel show={showModalResendEmail} onOk={handleResendEmail} onCancel={closeModalResendEmail} title="Reenvio de Email" text={`Deseja reenviar o email para ${selectedVoterName}?`} />
      <ModalEmail show={showModalAddEmail} onOk={handleAddEmail} onCancel={closeModalAddEmail} title="Adição de Email" text={`Informe um email adicional para ${selectedVoterName}.`} />
      <ModalItens show={exibirModalDuplicacao} numeroSelecoesPermitidas={data.numero_selecoes_permitidas} itens={data.candidates.map(c => c.name)} onOk={duplicarVotacao} onCancel={()=> setExibirModalDuplicacao(false)} title="Candidatos" />
    </Layout>
  )
}
