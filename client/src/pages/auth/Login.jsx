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

const Login = () => {
    const {login} = useContext(AuthContext)
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const isValid = useMemo(() => {
        return email?.includes('@') && password?.length >= 6
    }, [email, password])

    const handleSubmit = useCallback(
        async(e) => {
            e.preventDefault()
            if(!isValid) {
                toast.error('Invalid email or password!')
                return
            }
            setLoading(true)
            try {
                const data = await login(email, password)
                toast.success('Login sucessfull')
                navigate(getDashboardRoute(data.user.role))
            } catch(error) {
                toast.error(error.response?.data?.message || 'Login failed')
            } finally{
                setLoading(false)
            }
        }, [email, password, login, navigate, isValid]
    )
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-grey-100 to-indigo-50 ox-4">
            <div className="w-full max-w-md bg-white shadow-xl rouded-2xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-grey-900">Welcome Back </h2>
                    <p className="text-grey-600 mt-2">Login to continue</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address"
                    className="w-full px-4 py-3 border border-grey-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"/>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />

                    <button type="submit" disabled={loading || !isValid}
                        className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
                    >{loading ? "Logging in..." : "Login"} </button>
                </form>
                <p className="text-center mt-6 text-grey-600"> Don't have an account?{" "}
                    <Link to='/register' className="text-primary font-semibold hover:underline">Register</Link>
                </p>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</p>
                    <p className="text-xs text-blue-800">Customer: test@one.com / pass123</p>
                    <p className="text-xs text-blue-900">Customer: john@example.com / password123</p>
                    <p className="text-xs text-blue-800">Seller: seller@example.com / seller123</p>
                    <p className="text-xs text-blue-900">Seller: seller2@example.com / seller123</p>
                    <p className="text-xs text-blue-900">Admin: admin@example.com / admin123</p>
                    
                </div>
            </div>              
        </div>
    )

    }
export default Login