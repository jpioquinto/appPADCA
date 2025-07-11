import {type MouseEvent} from 'react';

import type { Parametro, DraftCaptura } from "../types/conflicto";
import { useConflictStore } from "../store/conflict/conflictStore";
import { saveStage, uploadDoc } from '../services/ConflictoService';
import { useFileStore } from '../store/conflict/fileStore';
import { useConfigStore } from '../store/config';
import { useConflicto } from './useConflicto';
import { notificacion } from '../utils';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useModalStore } from '../store/modal';
import { AxiosError } from 'axios';

const MySwal = withReactContent(Swal)

export function useSeguimiento() {
    const {upload, resetUpload, setLoadTotal, setProcessed, setCancel, setTotal, getProcessed, getTotal, getCancel, getLoadTotal} = useFileStore();

    const {
        captura, conflicto, removeCapture, request, getCaptura, updateEvidenceCapture, resetRemoveCapture, setRemoveCapture, 
        getRemoveCapture, resetCaptura, deleteCapturaEtapa, initCapture, setRequest} = useConflictStore();

    const {setIntervalId, getIntervalId} = useConfigStore();

    const {keyModal, setKeyModal} = useModalStore();

    const cerrarModal = () => MySwal.close();

    const {catalog} = useConflicto();

    const loadCatalog = () => {        
        if (catalog.getValuadores().length == 0) {
            catalog.listValuadores()
        }
    }

    const reset = () => {
        resetUpload({}); resetCaptura({}); setLoadTotal(0); setCancel(0); setTotal(0);
        resetRemoveCapture([])
    }

    const uploadFiles = (parametroId: Parametro['id'], files: File[]) => {
        let total = getLoadTotal();
        let processed = getProcessed();
        files.forEach(async file => {
            const result = await uploadDoc(conflicto.id, parametroId, file);
            if (result.solicitud) {
                setLoadTotal(++total) 
                updateEvidenceCapture(parametroId, result.path)
            }

            if (!result.solicitud) {
                notificacion(`No se cargó el archivo ${file.name}. ${result.message}`, 'error')
            }
            
            setProcessed(++processed)            
        });
    }
    
    const processUpload = () => {
        return new Promise(resolve => {
            for (const parametroId in upload) {
                uploadFiles(+parametroId, upload[parametroId as keyof typeof upload])
            }

            const iTimer = setInterval(()=> {
                if (getProcessed() < (getTotal() + getCancel())) {
                    return;
                }

                if (getLoadTotal() > 0) {
                    notificacion(`Se han cargado ${getLoadTotal()} evidencia(s).`, 'info');
                }

                clearInterval(getIntervalId());
                setTimeout(() => resolve(null), 1000)
            },500)

            setIntervalId(iTimer);            
        })
    }

    const save = async () => {      
        try {

            if (Object.keys(getCaptura()).length == 0 && getRemoveCapture().length == 0) {
                reset();  return;
            }

            let params = {conflictoId: conflicto.id, captures: JSON.stringify(getCaptura())}

            if (getRemoveCapture().length > 0) {
              //params['removes'] = getRemoveCapture()  
              params = {...params, ...{removes:getRemoveCapture()}}
            }  

            const result = await saveStage(params as DraftCaptura)
            if (result?.solicitud) {  
                reset();          
                notificacion(result.message, 'success');
            } else {
                throw new Error(result?.response?.data?.message || result.message);
            }
        } catch(error:AxiosError|Error|any) {
            if ((error instanceof AxiosError)) {
                let message = (error as Error).message
                if (error?.response?.data?.message) {
                    message = error.response.data.message
                }              
                notificacion(`Ocurrió un error al realizar la operación. ${message}` , 'error')
                return 
            }
            notificacion(error.message, 'error')
        } finally {
            setRequest(false)
        }
    }

    const clickBtnGuardar = (e:MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        /*console.log(upload)
        console.log(captura)*/
        setRequest(true)
        setProcessed(0)
        if (Object.keys(upload).length > 0) {
            processUpload().then(save)
        } else {
          save()  
        } 
    }

    const eliminarCaptura = (parametro:Parametro) => {
        deleteCapturaEtapa(parametro.etapaId, parametro.id)
        setRemoveCapture(parametro.capturaId)
        cerrarModal()
    }

    return {
        data:{captura, upload, removeCapture, request},
        clickBtnGuardar,
        eliminarCaptura,
        setKeyModal,
        cerrarModal,
        initCapture,
        loadCatalog,
        reset,
        keyModal,
        MySwal
    }
}