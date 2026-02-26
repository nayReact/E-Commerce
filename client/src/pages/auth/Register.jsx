import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {

    const [formData, setFormData] = useState({
        name: '',
        email:'',
        password: '',
        phone: '',
        role: 'customer'
        })
        const [loading, setLoading] = useState(false)
        const {register} = useContext(AuthContext)
        const navigate = useNavigate()

        const handleChange = (e) => {
            const {name, value} = e.target
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }))
        }
        const handleSubmit = async(e) => {
            e.preventDefault()
            setLoading(true)

            try{
                await register({
                    ...formData,
                    email: formData.email.trim().toLowerCase()
                })
                toast.success(" Registration Successfull!")
                navigate('/')
            } catch(error) {
                toast.error(
                    error?.response?.data?.message || "Registration failed"
                )
            } finally {
                setLoading(false)
            }
        }
    return(
        <div className="min-h-screen bg-grey-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-grey-900"> Create Account </h2>
                    <p className="text-grey-600 mt-2"> Join us today </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-grey-700 mb-1"> Full Name </label>
                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-grey-700 mb-1"> Email Address </label>
                        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@email.com"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"/>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-grey-700 mb-1">Phone Number </label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Primary Number" 
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-grey-700 mb-1">Password </label>
                        <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Minimun 8 characters"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"/>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-grey-700 mb-1">Confirm Password</label>
                        <input id="confirm Password" type="password" name="confirm Password" value={formData.confirmPassword} placeholder="Re-enter password"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"/>
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-grey-700 mb-1"> Register As</label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none">
                            <option value='customer'>Customer</option>
                            <option value='seller'>Seller</option>
                        </select>
                    </div>
                    {formData.role === 'seller' && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800"> Seller acount require Admin approval before you can list products.</p>
                        </div>
                    )}
                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"> 
                        {loading ? 'creating Account...' : 'Create Account'}
                    </button>
                </form>
                <p className="text-center mt-6 text-grey-600">Already have an account? {' '}
                    <Link to='/login' className="text-primary font-semibold hover:underline"> Login here </Link>
                </p>
            </div>
        </div>
    )
}

export default Register