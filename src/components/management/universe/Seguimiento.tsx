import React, {useEffect, useMemo, type MouseEvent, type ReactNode} from 'react'
import {useNavigate} from 'react-router-dom'

import type { Etapa as TypeEtapa, Parametro } from '../../../types/conflicto'
import { useConflictStore } from '../../../store/conflict/conflictStore'
import { useSeguimiento } from '../../../hooks/useSeguimiento'
import ModalEvidencia from '../concluded/ModalEvidencia'
import { useModuloStore } from '../../../store/modulo'
import { tienePermiso } from '../../../utils'
import type { Acciones } from '../../../types'
import useModal from '../../../hooks/useModal'

import InputSuperficie from './partial/InputSuperficie'
import SelectCapture from './partial/SelectCapture'
import InfoCaptura from './partial/InfoCaptura'
import Afirmacion from './partial/Afirmacion'
import Etapa from './partial/Etapa'

export default function Seguimiento() {
    const {conflicto, etapas, listStages, updateEtapa, initCapture} = useConflictStore()

    const {clickBtnGuardar, MySwal, data, reset, loadCatalog} = useSeguimiento()

    const modulo = useModuloStore(state => state.modulo)

    const {modal, closeModal} = useModal()

    const navigate = useNavigate()

    const elemProblem = ():ReactNode => <>{conflicto.problematica}</>

    const loadComponent = (component:string): React.ComponentType<any> => {
        const components = {
            'Afirmacion': Afirmacion,
            'InfoCaptura': InfoCaptura,
            'InputSuperficie': InputSuperficie,
            'SelectCapture': SelectCapture,
        }
        return Object.prototype.hasOwnProperty.call(components, component) 
            ? components[component as keyof typeof components] : Afirmacion
    }

    const accionAfirmacion = (parametro:Parametro, etapaId:TypeEtapa['id']) => {
        if (!parametro?.captura) {                       
            initCapture(etapaId, parametro.id);
        }
        
        MySwal.fire({
            title:"Elija una opción",
            text: `¿Qué acción desea realizar?`,
            icon: "info",
            html:<Afirmacion parametro={parametro}/>,
            showConfirmButton:false,
            allowOutsideClick:false,
            allowEscapeKey:false,
        });
    }

    const accionInput = (parametro:Parametro, etapaId:TypeEtapa['id']) => {
        if (!parametro?.captura) {            
            initCapture(etapaId, parametro.id); 
            return           
        }

        const CaptureComponent = loadComponent(parametro.accion==='Superficie' ? 'InputSuperficie' : 'InfoCaptura')

        MySwal.fire({
            title:"Información capturada",
            text: `¿Qué acción desea realizar?`,
            icon: "warning",
            html:<CaptureComponent parametro={parametro}/>,
            showConfirmButton:false,
            allowOutsideClick:false,
            allowEscapeKey:false,
        });
    }

    const accionInputSelect = (parametro:Parametro, etapaId:TypeEtapa['id']) => {
        if (!parametro?.captura) {            
            initCapture(etapaId, parametro.id);            
        }

        const CaptureComponent = loadComponent(parametro.accion==='Superficie' ? 'InputSuperficie' : 'SelectCapture')

        MySwal.fire({
            title:"Información capturada",
            text: `¿Qué acción desea realizar?`,
            icon: "warning",
            html:<CaptureComponent parametro={parametro}/>,
            showConfirmButton:false,
            allowOutsideClick:false,
            allowEscapeKey:true,
        });
    }

    const accionParametro = (parametro:Parametro, etapaId:TypeEtapa['id']) => {
        switch(parametro.accion) {
            case 'Afirmacion':                                 
                accionAfirmacion(parametro, etapaId)              
            break;
            case 'CantidadEntera': case 'CantidadNumerica': case 'Fecha': case 'Moneda':
                accionInput(parametro, etapaId)
            break;
            case 'SelectCapture': case 'Superficie':
                accionInputSelect(parametro, etapaId)
            break;
            default:break;
        }
    }

    const clickGoBack = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        navigate(-1)
    }

    const clickElement = (etapa:TypeEtapa) => {
        updateEtapa({...etapa, collapse: 'collapsing'})

        setTimeout(() => updateEtapa({...etapa, expanded:!etapa.expanded, collapse:etapa.expanded ? 'collapse' : 'collapse show'}), 100)
    }

    const clickParametro = (parametro:Parametro, etapaId:TypeEtapa['id']) => {
        accionParametro(parametro, etapaId)
    }

    const isEmptyCapture = useMemo(() => Object.keys(data.captura).length == 0 && Object.keys(data.upload).length == 0 && Object.keys(data.removeCapture).length == 0, [data.captura, data.upload, data.removeCapture])

    const sendRequest  = useMemo(() => data.request, [data.request])

    useEffect(() => {
        reset()
        loadCatalog()
        listStages(conflicto.id)        
    }, [modulo])

  return (
    <>      
        <div className="panel-header bg-primary-gradient">
            <div className="page-inner py-5">
                <div className="d-flex align-items-start align-items-md-start flex-md-row pt-2 pb-4">
                    <div className='flex-fill'>
                        <div className='d-flex justify-content-between'>
                            <h3 className="text-white fw-bold mb-3 text-uppercase">{conflicto.vertiente}</h3>
                            <h3 className="text-white fw-bold mb-3 text-uppercase">NOMBRE DEL PREDIO: {conflicto.predio}</h3>
                            <h3 className="text-white fw-bold mb-3 text-uppercase">ESTATUS: {conflicto.descEstatus}</h3>
                        </div>
                        <h6 className="text-white op-7 mb-2">{elemProblem()}</h6>
                    </div>
                    <div className="ms-md-auto ps-3 py-2 py-md-0">
                        <a href="#" className="btn btn-secondary btn-round" onClick={clickGoBack}>Regresar</a>
                    </div>
                </div>
            </div>
        </div>
        <div className="page-inner mt--5 pt-0">
            <div className="row">            
                <div className="col-md-12">
                    <div className="card full-height">
                        {
                            tienePermiso(modulo.acciones as Acciones, 13) && (
                            <div className='row'>
                                <div className="col-md-12">
                                    <div className="ml-md-auto mt-2 py-2 py-md-0 pull-right">
                                        <button className="btn btn-primary btn-round me-2" onClick={clickBtnGuardar} disabled={isEmptyCapture || sendRequest}>
                                            <i className="fa fa-save"/> Guardar
                                        </button>
                                    </div>
                                </div>
                            </div>)
                        }
                        <div className="card-body">                        
                            <div className="accordion" id="accordionConflicto">                                
                                {
                                    etapas.map((etapa:TypeEtapa, index: number) => <Etapa etapa={etapa} posicion={index+1} clickElement={clickElement} clickParametro={clickParametro} key={`stage-${etapa.id}`} />)
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>   
        <ModalEvidencia propModal={modal} close={closeModal}/>     
    </>
  )
}
