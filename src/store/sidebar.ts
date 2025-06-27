import { create } from 'zustand'
import type { Sidebar } from '../types'

type SidebarState = Sidebar & {
    setMinimize:(miniSidebar:number) => void
    setFirstToggle:(toggle:boolean) => void
    addClaseMinimize:(clase: string) => void
    removeClaseMinimize:(clase: string) => void
}

const addClase = (clases: string[], clase: string) : string => {
    if (clase==='') {
        return clases.join(' ');
    }

    if (clase==='sidebar_minimize') { 
        clases[1] = clase
    } else {
        clases[2] = clase
    }

    return clases.join(' ');
}

const removeClase = (clases: string[], clase: string) : string => {
    const resulado = clases.filter($clase => $clase!==clase);

    return resulado.join(' ');
}

export const useSidebarStore = create<SidebarState>((set) => ({
    minimize:0,
    firstToggle:false,
    claseMinimize:'wrapper',
    setFirstToggle:(toggle) => {
        set({firstToggle:toggle})
    },
    setMinimize:(miniSidebar) => {
        set({minimize:miniSidebar})
    },
    addClaseMinimize:(clase) => {
        set((state) => ({
            claseMinimize:addClase(state.claseMinimize.split(' '), clase)
        }));
    },
    removeClaseMinimize:(clase) => {
        set((state) => ({
            claseMinimize:removeClase(state.claseMinimize.split(' '), clase)
        }));
    }
}))