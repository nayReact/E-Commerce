import {useNavigate} from 'react-router-dom'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { useContext, useState } from 'react'
import {CartContext} from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'

const Checkout = () => {
    const navigate = useNavigate()
    const {cart, fetchCart} = useContext(CartContext)
    const {user} = useContext(AuthContext)
    const [placing, setPlacing] = useState(false)
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city:'',
        state: '',
        pin:'',
        phone:''
    })
    const itemsPrice = cart?.totalPrice || 0
    const shippingPrice = itemsPrice > 500 ? 0 : 50
    const totalPrice = itemsPrice + shippingPrice

    const handleChange =(e) => {
        const {name, value } = e.target
        setShippingAddress(prev => ({...prev, [name]:value }))
    }

    const prefillAddress = () => {
        const saved = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0]
        if(saved) {
            setShippingAddress({
                street: saved.street || '',
                city: saved.city || '',
                state: saved.state || "",
                pin: saved.pin || '',
                phone: saved.phone || ''
            })
            toast.success("Adress pre-filled")
        } else {
            toast.error('No saved Adress found')
        }
    }

    const validate = () => {
        const {street, city, state, pin, phone} = shippingAddress
        if(!street.trim()) return 'street adress is required'
        if (!city.trim()) return 'City is required'
        if (!state.trim()) return 'State is required'
        if (!/^[0-9]{6}$/.test(pin)) return 'PIN code must be 6 digits'
        if (!/^[0-9]{10}$/.test(phone)) return 'Phone must be 10 digits'
        return null
    }

    const handlePlaceorder = async() => {
        const error = validate()
        if(error) {
            toast.error(error)
            return
        }
    setPlacing(true)
    try {
        const {data} = await API.post('/orders', {
            shippingAddress,
            paymentMethod: 'cod',
        })
        await fetchCart()
        toast.success('Order placed successfully')
        navigate(`/orders/${data.order._id}`)
    } catch(error) {
        toast.error(error?.response?.data?.message || "Failed to Place order")  
    } finally {
        setPlacing(false)
    }
    }
    if(!cart?.items?.length) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center text-center px-4'>
                <p className='text-5xl mb-4'>Cart</p>
                <h2 className='text-2xl font-bold text-grey-800 mb-2'>your cart is empty</h2>
                <button onClick={() => navigate('/products')}
                    className='mt-4 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition'
                    >Browse Product </button>
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
                <div className="flex flex-col lg:flex-row gap-8">

                    <div className="flex-1 bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold text-gray-800">Shipping Address</h2>
                            <button onClick={prefillAddress}
                                className="text-sm text-indigo-600 hover:underline font-medium">Use Saved address</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1"> Street Address</label>
                                <input type="text" name='street' value={shippingAddress.street}
                                        onChange={handleChange} placeholder='123, MG Road'
                                        className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none' />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">City </label>
                                        <input type="text" name='city' value={shippingAddress.city} onChange={handleChange}
                                        placeholder='Bengaluru' className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none'/>
                                    
                                </div>

                                <div className="flex-1"> 
                                    <label className="block text-sm font-medium text-gray-600 mb-1"> State </label>
                                    <input type="text" name='state' value={shippingAddress.state} onChange={handleChange}
                                    placeholder='Karnataka' className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none' />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-600 mb-1"> PIN </label>
                                    <input type="text" name='pin' value={shippingAddress.pin} onChange={handleChange}
                                    placeholder='560001' maxLength={6} className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none' />
                                </div>

                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                                    <input type="text" name='phone' value={shippingAddress.phone} onChange={handleChange}
                                    placeholder='9876543210' maxLength={10} className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none' />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method </h2>
                            <div className="flex items-center gap-3 border rounded-xl px-4 py-3 bg-indigo-50 border-indigo-200">
                                <input type="radio" checked readOnly id='cod' className='accent-indigo-600 ' />
                                <label htmlFor="cod" className='font-medium text-gray-700'>Cash On delivery(COD) </label>
                                <span className="ml-auto text-xs text-gray-500"> Pay when delivered </span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-80">
                        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-5"> Order Summary </h2>

                            <div className='space-y-3 mb-5 max-h-50 overflow-y-auto'>
                                {cart.items.map(item => (
                                    <div key={item._id} className='flex gap-3 items-center'>
                                        <img src={item.product?.image?.[0]?.url || 'https://placehold.co/50x50/e3e3e3/666666?text=?'} 
                                        alt={item.product?.name} className='w-12 h-12 rounded-lg object-cover flex-shrink-0' />

                                        <div className='flex-1 min-w-0'>
                                            <p className='text-sm font-medium text-grey-800 truncate'>{item.product?.name} </p>
                                            <p className='text-xs text-grey-500'>Qty: {item.quantity} </p>
                                        </div>
                                        <p className='text-sm font-semibold'> {(item.price * item.quantity).toFixed(2)} </p>
                                    </div>
                                ))}
                            </div>

                            <div className='border-t pt-4 space-y-2 text-sm'>
                                <div className='flex justify-between text-grey-600'>
                                    <span>Items</span>
                                    <span> {itemsPrice.toFixed(2)} </span>
                                </div>

                                <div className='flex justify-between text-grey-600'>
                                    <span>Shipping</span>
                                    {shippingPrice === 0 
                                        ? <span className='text-green-600 fint-medium'> Free </span>
                                        : <span> {shippingPrice.toFixed(2)} </span> 
                                    }
                                </div>

                                <div className='flex justify-between font-bold text-grey-900 text-base pt-2 border-t'>
                                    <span>Total </span>
                                    <span> {totalPrice.toFixed(2)} </span>
                                </div>
                            </div>

                            <button onClick={handlePlaceorder}
                                disabled={placing} className='w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disavled:opacity-60'> {placing ? 'Placing Order...' : 'Place Order (COD)'} </button>

                            <button onClick={() => navigate('/cart')}
                                className='w-full mt-3 text-indigo-600 text-sm font-medium hover:underline'> Back to Cart </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout