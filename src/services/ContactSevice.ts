import { PuestosSchema } from "../schema/contact-schema"
import type { DraftFormPerfil } from "../types/form"
import $axios from '../utils/axios'
import { baseURL } from "../utils"

export async function listadoPuestos() {
    try {
        const response =  await $axios.get(`${baseURL()}/api/contact/listado-puestos`);  
        if (response.status==200) {
            const result = PuestosSchema.safeParse(response.data?.listado);
            
            return result.success ? result.data : []
        }   
        
        return []
    } catch(error) {
        return []      
    } 
}

export async function cargarFoto(archivo: File) {
    try {
        const formData = new FormData();
        formData.append('foto', archivo);
        const response =  await $axios.post(`${baseURL()}/api/contact/subir-foto`, formData);  
        return response.data;           
    } catch(error) {
        return error;      
    } 
}

export async function saveContacto(data: DraftFormPerfil) {
    try {
        const response =  await $axios.post(`${baseURL()}/api/contact/save-info`, data);
        
        return response.data
    } catch(error) {
        return error      
    } 
}