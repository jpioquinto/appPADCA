import {type MouseEvent, type ChangeEvent, useState, useEffect} from 'react'

import { useSeguimiento } from '../../../../hooks/useSeguimiento'
import type { Parametro } from '../../../../types/conflicto'
import useReadFiles from '../../../../hooks/useReadFiles'
import { notificacion } from '../../../../utils'

type CaptureProps = {
    parametro: Parametro
}

export default function InfoCaptura({parametro}: CaptureProps) {
    const {config, estatus, reader, setLimitSize, setPropertiesRead, setCancel, setTotalFiles, setUpload, setSelectedFile, getSelectedFile} = useReadFiles();

    const {cerrarModal, eliminarCaptura, initCapture, MySwal} = useSeguimiento();

    const [showInputFile, setShowInputFile] = useState<boolean>(false);

    const clickCargarDoc = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();//console.log(getSelectedFile())
        setUpload(getSelectedFile().parametroId, getSelectedFile().file)
        cerrarModal();
    }

    const clickShowCargarDoc = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setShowInputFile(true);
    }

    const clickEditar = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!['Afirmacion', 'Superficie', 'SelectCapture'].includes(parametro.accion!)) {
            cerrarModal();
        }
        
        initCapture(parametro.etapaId, parametro.id);
        MySwal.update({icon:'warning'});
    }

    const clickElimiinar = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        eliminarCaptura(parametro)
    }

    const clickCerrarModal = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        cerrarModal();
    }

    const readFiles = (archivos: File[]) => {
        let $cancel = 0
        for (let i = 0; i < archivos.length; i++) {
            
            if (archivos[i].size > config.maxSize) {
                setCancel(++$cancel)
                notificacion(`El tamaño del archivo ${archivos[i].name} supera lo permitido ( ${config.limitMB} MB )`, 'error', 500);
                continue;
            }                                 
            
            const $reader = new FileReader();
            
            $reader.onloadstart = reader.onLoadStart;
            $reader.onloadend   = reader.onLoadEnd;
            $reader.onprogress  = reader.onProgress;
            $reader.onerror     = reader.onError;
                              
            $reader.readAsArrayBuffer(archivos[i]);
            
            setSelectedFile(
                getSelectedFile().parametroId === parametro.id 
                ? {parametroId:parametro.id, file:[...getSelectedFile().file, archivos[i]]} 
                : {parametroId:parametro.id, file:[archivos[i]]}
            );
       }
    }

    const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        
        setPropertiesRead();

       const archivos =  e.target?.files ? e.target.files : [];

       if (archivos.length == 0) {
        return;
       }
      
       setTotalFiles(archivos.length);

       setTimeout(() => readFiles(archivos as File[]), 150)     
    }

    useEffect(() => {
        setLimitSize(30)
    }, [])

  return (
    <>
        {(parametro.requiereDoc===1 && showInputFile) && (
            <div className='container'>
                <div className='form-group'>
                    <label htmlFor="id-doc" className='fw-bold'>De click en Seleccionar archivo:</label>
                    <input id="id-doc" type="file" className='form-control' accept='.pdf, .tiff, .tif' onChange={handleFiles} multiple/>
                </div>
                {estatus.reading && (
                    <><label>Leyendo... {estatus.read} de {estatus.total}</label>
                    <div className="progress my-2" role="progressbar" aria-label="Porcentaje de lectura" aria-valuenow={estatus.percent} aria-valuemin={0} aria-valuemax={100}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width: `${estatus.percent}%`}}>{estatus.percent}%</div>
                    </div></>
                )}
                
                <div className='d-inline-flex justify-content-center'>
                    <button type="button" className="btn btn-success btn-sm textl-white fw-semibold" onClick={clickCargarDoc}>Aceptar</button> 
                    <button type="button" className="btn btn-secondary btn-sm fw-semibold" onClick={clickCerrarModal}><i className="fa fa-window-close"></i> Cerrar</button>
                </div>
            </div>
        )}
        <div className={`container ${showInputFile ? 'd-none' : ''}`}>
            <div className='d-inline-flex'>
                <p>¿Qué acción desea realizar?</p>
            </div>
            <div className='d-flex justify-content-around'>
                {parametro?.requiereDoc === 1 && (
                    <button type="button" className="btn btn-success btn-sm textl-white fw-semibold" onClick={clickShowCargarDoc}>Cargar documento</button>
                )}                 
                {parametro?.accion !== 'Afirmacion1' && (
                    <button type="button" className="btn btn-info btn-sm textl-white fw-semibold" onClick={clickEditar}>Editar la captura</button>
                )}                   
                <button type="button" className="btn btn-warning btn-sm text-white fw-semibold" onClick={clickElimiinar}>Eliminar la captura</button> 
                <button type="button" className="btn btn-secondary btn-sm fw-semibold" onClick={clickCerrarModal}><i className="fa fa-window-close"></i> Cerrar</button>
            </div>
        </div>
    </>
  )
}
