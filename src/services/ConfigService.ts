import $axios from '../utils/axios'
import { baseURL } from '../utils'

export async function getContentUrl() {
    try {
        const response =  await $axios.get(`${baseURL()}/api/config/url-content`);
        
        return response.data.url
    } catch(error) {
        return ''      
    } 
}