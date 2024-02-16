import React, { CSSProperties } from "react";
import { Form } from "react-bootstrap";
import {DICIONARIO_SINGULAR, DICIONARIO_PLURAL} from '../../utils/dicionario';

interface Props {
    voto: any,
    candidatos: any[];
    indice: number;
    votos_considerados: number;
}

function Cedula({voto, indice, candidatos, votos_considerados} : Props){
    const candidatos_reais = candidatos?.filter(c => DICIONARIO_SINGULAR[c.name] == undefined);
    const candidatos_nulos = candidatos?.filter(c => DICIONARIO_SINGULAR[c.name] != undefined);

    return <div className="col-12 col-lg-6 col-xl-4 col-xxl-3 p-3">
        <div className={votos_considerados >= indice ? "opacity-100" : ''} style={e.container}>
            <h5 className="text-center">Voto {indice}</h5> 
            <hr className="w-100 mt-0"/>
            <div style={e.candidatos}>
                {candidatos_reais?.map((c, idx) => {
                    const ids = voto.split(',').map(s => parseInt(s));
                    const ativo = ids.indexOf(c.id) !== -1;
                      
                    return <Form.Check key={c.id} type="radio" id={c.id} label={c.id +"# " +c.name} onChange={() => null} checked={ativo} disabled={!ativo}/>
                })}
                <hr/>
                {candidatos_nulos?.map((c, idx) => {
                    const ids = voto.split(',').map(s => parseInt(s));
                    const ativo = ids.indexOf(c.id) !== -1;

                    return <Form.Check key={c.id} type="radio" id={c.id} label={DICIONARIO_SINGULAR[c.name]} onChange={() => null} checked={ativo} disabled={!ativo}/>
                })}        
            </div>
        </div>
    </div>
}


const e : {[key: string] : React.CSSProperties} ={
    container: {
        opacity: 0,
        transition: 'all 0.5s',
        alignItems: 'center',
        borderRadius: '18px',
        boxShadow: '0px 0px 10px #999',
        padding: '10px 0px'
    },
    candidatos: {
        padding: "0px 30px"
    }
};

export default Cedula;