import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { fetchMyOrders } from "../api/orderAPI"
import toast from "react-hot-toast"

const statusColors = {
    placed: 'bg-blue-100 text-blue-700',
    processing : 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
}

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const load = async() => {
            try {
                const {data} =await fetchMyOrders()
                setOrders(data?.orders || [])
            } catch(error) {
                toast.error('Failed to load orders')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if(loading) {
        return (
            <div className="min-h-screen flex item-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        )
    }

    if(!orders.length) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <p className="text-6xl mb-4">Orders</p>
                <h2 className="text-2xl font-bold text-grey-800 mb-2">No orders yet</h2>
                <p className="text-grey-500 mb-6">Looks like you haven't placed any orders</p>
                <Link  to='/products' className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                    Start Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-grey-50 py-10">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-grey-800 mb-8">My Orders</h1>

                <div className="space-y-4">
                    { orders.map(order => (  
                        <div key={order._id} className="bg-white rounded-2xl shadow border border-grey-100 p-6 hover:shadow-md transition">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Order Number</p>
                                    <p className="font-bold text-gray-800">{order.orderNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 mb-1">Placed on: </p>
                                    <p className="text-sm text-gray-600"> {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        day:'numeric', month:'short', year: 'numeric'
                                    })}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="flex gap-3 mb-4 overflow-x-auto pb-1">
                                {order.items.slice(0,4).map((item, i) => (
                                    <div key={i} className="flex-shrink-0 flex items-center gap-2">
                                        <img src={item.image || 'https://placehold.co/48x48/e3e3e3/666666?text=?'} alt={item.name}
                                        className="w-12 h-12 rounded-lg object-cover border" />
                                        <div>
                                            <p className="text-xs font-medium text-gray-700 max-w-[100px] truncate">{item.name}</p>
                                            <p className="text-xs text-gray-400">{item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                                {order.items.length > 4 && (
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <span className="text-xs text-gray-500 font-medium"> +{order.items.length - 4} </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div>
                                    <p className="text-xs text-gray-400">Total</p>
                                    <p className="font-bold text-gray-900">{order.totalPrice.toFixed(2)}</p>
                                </div>
                                <Link to={`/orders/${order._id}`} 
                                    className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">  
                                    View Details </Link>
                            </div>  
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Orders