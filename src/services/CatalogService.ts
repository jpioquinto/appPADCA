import { EstatusSchema, OrganizacionesSchema, RegimenesSchema, UnidadesSchema, VertientesSchema } from "../schema/catalog-schema"
import $axios from '../utils/axios'
import { baseURL } from "../utils"

export async function listadoVertientes() {
    try {
        const response =  await $axios.get(`${baseURL()}/api/catalog/listado-vertientes`);  
        if (response.status==200) {
            const result = VertientesSchema.safeParse(response.data?.listado);
            
            return result.success ? result.data : []
        }   
        
        return []
    } catch(error) {
        return []      
    } 
}

export async function listadoUnidades() {
    try {
        const response =  await $axios.get(`${baseURL()}/api/catalog/listado-unidades`);  
        if (response.status==200) {
            const result = UnidadesSchema.safeParse(response.data?.listado);
            
            return result.success ? result.data : []
        }   
        
        return []
    } catch(error) {
        return []      
    } 
}

export async function listadoRegimenes() {
    try {
        const response =  await $axios.get(`${baseURL()}/api/catalog/listado-regimenes`);  
        if (response.status==200) {
            const result = RegimenesSchema.safeParse(response.data?.listado);
            
            return result.success ? result.data : []
        }   
        
        return []
    } catch(error) {
        return []      
    } 
}

export async function listadoOrganizaciones() {
    try {
        const response =  await $axios.get(`${baseURL()}/api/catalog/listado-organizaciones`);  
        if (response.status==200) {
            const result = OrganizacionesSchema.safeParse(response.data?.listado);
            
            return result.success ? result.data : []
        }   
        
        return []
    } catch(error) {
        return []      
    } 
}

export async function listadoEstatus() {
    try {
        const response =  await $axios.get(`${baseURL()}/api/catalog/listado-estatus`);  
        if (response.status==200) {
            const result = EstatusSchema.safeParse(response.data?.listado);
            
            return result.success ? result.data : []
        }   
        
        return []
    } catch(error) {
        return []      
    } 
}

export async function listadoValuadores() {
    try {
        const response =  await $axios.get(`${baseURL()}/api/catalog/listado-valuadores`);  
        if (response.status==200) {
            const result = OrganizacionesSchema.safeParse(response.data?.listado);
            
            return result.success ? result.data : []
        }   
        
        return []
    } catch(error) {
        return []      
    } 
}
