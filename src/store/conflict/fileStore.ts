import { create } from 'zustand'
import type { Parametro, TypeSelectedFile } from '../../types/conflicto'
import { getEvidence } from '../../services/EvidenceService'

type FileState = {
    total:number,
    read:number,
    upload:object,
    cancel:number,
    percent:number,
    loadTotal:number,
    processed:number,
    mimeType:string,
    contentURL:string,
    selectedFile:TypeSelectedFile,
    setMimeType:(mimeType:string) => void,
    setContentUrl:(contentURL:string) => void,
    resetUpload:(upload: object) => void,
    getSelectedFile:() => TypeSelectedFile,
    setProcessed:(processed:number) => void,
    setSelectedFile:(selectedFile: TypeSelectedFile) => void,
    setUpload:(parametroId: Parametro['id'], file:File[]) => void,
    initContentUrl:($path: string) => Promise<void>
    setLoadTotal:(loadTotal:number) => void,
    setPercent:(percent:number) => void,
    setCancel:(cancel:number) => void,
    setTotal:(total:number) => void,
    setRead:(read:number) => void,
    getContentUrl:() => string,
    getLoadTotal:() => number,
    getProcessed:() => number,
    getMimeType:() => string,
    getPercent:() =>  number,
    getCancel:() => number,
    getTotal:() => number,
    getRead:() => number
}

export const useFileStore = create<FileState>((set, get) =>({ 
    total:0,
    read:0,
    cancel:0,
    percent:0,
    upload:{},
    processed:0,
    loadTotal:0,
    mimeType:'',
    contentURL:'',
    selectedFile:{parametroId:0, file:[]},
    setRead:(read) => set({read}),
    setProcessed:(processed) => set({processed}),    
    resetUpload:(upload) => set({upload}),
    setSelectedFile:(selectedFile) => set({selectedFile}), 
    setLoadTotal:(loadTotal) => set({loadTotal}),
    getSelectedFile:() => get().selectedFile,
    setPercent: (percent) => set({percent}),
    setCancel:(cancel) => set({cancel}),
    getLoadTotal:() => get().loadTotal,
    setTotal: (total) => set({total}),
    getProcessed:() => get().processed,
    getPercent:() => get().percent,
    getCancel:() => get().cancel,
    getTotal:() => get().total,
    getRead:() => get().read,
    setUpload:(parametroId, file) => {
        let upload = get().upload        
        upload = {...upload, [parametroId]:file}
        
        set({upload})
    },
    setContentUrl:(contentURL) => set({contentURL}),        
    setMimeType:(mimeType) => set({mimeType}),        
    getMimeType:() => get().mimeType,        
    getContentUrl:() => get().contentURL, 
    initContentUrl: async ($path) => {
        const response = await getEvidence($path)
        if (response.solicitud) {//window.URL.createObjectURL(new Blob([response.data], {type: response.mime}))
            set({contentURL: response.data})
            get().setMimeType(response.mime)
        }

        
    }    
}))