import { useSegundaModalStore } from '../store/segundaModal'
import useClassModal from './useClassModal'
import {type MouseEvent} from 'react'
 
export default function useSegundaModal() {
    const {segundaModal, showModalStore, hideModalStore} = useSegundaModalStore();
    const {addClassOpen, removeClassOpen, removeDiv} = useClassModal();

    const showSecondModal = () => {
        addClassOpen();
        showModalStore();
    }

    const hideSecondModal = () => {        
        removeClassOpen();
        removeDiv();
        hideModalStore();
    }

    const closeSecondModal = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        hideSecondModal()
    }

    const triggerSecondModal = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();        
        showSecondModal();
    }

    return {
        segundaModal,
        showSecondModal,
        hideSecondModal,
        triggerSecondModal,
        closeSecondModal
    }
}
