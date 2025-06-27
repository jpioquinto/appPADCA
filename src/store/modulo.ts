import { create } from 'zustand'

import { RegistroModulo, RegistrosModulo } from '../schema/modulo-schema'
import { listadoModulos } from '../services/ModuloService'
import type { MenuItem } from '../types'
import { makeHash } from '../utils'

type ModuloState = {
    modulo:MenuItem,
    registro:RegistroModulo,
    modulos:RegistrosModulo,
    keyModule:string,
    setKeyModule:(keyModule:string) => void,
    setCurrentModulo:(registro: RegistroModulo) => void,
    deleteModulo:(id: RegistroModulo['id']) => void,
    updateModulo:(registro: RegistroModulo) => void,
    addModulo:(registro: RegistroModulo) => void,
    setModulo:(modulo: MenuItem) => void,
    listModules:() => Promise<void>
}

export const useModuloStore = create<ModuloState>((set, get) => ({
    registro:{} as RegistroModulo,
    modulo:{} as MenuItem,
    keyModule:makeHash(5),
    modulos:[],
    setKeyModule:(keyModule) => set({keyModule}),
    setCurrentModulo: registro => set({registro}),
    setModulo: (modulo) => {
        set({   
            modulo
        })
    },
    listModules: async () => {
        const modulos = await listadoModulos()
        set({
            modulos
        })

    },
    deleteModulo: id => {
        set({
            modulos:get().modulos.filter(modulo => modulo.id !== id)
        })
    },
    addModulo: registro => {
        set({
            modulos:[registro, ...get().modulos]
        })
    },
    updateModulo:($modulo) => {
        set(state => ({
            modulos:state.modulos.map(modulo => modulo.id === $modulo.id ? $modulo : modulo),
        }))
    }
}))