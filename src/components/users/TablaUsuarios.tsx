import {useRef} from 'react'

import DataTable, {type DataTableRef} from 'datatables.net-react'
import DataTablesCore, {type Api} from 'datatables.net'
import DT from 'datatables.net-bs5'
/*import 'datatables.nt-responsive-dt';
import 'datatables.net-select-dt';*/
import type { Acciones, User, Users } from '../../types'

import languaje from './../../data/Spanish_Mexico.json'

import { useModuloStore } from '../../store/modulo'
import { removeDiv } from '../../utils'
import * as bootstrap from 'bootstrap'
import BtnAccion from './BtnAccion'

type UsersProps = {
    users:Users
}

export default function TablaUsuarios({users}: UsersProps) {
    const modulo = useModuloStore(state=>state.modulo)
    
    const table = useRef<DataTableRef>(null)

    DataTable.use(DT)
    
    const columns = [
        { data: 'ur' },
        { data: 'nickname' },
        { data: 'perfil' },
        { data: 'estatus', className:'text-center'},
        { data: 'creado_el', className:'text-center', render: DT.render.datetime()},
        { data: 'ultimo_acceso', className:'text-center', render: DT.render.datetime()},
        { data: 'creador' },
        { data: 'id' },
      ];
    
    const generarAcciones = (user:User) => {
              
        return <BtnAccion acciones={modulo.acciones as Acciones} user={user} key={user.id} />        
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
        data={users}
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
            3: (estatus:User['estatus'], _row:User) => {
                if ([2,3].includes(estatus)) {
                    return <span className="badge rounded-pill badge-warning">Inactivo</span>
                }
                return <span className="badge rounded-pill badge-success">Activo</span>
            },
            7: (_id:User['id'], row:User) => {
                return generarAcciones(row)                
            }
        }}
    >
        <thead>
            <tr>
                <th rowSpan={2} className="text-center">UR</th>
                <th rowSpan={2} className="text-center">Usuario</th>
                <th rowSpan={2} className="text-center">Perfil</th>
                <th rowSpan={2} className="text-center">Estatus</th>
                <th colSpan={2} className="text-center">Fechas</th>
                <th rowSpan={2} className="text-center">Creado por</th>
                <th rowSpan={2} className="text-center">Acciones</th>
            </tr>
            <tr>
                <th className="text-center">Creado el</th>
                <th className="text-center">Último acceso</th>
            </tr>
        </thead>
    </DataTable>
  )
}
