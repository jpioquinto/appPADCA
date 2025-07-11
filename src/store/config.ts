import { create } from 'zustand'
import { getContentUrl } from '../services/ConfigService'

type configState = {
    intervalId:number,
    interceptor:number,
    contentURL:string,
    getInterceptor:() => number,
    getIntervalId:() => number,
    setIntervalId:(intervalId:number) => void,
    setInterceptor:(interceptor:number) => void,
    setContentUrl:(contentURL:string) => void,
    initContentUrl:() => Promise<void>
    getContentUrl:() => string,
}
export const useConfigStore = create<configState>((set, get) => ({
    interceptor:0,
    intervalId:0,
    contentURL:'',
    setIntervalId:(intervalId) => set({intervalId}),
    setInterceptor:(interceptor) => set({interceptor}),
    getInterceptor:() => get().interceptor,
    getIntervalId:() => get().intervalId,
    setContentUrl:(contentURL) => set({contentURL}),        
    getContentUrl:() => get().contentURL, 
    initContentUrl: async () => {
        const contentURL = await getContentUrl()

        set({contentURL})
    }      
}))