import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/auth"
import Spinner from "../components/Spinner"
import $axios from "../utils/axios"
import { useEffect } from 'react'

export default function Index() {       
    const {isAuthenticated, setDataAuthenticate} = useAuthStore()

    const navigate = useNavigate()

    useEffect(() => {
        const setData = (data:any) => {        
            $axios.defaults.headers.common['Authorization'] = 'Bearer '+ data.token        
            setDataAuthenticate(data.user, data.contact, data.token)           
        }
        if (localStorage.getItem('accessAuth')) {
            setData(JSON.parse(localStorage.getItem('accessAuth')!));            
        }   

        if (!isAuthenticated) {
            navigate('/login') 
        } else {
            navigate('/inicio')
        }
    }, [isAuthenticated, setDataAuthenticate, navigate]);
    
    return (
        <div className="container container-transparent animated fadeIn text-center">
            <h1>Programa de Atención de Conflictos Agrarios</h1>     
            <div className="loader-overlay loaded1">
                <Spinner />
            </div>
        </div>
    )
}