import { useState, useContext, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const getDashboardRoute = (role) => {
    const routes = {
        admin:'/admin/dashboard' ,
        seller:'/seller/dashboard' ,
        customer:'/' 
    }
    return routes[role] || '/'
}

const login = () => {
    const {login} = useState('')
    const navigate = useNavigate()
    const {email, setEmail} = useState('')
    const {password, setPassword} = useState('')
    const {loading, setLoading} = useState(false)

    
    return(

    )
}