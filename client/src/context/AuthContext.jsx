import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import API from "../api/axios.js";

export const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [initializing, setInitializing] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')

        if(token && savedUser) {
            try{
                setUser(JSON.parse(savedUser))
            } catch {
                localStorage.clear()
            }
        }
        setInitializing(false)
    }, [])
    const login = useCallback(async(email, password) => {
        const {data} = await API.post('/auth/login', {email, password})

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        setUser(data.user)
        return data
    }, [])

    const register = useCallback(async(payload) => {
        const {data} = await API.post('/auth/register', payload)

        localStorage.setItem('token', data.token)
        localStorage.setItem('user',JSON.stringify(data.user))
        setUser(data.user)
        return data
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }, [])

    const value = useMemo(
        ()=> ({
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            initializing
        }), [user, login, register, logout, initializing]
    )
    return (
        <AuthContext.Provider value={value}>
            {!initializing && children}
        </AuthContext.Provider>
    )
}