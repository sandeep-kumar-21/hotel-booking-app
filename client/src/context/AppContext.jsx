
import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {  useAuth, useUser } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "$"
    const navigate = useNavigate()
    const {user, isLoaded} = useUser()
    const { getToken } = useAuth()

    const [isOwner, setIsOwner] = useState(false)
    const [showHotelReg, setShowHotelReg] = useState(false)
    const [searchedCities, setSearchedCities] = useState([])
    const [rooms, setRooms] = useState([])

    const fetchRooms = async () => {
        try{
            const { data } = await axios.get('/api/rooms')
            if(data.success){
                setRooms(data.rooms)
            }else{
                console.log("fetch rooms else  error:" + data.message);
                toast.error(data.message)
            }
        }catch(error){
            console.log("fetch rooms error : "+ error.message);
            toast.error(error.message)
        }
    }

    const fetchUser = async () => {
        try{
            const {data} = await axios.get('/api/user',{headers: {Authorization: `Bearer ${await getToken()}`}})
        
            if(data.success){
                setIsOwner(data.role === "hotelOwner")
                setSearchedCities(data.recentSearchedCities)
            }else{
                // Retry Fetching user Details aftere 5 seconds
                setTimeout(() => {
                    fetchUser()
                },5000)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if(isLoaded && user) fetchUser();
    },[isLoaded,user])

    useEffect(()=>{
        fetchRooms()
    },[])

    const value = {
        currency, navigate, user, getToken, isOwner, setIsOwner, axios, showHotelReg, setShowHotelReg,
        searchedCities, setSearchedCities, rooms, setRooms
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);
