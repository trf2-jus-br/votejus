import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import Cedula from './cedula';
import { Modal } from 'react-bootstrap';
import { DICIONARIO_PLURAL } from '../../utils/dicionario';

interface Props {
    candidatos: any[],
    eleitores: any[],
    votos: string[],
}

function ModalCedulas(props : Props, ref){
    const [visivel, setVisivel] = useState(false);
    const [votos_considerados, setVotosConsiderados] = useState(0);

    const [candidatos, setCandidatos] = useState(null);
    const [votos, setVotos] = useState(null);

    const intervalRef = useRef(null);

    useEffect(()=>{
        return ()=> clearInterval(intervalRef.current);
    }, []);

    useImperativeHandle(ref, ()=>({
        exibir: (candidatos, votos)=> {
            setCandidatos(candidatos);
            setVotos(votos);

            intervalRef.current = setInterval(()=>{
                setVotosConsiderados(v => v + 1);
            }, 250)

            setVisivel(true)
        } 
    }), [votos_considerados])

    function contar(candidato){
        // considera algumas cédulas, devido a animação.
        return votos.slice(0, votos_considerados).filter( v => {
            // converte a cédula para uma lista
            const ids = v.split(',').map(s => parseInt(s));
            
            // verifica se o dado usuário está nesta listagem
            return ids.indexOf(candidato.id) !== -1;
        }).length;
    }

    if(!candidatos || !votos)
        return <></>;

    const candidatosValidos =  candidatos.filter(c => DICIONARIO_PLURAL[c.name.toLowerCase()] == null);
    const candidateRows = candidatosValidos.map((c, idx) => {
        return (
        <tr key={c.id} style={idx === candidatosValidos.length - 1 ? {borderBottom: 'solid 1px #333'} : {}}>
            <th scope="row">{idx + 1}</th>
            <td>{c.name}</td>
            <td style={{ textAlign: "right" }}>{contar(c)}</td>
        </tr>
        );
    });

  const BrancoeNulos = candidatos.filter(c => DICIONARIO_PLURAL[c.name.toLowerCase()] != null).map((c, idx) => {
    return (
      <tr key={c.id}>
        <th scope="row"></th>
        <td style={{fontWeight: "bold" }}>{DICIONARIO_PLURAL[c.name.toLowerCase()]}</td>
        <td style={{ textAlign: "right" }}>{contar(c)}</td>
      </tr>
    );
  });

    return (
        <Modal dialogClassName='modalCedulasModal' show={visivel} scrollable onHide={() => setVisivel(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Resultado *</Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <div className='modalCedulasContainer' style={e.container}>
                    {votos.map((v, i) => <Cedula key={i} voto={v} votos_considerados={votos_considerados} candidatos={candidatos} indice={i + 1} />)} 
                </div> 
            </Modal.Body>
            <Modal.Footer>
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
                * as c&eacute;dulas s&atilde;o embaralhadas a cada exibi&ccedil;&atilde;o.
            </Modal.Footer>
        </Modal>
    );
}

const e : {[key: string]: React.CSSProperties} = {
    container: {
        scrollBehavior: 'smooth',
        display: "flex",
        flexWrap: "wrap",
        margin: "20px 0px",
    }
}

export default React.forwardRef(ModalCedulas);