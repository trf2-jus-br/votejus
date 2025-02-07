import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';

function CSV(props, ref){
    const promiseRef = useRef({});
    const arquivoRef = useRef(null);

    const [linhas, setLinhas] = useState([]);
    const [titulos, setTitulos] = useState([]);
    const [selecao, setSelecao] = useState({});
    const [campos, setCampos] = useState<string[]>([]);
    const [enconding, setEnconding] = useState<string>("ISO-8859-1"); 
    const [tabulacao, setTabulacao] = useState<string>(";"); 
    const [quebraLinha, setQuebraLinha] = useState<string>("\r\n"); 
    
    const [arquivo, setArquivo] = useState<File>();

    async function lerArquivo() : Promise<string>{
        return new Promise((resolve, reject)=>{
            let fr = new FileReader();
            fr.onload = () => resolve(fr.result as string);
            fr.onerror = () => reject(fr.error);
            fr.readAsText(arquivo, enconding);
        });
        
    }

    function selecionar(event, indice){
        if(!event.target.checked){
            delete selecao[indice];
        }else{
            const camposSelecionados = Object.values(selecao); 

            if(camposSelecionados.length >= campos.length){
                event.preventDefault();
                alert(`Selecione apenas ${campos.length} campos`);
            }else{
                const camposDisponiveis = campos.filter(campo => camposSelecionados.indexOf(campo) == -1);
                selecao[indice] = camposDisponiveis[0];
            }
        }

        setSelecao({...selecao});
    }

    function limparCampos(){
        setLinhas([])
        setTitulos([])
        setSelecao({});  
    }

    function finalizarSelecao(){
        const indicesSelecionados = Object.keys(selecao); 

        if(indicesSelecionados.length != campos.length){
            return alert(`Selecione exatamente ${campos.length} campos.`);
        }

        const linhasSelecionadas = linhas.map( linha => indicesSelecionados.map(ind => linha[ind]));

        promiseRef.current.resolve(
            linhasSelecionadas
        );

        limparCampos();  
    }

    async function alterarArquivo(event){
        setArquivo(event.target.files[0]);
    }

    async function processarArquivo(){
        const txt = await lerArquivo();

        const _linhas = txt?.split(quebraLinha)?.filter(l => l.trim() !== '').map(l => l.split(tabulacao));

        setTitulos(_linhas.splice(0, 1)[0]);
        setLinhas(_linhas);
        setSelecao({});

        arquivoRef.current.value = null;
    }

    useImperativeHandle(ref, ()=>({
        escolherColuna : async (campos: string[]) => {
            return new Promise(async (resolve, reject)=>{
                promiseRef.current = {resolve, reject};
                arquivoRef.current.click();
                setCampos(campos)
            })
        }
    }), [arquivoRef.current]);

    const exibir = titulos.length != 0;


    useEffect(()=> {
        if(arquivo)
            processarArquivo();

    }, [arquivo, enconding, quebraLinha, tabulacao])

    return <>
        {exibir && <Modal show={exibir} size='xl' scrollable onHide={limparCampos}>
            <Modal.Header closeButton>
                <span>Relacione as colunas</span>
            </Modal.Header>
            <Modal.Body>
                <Table striped>
                    <thead>
                        <tr>
                            {titulos.map((v, i) => (
                                <th key={i} className='text-center' style={{whiteSpace: 'nowrap'}}>
                                    { selecao[i] != null && <div style={{color:'#070', fontSize: 13}}>( {selecao[i]} )</div>}
                                    <input type='checkbox' className='m-1' onClick={(event) => selecionar(event, i)}/>{v}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            linhas.slice(0, 10).map( l => <tr key={l}>
                                {l.map((v, i) => (
                                <td className='text-center' key={i} style={{whiteSpace: 'nowrap'}}>{v}</td>
                                ))}
                            </tr>)
                        }
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <div className='d-flex justify-content-end position-absolute' style={{left: 10}}>
                    <select defaultValue={enconding} className='m-1' onChange={({target}) => setEnconding(target.value)}>
                        <option value="UTF-8">UTF-8</option>
                        <option value="ISO-8859-1">ISO-8859-1</option>
                    </select>
                    <select defaultValue={tabulacao} className='m-1' onChange={({target}) => setTabulacao(target.value)}>
                        <option value="\t">\t</option>
                        <option value=";">;</option>
                    </select>
                    <select defaultValue={quebraLinha} className='m-1' onChange={({target}) => setQuebraLinha(target.value)}>
                        <option value={"\n"}>\n</option>
                        <option value={"\r\n"}>\r\n</option>
                    </select>
                </div>
                <Button variant="primary" onClick={finalizarSelecao}>Finalizar Seleção</Button>
            </Modal.Footer>
        </Modal>}
        <input ref={arquivoRef} className='d-none' type="file" accept='text/csv' onChange={alterarArquivo}/>
    </>;
}

export default React.forwardRef(CSV) ;