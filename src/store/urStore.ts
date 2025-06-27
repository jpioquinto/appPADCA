import { create } from 'zustand'

import type { URSchema, URsSchema } from '../types'
import { listadoURs } from '../services/UrService'

type URState = {
    urs:URsSchema,
    ur:URSchema,
    deleteUR:($id: URSchema['id']) => void,
    setCurrentUR:(ur: URSchema) => void,
    updateUR:($ur: URSchema) => void,
    addUR:($ur: URSchema) => void,
    listURs:() => Promise<void>
    getURs:() => URsSchema,
    getUR:() => URSchema,
}

export const useURStore = create<URState>((set, get) => ({
    urs:[],
    ur:{} as URSchema,
    getUR:() => get().ur,
    getURs:() => get().urs,
    setCurrentUR:(ur) => set({ur}),
    updateUR: ($ur) => {
        set((state) => ({
            urs: state.urs.map(ur => ur.id === $ur.id ? $ur : ur),
            ur:{} as URSchema            
        }))
    },
    addUR:($ur) => {
        const urs = [$ur, ...get().urs]
        set({urs})
    },
    deleteUR:($id) => {
        set((state) => ({
            urs:state.urs.filter(ur => ur.id !== $id)
        }))
    },
    listURs: async () => {
        const urs = await listadoURs() as URsSchema
        set({urs})
    }
}))