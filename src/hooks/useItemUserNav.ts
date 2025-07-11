import { type Contact, type UserAuth } from "../types"
import { logout } from "../services/UserService"
import { useNavigate } from "react-router-dom"
import {useState, type MouseEvent} from 'react'
import { useAuthStore } from "../store/auth"
import { notificacion } from "../utils"

import { useConfigStore } from "../store/config"
import $axios from "../utils/axios"
import { AxiosError } from "axios"

type Toggle = {
    aria:boolean,
    classToggle:string
}

const initState = {
    aria:false,
    classToggle:'',
}

export function useItemUserNav() {
    const getInterceptor = useConfigStore(state => state.getInterceptor);

    const {contact, user, setUser, setToken, setContact, setAuthenticated, getFoto} = useAuthStore();
    
    const [toggle, setToggle] = useState<Toggle>(initState);

    const naviagte = useNavigate();

    const showElemens = () => {
        setToggle({ 
            aria:true, 
            classToggle:'show',         
        });
    }

    const hideElemens = () => {
        setToggle(initState);
    }

    const desactivarInterceptor = () => {        
        $axios.interceptors.request.eject(getInterceptor());
    }

    const cerrarSession = async () => {
        try {
            const result = await logout();
            if (result?.solicitud) {
                notificacion(result.message, 'success');

                $axios.defaults.headers.common['Authorization'] = '';
                localStorage.removeItem('accessAuth');
                
                desactivarInterceptor();
                setAuthenticated(false);
                setContact({} as Contact);
                setUser({} as UserAuth);
                setToken('');
                
                naviagte('/login');
                
                return result;
            } else {
                throw new Error(result?.response?.data?.message || result.message);
            }
        } catch (error:AxiosError|Error|any) {
            if ((error instanceof AxiosError)) {
                let message = (error as Error).message
                if (error?.response?.data?.message) {
                    message = error.response.data.message
                }              
                notificacion(`Ocurrió un error al realizar la operación. ${message}` , 'error')
                return 
            }
            notificacion(error.message, 'error');
            return error;
        }
        
    }

    const handlerToggle= (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        //(toggle.aria) ? hideElemens() : showElemens()
        if (toggle.aria) {
           hideElemens() 
        } else {
            showElemens()
        }
    }

    const clickLogout = async (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        console.log('Cerrar sesión...');
        cerrarSession();
    }

    return {
        user,
        toggle,
        contact,
        getFoto,
        clickLogout,
        handlerToggle
    }
}