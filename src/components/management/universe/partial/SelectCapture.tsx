import {type MouseEvent, useState, useEffect} from 'react'

import { useConflictStore } from '../../../../store/conflict/conflictStore'
import Select, {type SingleValue, type ActionMeta} from 'react-select'
import { useSeguimiento } from '../../../../hooks/useSeguimiento'
import type { ValueCapture } from '../../../../types/conflicto'
import type { Parametro } from '../../../../types/conflicto'
import { useCapture } from '../../../../hooks/useCapture'
import type { Option } from '../../../../types'
import { isNumeric } from '../../../../utils'
import InfoCaptura from './InfoCaptura'


type CaptureProps = {
    parametro: Parametro
}

export default function SelectCapture({parametro}: CaptureProps) {
    const [optionSelected, setOptionSelected] = useState<SingleValue<Option>>({} as Option)

    const {updateCapturaEtapa} = useConflictStore()

    const {MySwal, initCapture} = useSeguimiento()

    const {options, state} = useCapture()

    const [capture, setCapture] = useState<string|number|undefined>( state.initValueCapture(parametro.captura?.value.toString()) )
        
    const closeModal = () => {
        initCapture(parametro.etapaId, parametro.id);
        MySwal.close();
    }
    
    const endCapture = () => {
        updateCapturaEtapa(parametro.etapaId, parametro.id, {value:capture, type:(capture && isNumeric(capture?.toString())) ? 'number' : 'string'} as ValueCapture); 
        closeModal();
    }
    
    const selectOption = (newValue: SingleValue<Option>, _actionMeta: ActionMeta<Option>) => {
        setCapture(newValue?.value && isNumeric(newValue?.value.toString()) ? +newValue?.value : newValue?.value)
        setOptionSelected(newValue)
    }
    
    const clickAccept = (_e: MouseEvent<HTMLButtonElement>) => {        
        if (capture) {
            endCapture()
        } 
    }

    useEffect(() => {
        const selected = options.optionsValuadores.filter(option => option.value === capture)

        setOptionSelected(selected[0])

    }, [options.optionsValuadores])
    
  return (
    <>
    {parametro.capturando && (<>
                        <div className='d-flex justify-content-center pb-3'>
                            <Select 
                                placeholder='Elija una opción'
                                className='flex-fill'
                                options={options.optionsValuadores} 
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                    control: (baseStyles, _state) => ({
                                        ...baseStyles,
                                        textAlign: 'left',
                                    })
                                }}
                                onChange={selectOption}
                                value={optionSelected}
                            />
                        </div>
                        <div className='d-flex justify-content-center'>
                            <button type="button" className="btn btn-info btn-sm textl-white fw-semibold" onClick={clickAccept}>Aceptar</button>
                            <button type="button" className="btn btn-secondary btn-sm fw-semibold ms-1" onClick={(_e: MouseEvent<HTMLButtonElement>) => closeModal()}><i className="fa fa-window-close"></i> Cerrar</button>
                        </div>
                    </>)
    }
    {!parametro.capturando && (<InfoCaptura parametro={parametro} />)}        
    </>
  )
}
