import { BrowserRouter, Routes, Route } from 'react-router-dom'

import {lazy, Suspense} from 'react'

import EditarPerfil from './components/users/EditarPerfil.tsx'
import Usuario from './components/users/Usuario.tsx'
import Perfil from './components/profile/Perfil.tsx'
import Dashboard from './components/Dashboard.tsx'
import UR from './components/urs/UR.tsx'
import Layout from './layouts/Layout'
import Login from './components/Login'
import Index from './pages/Index'

const Universe = lazy(() => import('./components/management/universe/Universe'))
const Tramite = lazy(() => import('./components/management/concluded/Tramite')) 
import MarcoJuridico from './components/management/legal/MarcoJuridico.tsx'
import Seguimiento from './components/management/universe/Seguimiento.tsx'
import Solicitud from './components/management/request/Solicitud.tsx'
import Registro from './components/management/register/Registro.tsx'
import Reporte from './components/management/report/Reporte.tsx'
import Modulo from './components/module/Modulo.tsx'
import Loading from './components/Loading.tsx'

import NotFound from './components/NotFound.tsx'

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>                               
                <Route path='/' element={<Index />} />
                <Route path='/login' element={<Login />} />
                <Route element={<Layout />}>
                    <Route path='/inicio' element={<Dashboard />} />
                    <Route path='/usuarios' element={<Usuario />} />
                    <Route path='/modulos' element={<Modulo />} />
                    <Route path='/perfiles' element={<Perfil />} />
                    <Route path='/editar-perfil' element={<EditarPerfil />} />
                    <Route path='/urs' element={<UR />} />                    
                    <Route path='/control-de-gestion' element={<Solicitud />} />                    
                    <Route path='/marco-juridico' element={<MarcoJuridico />} />                    
                    <Route path='/historico' element={<Suspense fallback={<Loading />}><Universe /></Suspense>} />                    
                    <Route path='/registro' element={<Registro />} />                    
                    <Route path='/asuntos-concluidos' element={<Suspense fallback={<Loading />}><Tramite /></Suspense>} />                    
                    <Route path='/seguimiento/asunto' element={<Seguimiento />} />                    
                    <Route path='/reportes' element={<Reporte />} />                    
                    <Route path='*' element={<NotFound />} />                    
                </Route>  
            </Routes>
        </BrowserRouter>
    )
}