import { EdosSchema, MunpiosSchema } from "../schema/edo-schema"
import type { MunpioSchema } from "../types"
import $axios from '../utils/axios'
import { baseURL } from "../utils"

export async function listadoEdos() {
    try {
        const response =  await $axios.get(`${baseURL()}/api/edo/listado-estados`);  
        if (response.status) {
            const result = EdosSchema.safeParse(response.data?.listado);
            
            return result.success ? result.data : []
        }              
    } catch(error) {
        return []      
    } 
}

export async function listadoMunpio(edoId: MunpioSchema['estado_id']) {
    try {
        const response =  await $axios.get(`${baseURL()}/api/edo/listado-munpios/${edoId}`);  
        if (response.status) {
            const result = MunpiosSchema.safeParse(response.data?.listado);
            
            return result.success ? result.data : []
        }              
    } catch(error) {
        return []      
    } 
}

