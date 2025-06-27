import {useState, useEffect} from 'react'
import Breadcrumb from "../partial/Breadcrumb"
import {useLocation} from "react-router-dom"

import { usePerfilStore } from '../../store/perfil'
import { useModuloStore } from '../../store/modulo'
import useModal from '../../hooks/useModal'
import TablaPerfils from './TablaPerfils'
import ModalPerfil from './ModalPerfil'
import { makeHash } from '../../utils'

export default function Perfil() {
    const location = useLocation();

    const {modulo, setModulo} = useModuloStore()

    const [keyTable, setKeyTable] = useState(makeHash(12))
    
    const {modal, triggerModal, closeModal} = useModal()

    const {listPerfils, perfils} = usePerfilStore()    

    useEffect(() => {
        setModulo(location.state)
        setKeyTable(makeHash(12))        
        listPerfils()
    }, [modulo])

    return (
        <>
            <div className="page-inner">
                <div className="page-header justify-content-between">
                    <Breadcrumb nombre={`${modulo.descripcion}`} id={modulo.id} />
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={triggerModal}>
                        <i className="fas fa-plus-circle" ></i> Agregar
                    </button>
                </div> 
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Listado de Perfiles</h4>
                            </div>
                            <div className="card-body">
                                <TablaPerfils perfils={perfils} key={keyTable} />
                                <ModalPerfil propModal={modal} close={closeModal}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}