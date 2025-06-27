import {useRef, useEffect} from 'react'

import DataTable, {type DataTableRef} from 'datatables.net-react'
import DataTablesCore, {type Api} from 'datatables.net'
import DT from 'datatables.net-bs5'
import 'datatables.net-select-bs5'
import 'datatables.net-responsive-bs5'

import type { Registro, Registros } from '../../../types/conflicto'
import { useCatalogStore } from '../../../store/catalogStore'
import languaje from '../../../data/Spanish_Mexico.json'
import { useModuloStore } from '../../../store/modulo'
import type { Acciones } from '../../../types'
import { removeDiv } from '../../../utils'
import * as bootstrap from 'bootstrap'
import BtnAccion from './BtnAccion'

import type { Option } from '../../../types'

type ConflictsProps = {
    conflictos:Registros,
    seguimiento:() => void
}

export default function TablaAsuntos({conflictos, seguimiento}: ConflictsProps) {
    const modulo = useModuloStore(state=>state.modulo);

    const {getEstatus, setOptionsEstatus} = useCatalogStore();

    const table = useRef<DataTableRef>(null);

    DataTable.use(DT);

    const columns = [
        { data: 'folio' },
        { data: 'vertAcronimo', className:'text-center'},
        { data: 'anioFiscal', className:'text-center'},
        { data: 'asunto' },
        { data: 'estado' },
        { data: 'municipio' },
        { data: 'promovente'},
        { data: 'predio'},
        { data: 'descEstatus' },
        { data: 'supconflicto'},
        { data: 'supatendida'},
        { data: 'id' },
      ];

    const generarAcciones = (registro:Registro) => {       
        return <BtnAccion acciones={modulo.acciones as Acciones} conflicto={registro} key={registro.id} seguimiento={seguimiento}/>     
    }

    const setTooltips = () => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
        return () => tooltipList.map(t => t.dispose())
    }

    const removeToolips = () => {        
        removeDiv("tooltip bs-tooltip-auto fade show")
    }

    const initTooltips = (table: Api|null, intervalId:number) => {     
        if (!table) {
            return
        }  
        setTooltips()        
        clearInterval(intervalId)                
    }

    const initEvent = (_e: Event) => { 
        const intervalId = setInterval(() => initTooltips(table.current ? table.current.dt() : null, intervalId), 1500);
    }

    useEffect(() => {
        const $options: Option[] = [];
        getEstatus().forEach((estatus) => {
            $options.push({value: estatus.id, label: estatus.descripcion})
        })
        setOptionsEstatus($options)
    }, [])

  return (
    <DataTable 
        data={conflictos}
        ref={table}
        columns={columns}
        className="display" 
        onInit={initEvent}       
        onDraw={initEvent}
        onDestroy={(_e: Event) => removeToolips()}
        options={{
            pageLength: 100,
            language: languaje,
            responsive: {
                details: {
                    renderer:   DataTablesCore.Responsive.renderer.listHiddenNodes()  as never
                }
            },
            select: true,
        }}       
        slots={{
            11: (_id:Registro['id'], row:Registro) => (generarAcciones(row))
        }}
    >
        <thead>
            <tr>
                <th className="text-center">Folio</th>
                <th className="text-center">Tipo Asunto</th>
                <th className="text-center">Ejercicio Fiscal</th>
                <th className="text-center">Asunto</th>
                <th className="text-center">Entidad</th>
                <th className="text-center">Municipio</th>
                <th className="text-center">Posesionario</th>
                <th className="text-center">Nombre del Predio</th>
                <th className="text-center">Estatus</th>
                <th className="text-center">Superficie en Conflicto</th>
                <th className="text-center">Superficie Real Medida</th>
                <th className="text-center">Acciones</th>
            </tr>
        </thead>
    </DataTable>
  )
}
