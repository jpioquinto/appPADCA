import {type ChangeEvent, type MouseEvent, useState} from 'react'

import { cargarFoto } from '../../services/ContactSevice'
import { useUserNav } from '../../hooks/useUserNav'
import { notificacion } from '../../utils'

export default function FotoPerfil() {
    const {getFoto, setFoto} = useUserNav()

    const [foto, setAvatar] = useState<string>(getFoto())
    const [archivo, setArchivo] = useState<File | null>(null)
    const [mostrarBoton, setMostrarBoton] = useState<string>('invisible')

    const config = { limitMB:0.48828125, bytes:1048576 }

    const maxSize = config.bytes * config.limitMB;

    const subirFoto = async (archivo: File) => {
        try {
           const result =await cargarFoto(archivo)
           if (result?.solicitud) {
               setAvatar(result.url)
               setFoto(result.url)
                notificacion(result.message, 'success')
           } else {
                throw new Error(result?.response?.data?.message || result.message)
           }
        } catch (error) {            
            notificacion(error.message, 'error')
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        
        if (e.target.files && maxSize<e.target.files[0].size) {
            notificacion("El tamaño del archivo supera lo permitido ( 500 kB )", 'error');
            return false;
        }

        if (e.target.files) {
            setAvatar(URL.createObjectURL(e.target.files[0]))
            setArchivo(e.target.files[0])
        }

        setMostrarBoton('')
    }

    const handleUpload = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (archivo) {
            subirFoto(archivo)
        }
    }

  return (
      <div className="text-center">                  
        <img src={foto} alt="Foto de perfil" className="img-thumbnail mb-2" />
        <span className='mt-3'>
            <input type="file" accept=".jpg,.png" className="form-control form-control-sm" onChange={handleFileChange}/>
            <button className={`btn btn-primary btn-sm mt-2 ${mostrarBoton}`} onClick={handleUpload}>
                <span className="btn-label">
                    <i className="fa fa-image"/>
                </span>
                Cargar foto de perfil
            </button>                                            
        </span>
    </div>
  )
}
