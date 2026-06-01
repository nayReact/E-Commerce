import { useState, useContext, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import OTPInput from "./OTPInput";
import API from "../../api/axios";
import toast from "react-hot-toast";


const getDashboardRoute = (role) => {
    const routes = { admin: '/admin/dashboard', seller: '/seller/dashboard', customer: '/' }
    return routes[role] || '/'
}

const Login = () => {
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    // Tab state
    const [activeTab, setActiveTab] = useState('password') // password | otp

    // Password login state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    // OTP login state
    const [otpEmail, setOtpEmail] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [sendingOtp, setSendingOtp] = useState(false)
    const [verifyingOtp, setVerifyingOtp] = useState(false)
    const [countdown, setCountdown] = useState(0)

    // Countdown timer for resend
    const startCountdown = () => {
        setCountdown(60)
        const timer = setInterval(() => {
            setCountdown(prev => {
                if(prev <= 1) { clearInterval(timer); return 0 }
                return prev - 1
            })
        }, 1000)
    }

    const isPasswordValid = useMemo(() => {
        return email?.includes('@') && password?.length >= 6
    }, [email, password])

    // Password login
    const handlePasswordLogin = useCallback(async(e) => {
        e.preventDefault()
        if(!isPasswordValid) {
            toast.error('Enter valid email and password')
            return
        }
        setLoading(true)
        try {
            const data = await login(email, password)
            toast.success('Login successful!')
            navigate(getDashboardRoute(data.user.role))
        } catch(error) {
            toast.error(error?.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }, [email, password, login, navigate, isPasswordValid])

    // Send OTP
    const handleSendOTP = async(e) => {
        e.preventDefault()
        if(!otpEmail?.includes('@')) {
            toast.error('Enter a valid email address')
            return
        }
        setSendingOtp(true)
        try {
            await API.post('/auth/send-otp', { email: otpEmail })
            setOtpSent(true)
            startCountdown()
            toast.success('OTP sent to your email!')
        } catch(error) {
            toast.error(error?.response?.data?.message || 'Failed to send OTP')
        } finally {
            setSendingOtp(false)
        }
    }

    // Verify OTP
    const handleVerifyOTP = async(otp) => {
        setVerifyingOtp(true)
        try {
            const { data } = await API.post('/auth/verify-otp', {
                email: otpEmail,
                otp
            })
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            toast.success('Login successful!')
            navigate(getDashboardRoute(data.user.role))
            window.location.reload() // refresh auth context
        } catch(error) {
            toast.error(error?.response?.data?.message || 'Invalid OTP')
        } finally {
            setVerifyingOtp(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-indigo-50 px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Login to continue</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                            activeTab === 'password'
                                ? 'bg-white shadow text-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Password Login
                    </button>
                    <button
                        onClick={() => setActiveTab('otp')}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                            activeTab === 'otp'
                                ? 'bg-white shadow text-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Email OTP
                    </button>
                </div>

                {/* Password Login */}
                {activeTab === 'password' && (
                    <form onSubmit={handlePasswordLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@email.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Minimum 6 characters"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !isPasswordValid}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                )}

                {/* OTP Login */}
                {activeTab === 'otp' && (
                    <div className="space-y-5">
                        {!otpSent ? (
                            // Step 1 — Enter email
                            <form onSubmit={handleSendOTP} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={otpEmail}
                                        onChange={e => setOtpEmail(e.target.value)}
                                        placeholder="you@email.com"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={sendingOtp || !otpEmail?.includes('@')}
                                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    {sendingOtp ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            </form>
                        ) : (
                            // Step 2 — Enter OTP
                            <div className="space-y-5">
                                <div className="text-center">
                                    <p className="text-gray-600 text-sm">
                                        OTP sent to
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                        {otpEmail}
                                    </p>
                                </div>

                                {verifyingOtp ? (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                                    </div>
                                ) : (
                                    <OTPInput
                                        length={6}
                                        onComplete={handleVerifyOTP}
                                    />
                                )}

                                {/* Resend */}
                                <div className="text-center">
                                    {countdown > 0 ? (
                                        <p className="text-sm text-gray-400">
                                            Resend OTP in {countdown}s
                                        </p>
                                    ) : (
                                        <button
                                            onClick={handleSendOTP}
                                            disabled={sendingOtp}
                                            className="text-sm text-indigo-600 hover:underline font-medium"
                                        >
                                            {sendingOtp ? 'Sending...' : 'Resend OTP'}
                                        </button>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        setOtpSent(false)
                                        setOtpEmail('')
                                    }}
                                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                                >
                                    ← Change email
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Demo credentials */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</p>
                    <p className="text-xs text-blue-800">Customer: john@example.com / password123</p>
                    <p className="text-xs text-blue-800">Seller: seller@example.com / password123</p>
                    <p className="text-xs text-blue-800">Admin: admin@example.com / admin123</p>
                </div>

                <p className="text-center mt-6 text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
// const getDashboardRoute = (role) => {
//     const routes = {
//         admin:'/admin/dashboard' ,
//         seller:'/seller/dashboard' ,
//         customer:'/' 
//     }
//     return routes[role] || '/'
// }

// const Login = () => {
//     const {login} = useContext(AuthContext)
//     const navigate = useNavigate()
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [loading, setLoading] = useState(false)

//     const isValid = useMemo(() => {
//         return email?.includes('@') && password?.length >= 6
//     }, [email, password])

//     const handleSubmit = useCallback(
//         async(e) => {
//             e.preventDefault()
//             if(!isValid) {
//                 toast.error('Invalid email or password!')
//                 return
//             }
//             setLoading(true)
//             try {
//                 const data = await login(email, password)
//                 toast.success('Login sucessfull')
//                 navigate(getDashboardRoute(data.user.role))
//             } catch(error) {
//                 toast.error(error.response?.data?.message || 'Login failed')
//             } finally{
//                 setLoading(false)
//             }
//         }, [email, password, login, navigate, isValid]
//     )
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-grey-100 to-indigo-50 ox-4">
//             <div className="w-full max-w-md bg-white shadow-xl rouded-2xl p-8">
//                 <div className="text-center mb-8">
//                     <h2 className="text-3xl font-bold text-grey-900">Welcome Back </h2>
//                     <p className="text-grey-600 mt-2">Login to continue</p>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address"
//                     className="w-full px-4 py-3 border border-grey-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"/>
//                     <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />

//                     <button type="submit" disabled={loading || !isValid}
//                         className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
//                     >{loading ? "Logging in..." : "Login"} </button>
//                 </form>
//                 <p className="text-center mt-6 text-grey-600"> Don't have an account?{" "}
//                     <Link to='/register' className="text-primary font-semibold hover:underline">Register</Link>
//                 </p>
//                 <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//                     <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</p>
//                     <p className="text-xs text-blue-800">Customer: test@one.com / pass123</p>
//                     <p className="text-xs text-blue-900">Customer: john@example.com / password123</p>
//                     <p className="text-xs text-blue-800">Seller: seller@example.com / Seller@123</p>
//                     <p className="text-xs text-blue-900">Seller: seller2@example.com / seller123</p>
//                     <p className="text-xs text-blue-900">Admin: admin@example.com / admin123</p>
                    
//                 </div>
//             </div>              
//         </div>
//     )

//     }
// export default Login