import {useMemo, type MouseEvent} from 'react'

import { useReportStore } from '../store/conflict/reportStore'
import { useFilterStore } from '../store/conflict/filterStore'
import { downloadReport } from '../services/ReportService'
import { useEdoStore } from '../store/edoStore'
import { useConflicto } from './useConflicto'
import { notificacion } from '../utils'

export function useReport() {
    const {conflicts, keyTable, url, setUrl, getUrl, getConflicts} = useReportStore()

    const {keyElement, setKeyElement, getParams} = useFilterStore()

    const {listEdos, getEdos} = useEdoStore()

    const {catalog} = useConflicto()

    const loadCatalog = () => {
        if (getEdos().length == 0) {
            listEdos()
        }

        if (catalog.getVertientes().length == 0) {
            catalog.listVertientes()
        }
        
        if (catalog.getEstatus().length == 0) {
            catalog.listEstatus()
        }
    }

    const isEmpty = useMemo(() => getConflicts().length == 0, [conflicts])

    const generateLink = () => {
        const elem = document.getElementById("reportExcel");
        if (elem) {
            elem.remove();
        }

        const fileLink = document.createElement('a');

        fileLink.setAttribute('href', getUrl()!);
        fileLink.setAttribute('target', '_blank');
        fileLink.setAttribute('id', 'reportExcel');

        document.body.appendChild(fileLink);

        fileLink.click();
    }

    const getReport = async () => {
        const result = await downloadReport(getParams())        
        if (result.solicitud) {
            setUrl(result.report)
            generateLink()
            notificacion(result.message, 'success')
        } else {
            notificacion(result.message, 'error')
        }
    }

    const clickDescargar = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault()
        getReport()
    }

    return {
        key: {keyTable, keyElement}, 
        catalog:{edos:getEdos(), vertientes:catalog.getVertientes(), status:catalog.getEstatus()},
        isEmpty, url, setKeyElement, loadCatalog, getConflicts, clickDescargar
    }
}