import { ContentFile } from '../schema/conflicto-schema'
import $axios from '../utils/axios'
import { baseURL } from '../utils'
import { AxiosError } from 'axios'

export async function getEvidence($path: string) {
    try {
        const response =  await $axios.post(`${baseURL()}/api/conflict/evidence`, {path: $path});
        
        if (Object.prototype.hasOwnProperty.call(response, 'solicitud')) {
            const result = ContentFile.safeParse(response.data);            
            return result.success ? result.data : response.data;
        }
        return response.data;
    } catch(error:AxiosError|Error|any) {
        if ((error instanceof AxiosError)) {
            return error?.response?.data 
        }
        return error       
    } 
}