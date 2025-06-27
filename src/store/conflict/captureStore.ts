import { create } from 'zustand'

type CaptureState = {
    currentIndex:number,
    itemSelected:string,
    capture: string|number|(number | string)[],
    setCurrentIndex:(currentIndex:number) => void,
    setItemSelected:(itemSelected:string) => void,
    getCurrentIndex:() => number,
    getItemSelected:() => string,
    setCaptura: (capture: string|number|(number | string)[]) => void,
    getCaptura: () => string|number|(number | string)[]
}

export const useCaptureStore = create<CaptureState>((set, get) => ({
    capture:'',
    currentIndex:-1,
    itemSelected:'',
    setCurrentIndex:(currentIndex) => set({currentIndex}),
    setItemSelected:(itemSelected) => set({itemSelected}),
    getCurrentIndex:() => get().currentIndex,
    getItemSelected:() => get().itemSelected,
    setCaptura:(capture) => set({capture}),
    getCaptura:() => get().capture
}))