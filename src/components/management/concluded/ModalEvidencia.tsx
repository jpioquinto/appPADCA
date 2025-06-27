import {type MouseEvent, useEffect} from 'react'

import { useConflictStore } from '../../../store/conflict/conflictStore'
import { useCaptureStore } from '../../../store/conflict/captureStore'
import { baseURL, makeHash } from '../../../utils'
import type { PropsModal } from '../../../types'

type Modaltype = {
    propModal:PropsModal,
    close: (e: MouseEvent<HTMLButtonElement>) => void
}

export default function ModalEvidencia({propModal, close}: Modaltype) {
    const {setCurrentIndex, setItemSelected, getCurrentIndex, getItemSelected} = useCaptureStore()    

    const parametro = useConflictStore(state => state.parametro)

    const clickItem = (index:number) => {
        setCurrentIndex(index)
        if (parametro.captura?.docs && parametro.captura?.docs.length > 0) {
            setItemSelected(parametro.captura?.docs[getCurrentIndex()] + `?hash=${makeHash(5)}`)
        }
    }

    useEffect(() => clickItem(0),[parametro])
  return (
    <div
        className={`modal fade ${propModal.clase}`}         
        tabIndex={-1} 
        style={propModal.show ? {display:'block'} : {display:'none'}}  
    >
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5 text-truncate" id="userModalLabel"><strong>Evidencia documental -</strong> {parametro.parametro}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={close}></button>
                </div>                
                <div className="modal-body vh-100">
                    <div className='row'>
                        <div className='col-md-3 evidencias'>                            
                            <div className='row ps-3'>
                                {
                                    parametro.captura?.docs && parametro.captura?.docs.map((_doc, index) => (
                                        <div className={`col-md-4 item ${getCurrentIndex() === index ? 'selected' : ''}`} key={index + '-evidencia'}>
                                            <div className='corner'></div>
                                            <div className='check'></div>
                                            <div className='item-body'>
                                                <a
                                                    className='d-block mx-auto text-center'
                                                    onClick={(_e: MouseEvent<HTMLAnchorElement>) =>{ clickItem(index)}}
                                                >
                                                    <img src={`${baseURL()}/assets/images/icons/svg/pdf.svg`} />
                                                    <label className='d-block text-truncate'>{parametro.parametro}</label>
                                                </a>
                                            </div>
                                        </div>
                                    )) 
                                }
                            </div>                            
                        </div>
                        <div className='col-md-9'>
                            <embed
                                src={`${baseURL()}/storage/${getItemSelected()}`}
                                type='application/pdf'
                                className='w-100'
                                height={600}                              
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={close}><i className="fa fa-window-close"></i> Cerrar</button>
                </div>
                               
            </div>
        </div>
    </div>
  )
}
