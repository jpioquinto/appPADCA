import { create } from 'zustand'

import type { EdosSchema, MunpioSchema, MunpiosSchema } from '../types'
import { listadoEdos, listadoMunpio } from '../services/EdoService'
import type { object } from 'zod'

type EdoState = {
    edos:EdosSchema,
    munpios:object,
    currentMnpios:MunpiosSchema,
    getEdos:() => EdosSchema,
    listEdos:() => Promise<void>,
    listMunpios:(edoId: MunpioSchema['estado_id']) => Promise<void>
}

export const useEdoStore = create<EdoState>((set, get) => ({
    currentMnpios:[] as MunpiosSchema,
    edos:[] as EdosSchema,
    munpios:{},
    getEdos:() => get().edos,
    listEdos: async () => {
        const edos = await listadoEdos()
        set({
            edos
        })
    },
    listMunpios: async (edoId) => {
        if (Object.prototype.hasOwnProperty.call(get().munpios, edoId)) {            
            set({
                currentMnpios:get().munpios[edoId  as keyof typeof object] 
            }) 
            return
        }
        
        const listMunpios    = await listadoMunpio(edoId)
        //listMunpios[edoId] = await listadoMunpio(edoId)
        
        set((state) => ({
            munpios:{...state.munpios, ...{[edoId]:listMunpios}},
            currentMnpios:listMunpios
        }))
    }
}))