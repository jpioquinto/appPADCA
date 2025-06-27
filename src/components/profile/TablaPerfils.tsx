import {useRef} from 'react'
import { useModuloStore } from '../../store/modulo'

import DataTable, {type DataTableRef} from 'datatables.net-react'
import DataTablesCore, {type Api} from 'datatables.net'
import DT from 'datatables.net-bs5'

import type { Acciones, PerfilSchema, PerfilsSchema } from '../../types'
import languaje from './../../data/Spanish_Mexico.json'
import BtnAccion from './BtnAccion'

import { removeDiv } from '../../utils'
import * as bootstrap from 'bootstrap'

type PerfilsProps = {
    perfils:PerfilsSchema
}

export default function TablaPerfils({perfils}: PerfilsProps) {
    const modulo = useModuloStore(state=>state.modulo)
    
    const table = useRef<DataTableRef>(null)

    DataTable.use(DT)

    const columns = [
        { data: 'nombre' },
        { data: 'descripcion' },
        { data: 'estatus' },
        { data: 'creado_el', className:'text-center', render: DT.render.datetime()},
        { data: 'creador' },
        { data: 'id' },
      ]

    const generarAcciones = (perfil:PerfilSchema) => {
              
        return <BtnAccion acciones={modulo.acciones as Acciones} perfil={perfil} key={perfil.id} />        
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
        const intervalId = setInterval(() => initTooltips(table.current ? table.current!.dt() : null, intervalId), 750);
    }

  return (
    <DataTable 
        data={perfils}
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
                    renderer:   DataTablesCore.Responsive.renderer.listHiddenNodes() as never
                }
            },
            select: true,
        }}
        slots={{
            2: (estatus:PerfilSchema['estatus'], _row:PerfilSchema) => {
                if ([2,3].includes(estatus)) {
                    return <span className="badge rounded-pill badge-warning">Inactivo</span>
                }
                return <span className="badge rounded-pill badge-success">Activo</span>
            },
            5: (_id:PerfilSchema['id'], row:PerfilSchema) => {
                return generarAcciones(row)                
            }
        }}
    >
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estatus</th>
                <th className="text-center">Fecha de creación</th>
                <th>Creado por</th>
                <th className="text-center">Acciones</th>
            </tr>
        </thead>
    </DataTable>
  )
}
