import {useState, useEffect, type ChangeEvent} from 'react'

import Select, {type SingleValue, type ActionMeta} from 'react-select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { saveContacto } from '../../services/ContactSevice'
import { useContactStore } from '../../store/contactStore'
import type { DraftFormPerfil } from '../../types/form'
import { useEdoStore } from '../../store/edoStore'
import type { Contact, Option} from '../../types'
import { useAuthStore } from '../../store/auth'
import ErrorForm from '../partial/ErrorForm'
import { notificacion } from '../../utils'
import FotoPerfil from './FotoPerfil'
import { AxiosError } from 'axios'


export default function EditarPerfil() {
    const {user, contact, setContact, setUser} = useAuthStore()

    const {currentMnpios, listEdos, getEdos, listMunpios} = useEdoStore()

    const [optionsMunpios, setOptionsMunpios] = useState<Option[]>([])

    const [munpioSelected, setMunpioSelected] = useState<Option>({} as Option)

    const {listPuestos, getPuestos} = useContactStore()

    const [munpioId, setMunpioId] = useState<number>(0)

    const schema = z.object({
        nombre:z.optional(z.string()).nullable(),
        apPaterno:z.string().min(2, {message: 'Ingrese un apellido paterno válido.'}),
        apMaterno:z.optional(z.string()).nullable(),
        cargo:z.string().min(6, {message: 'Ingrese un cargo válido.'}),    
        puestoId:z.string().min(1, {message: 'Seleccione el puesto.'}),
        munpioId:z.optional(z.string()).nullable(),
        edoId:z.string().min(1, {message: 'Seleccione la entidad federativa.'}),
        correo:z.string().trim().email('Ingrese una dirección de correo válida.'),
        foto:z.optional(z.string()).nullable()
    })

    type ValidationSchemaType = z.infer<typeof schema>

    const { register, handleSubmit, setValue , formState: { errors } } = useForm<ValidationSchemaType>({
            resolver: zodResolver(schema)
        })
    
    const registerContact = async (data: DraftFormPerfil) => {
        data.munpioId = munpioId.toString()
        try {
            const result = await saveContacto(data)
           
            if (result?.solicitud) {
                setContact({...contact, ...data} as Contact)
                setUser({
                    ...user,
                    name:data?.nombre!.toString(),
                    name_full:`${data?.nombre!.toString()} ${data?.apPaterno!.toString()} ${data?.apMaterno!.toString()}`
                })
                notificacion(result.message, 'success')
            } else {
                throw new Error(result?.response?.data?.message || result.message)
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
        }
        
    }

    const selectEntidad = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        listMunpios(+e.target.value)        
    }
    
    const selectedMunpio = (newValue: SingleValue<Option>, _actionMeta: ActionMeta<Option>) => {
        console.log(newValue?.value)
        if (newValue?.value) {
            setMunpioId(+newValue.value)
            setMunpioSelected(newValue)
        }        
    }

    const initMunpio = (munpio: Option[]) => {
        if (munpio.length == 0) {
            return 
        }
        setMunpioSelected(munpio[0])
    }

    useEffect(() => {
        listEdos()
        listPuestos()
    }, [])

    useEffect(() => {
        const $options: Option[] = [];
        currentMnpios.forEach((municipio) => {
            $options.push({value: municipio.id, label: municipio.municipio, sigla:undefined})
        })

        setOptionsMunpios($options)

        setTimeout(() => initMunpio($options.filter($option => +$option.value === +munpioId)), 1200)
         
    } , [currentMnpios])

    useEffect(() => {
        setValue('nombre', contact.nombre!)
        setValue('apPaterno', contact.apPaterno!)
        setValue('apMaterno', contact.apMaterno)
        setValue('cargo', contact.cargo!)
        setValue('puestoId', contact.puestoId ? contact.puestoId?.toString() : '')
        setValue('munpioId', contact.munpioId ? contact.munpioId?.toString() : '')
        setValue('edoId', contact.edoId ? contact.edoId?.toString() : '')
        setValue('correo', contact.correo!)
        
        if (contact.edoId) {
            listMunpios(+contact.edoId)
        }   
        if (contact.munpioId) {
            setMunpioId(+contact.munpioId)
        }
    }, [contact])

  return (
    <>
        <div className="panel-header bg-primary-gradient">
            <div className="page-inner py-5">
                <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
                    <div>
                        <h3 className="text-white fw-bold mb-3">Información de contacto</h3>
                        <h6 className="text-white op-7 mb-2">Por favor, ingrese su información de contacto</h6>
                    </div>
                    <div className="ms-md-auto py-2 py-md-0">
                    </div>
                </div>
            </div>
        </div>
        <div className="page-inner mt--5 pt-0">
            <div className="row">
                <div className="col-md-12">
                    <div className="card full-height">
                        <div className="card-body">
                            <div className='row'>
                                <div className="col-md-12">
                                    <span className="h6">*Imagen permitida <strong className="text-warning">(.jpg y .png)</strong> en un tamańo no máximo a <strong className="text-danger">500 KB</strong></span>
                                </div>

                                <div className="col-md-2">                          
                                    <FotoPerfil />
                                </div>

                                <div className="col-md-10">
                                    <form onSubmit={handleSubmit(registerContact)} className="row needs-validation">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="id-nombre">Nombre</label>
                                                <input id="id-nombre" type="text" className={`form-control input-solid ${errors.nombre ? 'is-invalid' : ''}`} 
                                                    {...register('nombre')}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="id-appaterno">Apellido Paterno</label>
                                                <input id="id-appaterno" type="text" className={`form-control input-solid ${errors.apPaterno ? 'is-invalid' : ''}`} required
                                                    {...register('apPaterno')}
                                                />
                                                {errors.apPaterno && (                                    
                                                    <ErrorForm>{errors.apPaterno?.message}</ErrorForm>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="id-apmaterno">Apellido Materno</label>
                                                <input id="id-apmaterno" type="text" className={`form-control input-solid ${errors.apMaterno ? 'is-invalid' : ''}`}
                                                    {...register('apMaterno')}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="id-estado">Estado</label>                                        
                                                <select className={`form-control input-solid ${errors.edoId ? 'is-invalid' : ''}`} id="id-estado" required
                                                    value={contact.edoId?.toString()}
                                                    {...register('edoId')}
                                                    onChange={selectEntidad}
                                                >
                                                    <option value="">Seleccione...</option>
                                                    {getEdos().map(entidad => (
                                                        <option value={entidad.id} key={entidad.id}>{entidad.estado}</option>
                                                    ))}
                                        
                                                </select>
                                                {errors.edoId && (                                    
                                                    <ErrorForm>{errors.edoId?.message}</ErrorForm>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="id-municipio">Alcaldía / Municipio</label>                                    
                                                <Select 
                                                    placeholder='Seleccione...'
                                                    value={munpioSelected}
                                                    options={optionsMunpios} 
                                                    menuPortalTarget={document.body}
                                                    styles={{
                                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                        control: (baseStyles, _state) => ({
                                                            ...baseStyles,
                                                            textAlign: 'left',
                                                        })
                                                    }}                                                    
                                                    onChange={selectedMunpio}                                                    
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="id-puesto">Puesto</label>                                        
                                                <select className={`form-control input-solid ${errors.puestoId ? 'is-invalid' : ''}`} id="id-puesto" required
                                                    value={contact.puestoId?.toString()}
                                                    {...register('puestoId')}
                                                >
                                                    <option value="">Seleccione...</option>
                                                    {getPuestos().map(puesto => (
                                                        <option value={puesto.id} key={puesto.id}>{puesto.puesto}</option>
                                                    ))}
                                        
                                                </select>
                                                {errors.puestoId && (                                    
                                                    <ErrorForm>{errors.puestoId?.message}</ErrorForm>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="id-mail">Correo electrónico</label>
                                                <input id="id-mail" type="email" className={`form-control input-solid ${errors.correo ? 'is-invalid' : ''}`}
                                                    {...register('correo')}
                                                />
                                                {errors.correo && (                                    
                                                    <ErrorForm>{errors.correo?.message}</ErrorForm>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="form-group">  
                                                <label htmlFor="id-cargo">Cargo Oficial</label>                              
                                                <input id="id-cargo" type="text" className={`form-control input-solid ${errors.cargo ? 'is-invalid' : ''}`}
                                                    {...register('cargo')}
                                                />
                                                {errors.cargo && (                                    
                                                    <ErrorForm>{errors.cargo?.message}</ErrorForm>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <hr />
                                        </div>

                                        <div className="col-md-12">
                                            <div className="ml-md-auto py-2 py-md-0 pull-right">
                                                <button type="submit" className="btn btn-primary btn-round me-2">
                                                    <i className="fa fa-save"/> Guardar
                                                </button>
                                            </div>
                                        </div>                                
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
