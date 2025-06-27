import {useEffect, useState, type MouseEvent, type ChangeEvent, type KeyboardEventHandler}  from 'react'
import type {MultiValue, ActionMeta} from 'react-select'

import type { Option as TypeOption, OptionParent} from "../types"
import { useReportStore } from '../store/conflict/reportStore'
import { useFilterStore } from '../store/conflict/filterStore'
import type { FilterReport } from '../types/conflicto'
import { useEdoStore } from "../store/edoStore"
import { useConflicto } from "./useConflicto"

interface OptionAnio {
    readonly label: string,
    readonly value: number,
}

export function useFilter() { 
    const [optionsVertientes, setOptionsVertientes] = useState<TypeOption[]>([])
    
    const [optionsMunpios, setOptionsMunpios] = useState<OptionParent[]>([])
        
    const [optionsStatus, setOptionsStatus] = useState<TypeOption[]>([])

    const [optionsEdos, setOptionsEdos] = useState<TypeOption[]>([])

    const [value, setValue] = useState<readonly OptionAnio[]>([])

    const {currentMnpios, getEdos, listMunpios} = useEdoStore()

    const [inputValue, setInputValue] = useState('')

    const {listConflicts} = useReportStore() 

    const {catalog} = useConflicto() 

    const {
        optionsMunpiosSelected, entySelected, slopeSelected, statusSelected, query, setQuery, setStatusSelected, 
        setEntySelected, setSlopeSelected, setParams, setOptionsMunpiosSelected, getOptionsMunpiosSelected } = useFilterStore()

    const getFilters = (): FilterReport => {
        const params = {} as FilterReport

        if (entySelected.length > 0  && getOptionsMunpiosSelected().length == 0) {
            params['entidades'] = entySelected.join(',')
        }
        
        if (getOptionsMunpiosSelected().length > 0) {
            params['munpios'] = getValues(getOptionsMunpiosSelected()).join(',')
        }

        if (slopeSelected.length > 0) {
            params['vertiente'] = slopeSelected.join(',')
        }
        
        if (value.length > 0) {
            params['anio'] = getValues(value as OptionParent[]).join(',')
        }
        
        if (statusSelected.length > 0) {
            params['estatus'] = statusSelected.join(',')
        }

        if (query.trim() != '') {
            params['texto'] = query.trim()
        }

        return params
    }
    
    const createOption = (label: string) => ({
        label,
        value: +label,
    })

    const handleKeyDown: KeyboardEventHandler = (event) => {
        if (!inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                setValue((prev) => [...prev, createOption(inputValue)]);
                setInputValue('');
                event.preventDefault();
        }
    }
    
    const generateOptionEdos = () => {
        const $options: TypeOption[] = []
        getEdos().forEach((entidad) => {
            $options.push({value: entidad.id, label: entidad.estado})
        })

        return $options
    }

    const generateOptionVertientes = () => {
        const $options: TypeOption[] = []
        catalog.getVertientes().forEach((vertiente) => {
            $options.push({value: vertiente.id, label: vertiente.acronimo!})
        })

        return $options
    }

    const generateOptionStatus = () => {
        const $options: TypeOption[] = []
        catalog.getEstatus().forEach((status) => {
            $options.push({value: status.id, label: status.descripcion})
        })

        return $options
    }

    const generateOptionMunpios = () => {
        const $options: OptionParent[] = []
        currentMnpios.forEach((municipio) => {
            $options.push({value: municipio.id, label: municipio.municipio, nodo:municipio.estado_id})
        })
        return $options
    }

    const getValues = (data: OptionParent[]) => {
        let values:number[] = [];
        data.forEach(item => !values.includes(item.value) ? values = [...values, item.value] : undefined)

        return values
    }

    const removeMunpioSelected = (municipios: OptionParent[]) => { 
        municipios.forEach(municipio => setOptionsMunpiosSelected( getOptionsMunpiosSelected().filter(munpio => munpio.value !== municipio.value) ) )
    }

    const removeMunpios = (edoId:number) => {
        removeMunpioSelected([...optionsMunpios.filter(municipio => municipio.nodo===edoId)])
        
        setOptionsMunpios([...optionsMunpios.filter(municipio => municipio.nodo!==edoId)])
    }

    const selectEnty = (_newValue: MultiValue<TypeOption>, actionMeta: ActionMeta<TypeOption>) => {//console.log(actionMeta)        
        switch(actionMeta.action) {
            case 'select-option':
                listMunpios(actionMeta?.option?.value ? +actionMeta?.option?.value : 0)     
                if (!entySelected.includes(actionMeta?.option?.value ? +actionMeta.option.value : -1)) {
                    setEntySelected([...entySelected, actionMeta?.option?.value ? +actionMeta.option.value : -1])
                }                            
            break
            case 'remove-value':
                removeMunpios(+actionMeta.removedValue.value)
                setEntySelected([...entySelected.filter(enty => enty !== actionMeta.removedValue.value)])
            break
            default:break
        }
    }

    const selectMunpio = (_newValue: MultiValue<TypeOption>, actionMeta: ActionMeta<TypeOption>) => {
        switch(actionMeta.action) {
            case 'select-option':                    
                setOptionsMunpiosSelected([...getOptionsMunpiosSelected().filter(municipio => municipio.value !== actionMeta?.option?.value), actionMeta.option as OptionParent])          
            break
            case 'remove-value':    
                setOptionsMunpiosSelected([...getOptionsMunpiosSelected().filter(municipio => municipio.value !== actionMeta.removedValue.value)])          
            break
            default:break
        }
    }

    const selectSlope = (_newValue: MultiValue<TypeOption>, actionMeta: ActionMeta<TypeOption>) => {
        switch(actionMeta.action) {
            case 'select-option':                    
                if (!slopeSelected.includes(actionMeta?.option?.value ? +actionMeta.option.value : -1)) {
                    setSlopeSelected([...slopeSelected, actionMeta?.option?.value ? +actionMeta.option.value : -1])
                } 
            break
            case 'remove-value':                
                setSlopeSelected([...slopeSelected.filter(slope => slope !== actionMeta.removedValue.value)])
            break
            default:break
        }
    }

    const selectStatus = (_newValue: MultiValue<TypeOption>, actionMeta: ActionMeta<TypeOption>) => {
        switch(actionMeta.action) {
            case 'select-option':                    
                if (!statusSelected.includes(actionMeta?.option?.value ? +actionMeta.option.value : -1)) {
                    setStatusSelected([...statusSelected, actionMeta?.option?.value ? +actionMeta.option.value : -1])
                } 
            break
            case 'remove-value':                
                setStatusSelected([...statusSelected.filter(status => status !== actionMeta.removedValue.value)])
            break
            default:break
        }
    }

    const changeInputCapture = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setQuery(e.target.value)
    }

    const clickConsultar = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault()
       
        setParams(getFilters())
        
        listConflicts(getFilters())
    }

    useEffect(() => {
        setOptionsEdos(generateOptionEdos())
        setOptionsStatus(generateOptionStatus())    
        setOptionsVertientes(generateOptionVertientes())    
        
        setQuery('')  
        setParams({})
        setEntySelected([])  
        setSlopeSelected([])   
        setStatusSelected([]) 
        setOptionsMunpiosSelected([])
    }, [])

    useEffect(() => {
        const $listMunpios = [...optionsMunpios, ...generateOptionMunpios()]
        setOptionsMunpios($listMunpios)
    } , [currentMnpios]) 

    return {
        options: {optionsEdos, optionsVertientes, optionsStatus, optionsMunpiosSelected},
        events: {selectEnty, selectMunpio, selectSlope, selectStatus, clickConsultar, changeInputCapture},
        yearConfig:{setInputValue, setValue, handleKeyDown, value, inputValue},
        data: {optionsMunpios},
        getFilters
    }
}