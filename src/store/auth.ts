import { create } from 'zustand'
import type { Auth, UserAuth , Contact} from '../types'

type AuthState = Auth & {
    getFoto:() => string
    setFoto:(foto: Contact['foto']) => void
    setUser:(user: UserAuth) => void
    setContact:(contact: Contact) => void
    setToken:(token:string) => void
    setAuthenticated:(authenticated:boolean) => void
    setDataAuthenticate:(user: UserAuth, contact: Contact, token:string) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
    token:'',
    isAuthenticated:false,
    user: {
        username:'',
        name:'',
        name_full:'',
        perfil:''
    },
    contact: {
        nombre:'',
        apPaterno:'',
        apMaterno:'',
        cargo:'',
        puestoId:0,
        munpioId:0,
        edoId:0,
        correo:'',
        foto:''
    },
    getFoto:() => get().contact.foto || '',
    setFoto:(foto) => {
        const contact = {...get().contact, foto}
        set({contact})
    },
    setContact: (contact) => {
        set({
            contact
        })
    },
    setUser: (user) => {
        set({
            user
        })
    },
    setToken: (token) => {
        set({token})
    },
    setAuthenticated:(isAuthenticated) => {
        set({isAuthenticated})
    },
    setDataAuthenticate:(user, contact, token) => {
        set({user, contact, token, isAuthenticated:true})
    }
}))