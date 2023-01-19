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
  const router = useRouter()

  const handleClickStart = async () => {
    await Fetcher.post(`${props.API_URL_BROWSER}api/start`, { administratorJwt: props.jwt }, { refresh: true })
    router.refresh()
  };

  const handleClickEnd = async () => {
    await Fetcher.post(`${props.API_URL_BROWSER}api/end`, { administratorJwt: props.jwt })
    router.refresh()
  };

  const handleResendEmail = async (voterId) => {
    await Fetcher.post(`${props.API_URL_BROWSER}api/resend`, { administratorJwt: props.jwt, voterId })
  };

  const handleAddEmail = async (voterId, email) => {
    await Fetcher.post(`${props.API_URL_BROWSER}api/addEmail`, { administratorJwt: props.jwt, voterId, email })
    router.refresh()
  };

  const handleAddVoter = async (name, email) => {
    await Fetcher.post(`${props.API_URL_BROWSER}api/addVoter`, { administratorJwt: props.jwt, name, email })
    router.refresh()
  };

  const { data, error, isLoading } = useSWR(`/api/dashboard?administratorJwt=${props.jwt}`, Fetcher.fetcher);

  if (error) return <div>falhou em carregar</div>
  if (isLoading) return <div>carregando...</div>

  let voteCount = 0
  let voterCount = data.voters.length
  data.voters.map(v => { if (v.voteDatetime) voteCount++ })
  const voterPerc = Math.ceil((voteCount / voterCount) * 100)

  const voterRows = data.voters.map((v, idx) => {
    return (
      <tr key={v.id}>
        <th scope="row">{idx + 1}</th>
        <td>{v.name}</td>
        <td>{v.email}</td>
        <td style={{ textAlign: "right" }}>
          {v.voteDatetime
            ? <span className="text-success font-weight-bold"><FontAwesomeIcon icon={faCircleCheck} /></span>
            : data.end
              ? <span className="text-danger font-weight-bold"><FontAwesomeIcon icon={faCircleXmark} /></span>
              : <Dropdown align="end">
                <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                  <FontAwesomeIcon icon={faEllipsis} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Reenviar o E-mail</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Substituir o E-mail</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
          }
        </td>
      </tr>
    );
  });

  const voterCardsDel = data.voters.map((v, idx) => {
    return (
      <div key={v.id} className="col">
        <div className="card">
          <div className="card-header p-2">
            <div className="row"><div className="col">{v.name}</div>
              <div className="col-auto">
                {v.voteDatetime
                  ? <span className="text-success font-weight-bold"><FontAwesomeIcon icon={faCircleCheck} /></span>
                  : data.end
                    ? <span className="text-danger font-weight-bold"><FontAwesomeIcon icon={faCircleXmark} /></span>
                    : <Dropdown align="end">
                      <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                        <FontAwesomeIcon icon={faEllipsis} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Reenviar o E-mail</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Substituir o E-mail</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                }
              </div>
            </div>
          </div>
          <div className="card-body p-2">
            <small className="text-muted">{v.email}</small>
          </div>
        </div>
      </div>
    );
  });


  const voterCards = data.voters.map((v, idx) => {
    return (
      <div key={v.id} className="col">
        <div className="card">

          {v.voteDatetime
            ? <div className="card-header p-2 m-0 alert alert-success">{v.name}</div>
            : data.end
              ? <div className="card-header p-2 m-0 alert alert-danger">{v.name}</div>
              : <div className="card-header p-2">{v.name}</div>
          }
        </div>
      </div>
    );
  });


  const candidateRows = data.candidates.map((c, idx) => {
    return (
      <tr key={c.id}>
        <th scope="row">{idx + 1}</th>
        <td>{c.name}</td>
        <td style={{ textAlign: "right" }}>{c.votes}</td>
      </tr>
    );
  });

  return (
    <SWRConfig value={{ refreshInterval: 100 }}>
      <Layout>
        <h1 className='mb-4'>{data.name}</h1>

        <div>
          <p className="mb-1">
            Votos recebidos até o momento: {voteCount}/{voterCount}
          </p>

          <div className="progress" role="progressbar" aria-label="Votos recebidos" aria-valuenow={voterPerc} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-bar bg-info" style={{ width: voterPerc + "%" }}></div>
          </div>
        </div>

        {
          !data.start &&
          <div className="mt-4">
            <Button as="a" variant="primary" onClick={handleClickStart}> Iniciar a Votação </Button>
          </div>
        }

        {data.start && !data.end &&
          <>
            <h3 className="mb-1 mt-4">Painel de Acompanhamento</h3>
            <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 row-cols-xl-8 row-cols-xxl-10 g-2 mt-4">
              {voterCards}
            </div>
          </>
        }

        <div className="mt-4">
          <h3 className="mb-1">Votantes</h3>
          <table className="table table-sm table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nome</th>
                <th scope="col">E-mail</th>
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
          <div className="mt-4">
            <Button as="a" variant="warning" onClick={handleClickEnd}> Finalizar a Votação </Button>
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
            </tbody>
          </table>
        </div>
      </Layout>
    </SWRConfig>
  )
}
