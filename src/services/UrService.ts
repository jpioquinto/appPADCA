import { URsSchema } from "../schema/ur-schema"
import type { URSchema } from "../types"
import type { DraftFormUR } from "../types/form"
import $axios from '../utils/axios'
import { baseURL } from "../utils"

type StoreUR = DraftFormUR & {
    id?:URSchema['id']
}

type DeleteUR = Pick<URSchema, 'id'>

export async function listadoURs() {
    try {
        const response =  await $axios.get(`${baseURL()}/api/ur/listado-ur`);         
        if (response.data.solicitud) {
            const result = URsSchema.safeParse(response.data?.listado);            
            return result.success ? result.data : []
        }              
    } catch(error) {
        return []      
    } 
}

export async function saveUR(data: StoreUR) {
    try {
        const response =  await $axios.post(`${baseURL()}/api/ur/save-ur`, data);
        
        return response.data
    } catch(error) {
        return error      
    } 
}

export async function deleteUR(data: DeleteUR) {
    try {
        const response =  await $axios.post(`${baseURL()}/api/ur/delete-ur`, data);
        
        return response.data
    } catch(error) {
        return error      
    } 
}
