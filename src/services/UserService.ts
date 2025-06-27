import type { DraftFormConfirmPass, DraftFormUser } from "../types/form"
import { UsuariosSchema } from "../schema/usuario-schema"
import type { ChangePerfilUser, ChangeStatusUser, ChangeURUser } from "../types"
import $axios from '../utils/axios'
import { baseURL } from "../utils"


export async function saveUser(data:DraftFormUser) {
    try {
        const response =  await $axios.post(`${baseURL()}/api/user/save`, data);
        
        return response.data
    } catch(error) {
        return error      
    } 
}

export async function savePasswd(data:DraftFormConfirmPass) {
    try {
        const response =  await $axios.post(`${baseURL()}/api/user/save-passwd`, data);
        
        return response.data
    } catch(error) {
        return error      
    } 
}

export async function logout() {
    try {
        const response =  await $axios.post(`${baseURL()}/api/user/logout`);
        return await response.data;
        //return response.data
    } catch(error) {
        return error      
    } 
}

export async function listadoUsuarios() {
    try {
        const response =  await $axios.get(`${baseURL()}/api/user/listado-user`);  
        if (response.status) {
            const result = UsuariosSchema.safeParse(response.data?.listado);
            
            return result.success ? result.data : []
        }              
    } catch(error) {
        return []      
    } 
}

export async function changeStatus(data: ChangeStatusUser) {
    try {
        const response =  await $axios.post(`${baseURL()}/api/user/change-status`, data);
        
        return response.data
    } catch(error) {
        return error      
    } 
}

export async function changeUR(data: ChangeURUser) {
    try {
        const response =  await $axios.post(`${baseURL()}/api/user/change-ur`, data);
        
        return response.data
    } catch(error) {
        return error      
    } 
}

export async function changePerfil(data: ChangePerfilUser) {
    try {
        const response =  await $axios.post(`${baseURL()}/api/user/change-perfil`, data);
        
        return response.data
    } catch(error) {
        return error      
    } 
}