import { useContext } from "react";
import {Navigate} from 'react-router-dom'
import {AuthContext} from '../../context/AuthContext'

const ProtectedRoute = ({ children, roles}) => {
    const {user, initializing} = useContext(AuthContext)

    if(initializing) {
        return (
            <div>
                <div />
            </div>
        )
    }

    if(!user) {
        return <Navigate to='/login' replace />
    }

    if(roles && !roles.includes(user.role)) {
        return <Navigate to='/' replace />
    }

    return children
}

export default ProtectedRoute