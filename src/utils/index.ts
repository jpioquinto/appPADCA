import type { Acciones, Accion } from '../types'
import { toast } from 'react-toastify'

export const baseURL = () => import.meta.env.VITE_APP_URL ? import.meta.env.VITE_APP_URL : ''

export const removeClase = (clases: string[], clase: string) : string => {
    const resulado = clases.filter($clase => $clase!==clase);

    return resulado.join(' ');
}

export const addClase = (clases:string[], clase:string): string => {
    if (clase==='' || clases.includes(clase)) {
        return clases.join(' ');
    }
    clases.push(clase);
    return clases.join(' ');
}

export const removeDiv = (clase:string = "modal-backdrop fade show") => {
    for(let i=0; i < document.getElementsByClassName(clase).length; i++) {
        document.getElementsByClassName(clase)[i].remove()
    }
}

export const tienePermiso = (acciones: Acciones, permisoId:Accion['id']) => {
    if (!acciones) {
        acciones = []
    }
    const permiso = acciones.filter(accion => accion.id === permisoId)

    return permiso.length>0
}

export const notificacion = (message:string, $type:string, _time:number = 300) => {
    toast[$type](message, {
        position:"bottom-right",
        theme:"colored"
    });
}

export const isInteger = (value: string): boolean => {
    const typeInt = /^[-]?[0-9]+$/;
    return typeInt.test(value);
}

export const isNumeric = (value: string): boolean => {
    const typeFloat =  /^[-]?[0-9]+\.[0-9]+$/;
    return (typeFloat.test(value) || isInteger(value));
}

export const isNumericPositive = (value: string): boolean => {
    const typeFloat =  /^[0-9]+\.[0-9]+$/;
    const typeInt   = /^[0-9]+$/;
    return (typeFloat.test(value) || typeInt.test(value));
}

export const makeHash = (longitud:number = 32): string =>  {

    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let hash     = "";

    for (let i = 0; i < longitud; i++) {
        hash += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return hash;
}

export function formatNumeric(amount: number) {
    return new Intl.NumberFormat('en-US').format(amount)
}


export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(amount)
}

export function formatDate(dateStr: string) : string {
    const dateObj = new Date(dateStr)
    const options : Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return new Intl.DateTimeFormat('es-ES', options).format(dateObj)
}

export function formatDateShort(dateStr: string) : string {
    const date = dateStr.split('-')
    return date.reverse().join('/')
}

export function clone(obj: object): object {
    return JSON.parse(JSON.stringify(obj));
}