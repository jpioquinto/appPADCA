import { useState } from "react"
import { notificacion } from "../utils"
import { useFileStore } from "../store/conflict/fileStore"

type TypeConfig = {
    limitMB:number,
    bytes:number,
    maxSize:number,
}

const initConfig = {
    limitMB:import.meta?.env?.VITE_MAX_SIZE_FILE || 30,
    bytes:1048576,
    maxSize:5 * 1048576

}
export default function useReadFiles() {    
    const [config, setConfig] = useState<TypeConfig>(initConfig)

    const {total, percent, read, setRead, setCancel, setPercent, setUpload, setSelectedFile, getSelectedFile, 
        getPercent, setTotal, getTotal, getCancel, getRead} = useFileStore()    
   
    const [reading, setReading] = useState<boolean>(false)
    
    const setLimitSize = (size:number) => setConfig({...config, limitMB:size, maxSize: size * config.bytes})

    const setTotalFiles     = (total:number) => setTotal(total)

    const calPercent = ($percent: number) => {
        const $total   = getTotal() == 0 ? 1 : getTotal();

        $percent /= $total; 

        if (($percent + getPercent()) > 100) {
            setPercent( 100 )
        } else {
            setPercent( Math.round($percent + getPercent()) )
        }                                
    }

    const setPropertiesRead = () => {
        setSelectedFile({parametroId:0, file:[]})
        setReading(false)
        setPercent(0)
        setCancel(0)
        setTotal(0)
        setRead(0)
    }

    const onError = (e: ProgressEvent<FileReader>) => {        
        switch(e?.target?.error) {
            case e?.target?.error?.NOT_FOUND_ERR:
                notificacion('Archivo no encontrado!', 'error');
            break;
            case e?.target?.error?.NOT_SUPPORTED_ERR:
                notificacion('El archivo no se puede leer, verifique permisos.', 'error');
            break;
            case e?.target?.error?.ABORT_ERR:
                notificacion('Lectura de archivo abortada, verifique permisos.', 'error');
            break; // noop
            default:
                notificacion('A ocurrido un error durante la lectura del archivo, verifique tamaño y/o permisos.', 'error');
            break;
        }
    }

    const onProgress = (e: ProgressEvent<FileReader>) => {        
        if (!e.lengthComputable) {
            return;
        }

        calPercent(Math.round((e.loaded / e.total) * 100))     
    }

    const onLoadStart = (_e: ProgressEvent<FileReader>) => setReading(true)

    const onLoadEnd = (_e: ProgressEvent<FileReader>) => {
        setRead(getRead() + 1)        
        if (getTotal() == (getRead() + getCancel())) {
            setTimeout(() => setReading(false), 500)            
        }        
    }

    return { 
        config,
        getSelectedFile,        
        estatus: {percent, read, reading, total},
        reader:{onLoadStart, onProgress, onLoadEnd, onError},
        setPropertiesRead,
        setSelectedFile,
        setTotalFiles,
        setLimitSize,
        setCancel,        
        setUpload
    }
}