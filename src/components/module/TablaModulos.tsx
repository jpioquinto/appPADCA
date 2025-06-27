import {useRef} from 'react'

import DataTable, {type DataTableRef} from 'datatables.net-react'
import DataTablesCore, {type Api} from 'datatables.net'
import DT from 'datatables.net-bs5'

import 'datatables.net-responsive-bs5'
import 'datatables.net-select-bs5'

import type { RegistroModulo, RegistrosModulo } from '../../schema/modulo-schema'
import { useModuloStore } from '../../store/modulo'

import languaje from './../../data/Spanish_Mexico.json'

import type { Acciones } from '../../types'
import { removeDiv } from '../../utils'
import * as bootstrap from 'bootstrap'
import BtnAccion from './BtnAccion'

type ModulesProps = {
    modules:RegistrosModulo
}

export default function TablaModulos({modules} : ModulesProps) {
    DataTable.use(DT);
    
    const modulo = useModuloStore(state=>state.modulo);

    const table  = useRef<DataTableRef>(null);

    const columns = [
        { data: 'id', className:'text-center'},
        { data: 'nombre' },
        { data: 'controlador' },
        { data: 'icono' },
        { data: 'clase' },
        { data: 'orden', className:'text-center'},
        { data: 'nodo_padre', className:'text-center'},
        { data: 'estatus', className:'text-center'},
        { data: 'acciones'},
        { data: 'descripcion'},
        { data: 'ruta' },
        { data: 'grupo', className:'text-center'},
        { data: 'id' },
    ];

     const generarAcciones = (module:RegistroModulo) => {              
        return <BtnAccion acciones={modulo.acciones as Acciones} module={module} key={module.id} />        
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
        const intervalId = setInterval(() => initTooltips(table.current ? table.current.dt() : null, intervalId), 750);
    }

  return (
    <DataTable 
        data={modules}
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
            12: (_id:RegistroModulo['id'], row:RegistroModulo) => {
                return generarAcciones(row)                
            }  
        }}      
    >
        <thead>
            <tr>
                <th className="text-center">ID</th>
                <th className="text-center">Nombre</th>
                <th className="text-center">Controlador</th>
                <th className="text-center">Icono</th>
                <th className="text-center">Clase</th>
                <th className="text-center">Orden</th>
                <th className="text-center">Nodo Padre</th>
                <th className="text-center">Estatus</th>
                <th className="text-center">Acciones</th>
                <th className="text-center">Descripción</th>
                <th className="text-center">Ruta</th>
                <th className="text-center">Grupo</th>        
                <th className="text-center">Acciones</th>
            </tr>
        </thead>
    </DataTable>
  )
}
