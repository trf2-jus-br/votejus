import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckToSlot } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  return (
    <div className="container content">
      <div className="px-4 py-5 my-5 text-center">
        <h1 className="text-success font-weight-bold" style={{ fontSize: "400%" }}><FontAwesomeIcon icon={faCheckToSlot} /></h1>
        <h1 className="display-5 fw-bold">Votejus</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">Votejus é um sistema desenvolvido para conduzir votações sigilosas no âmbito do Tribunal Regional Federal da 2&ordf; Região.</p>
          <p className="lead mb-4">Não serão armazenados dados que possam correlacionar o eleitor ao candidato. Para cada eleitor é armazenada apenas a data e hora do voto e, para cada candidato, apenas a quantidade total de votos.</p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            {/*<a className="btn btn-success btn-lg px-4" href="create" style={{ "color": "white" }}>Crie uma Votação</a>*/}
            <a className="btn btn-primary btn-lg px-4" href="login">Entrar na votação</a>
          </div>
        </div>
      </div>
    </div>
  )
}