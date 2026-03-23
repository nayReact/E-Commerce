import { useState, useEffect } from "react";
import { fetchAllOrders } from "../../api/adminAPI";
import {updateOrderStatus} from '../../api/sellerAPI'
import toast from 'react-hot-toast'

const statusColors = {
    placed: 'bg-blue-100 text-blue-700',
    processing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
}

const AdminOrders = () => {
    const [orders, setOrders] = useState([])
    const [filtered, setFiltered] = useState([])
    const [loading, setLoading] = useState(false)
    const [statusFilter, setStatusFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [updating, setUpdating] = useState(null)

    useEffect(() => {
        const load = async() => {
            try {
                const {data} = await fetchAllOrders()
                setOrders(data.orders || [])
                setFiltered(data.orders || [])
            } catch(error) {
                toast.error("Failed to load error")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    useEffect(() => {
        let result = orders
        if(statusFilter !== 'all') {
            result = result.filter(o => o.status === statusFilter)
        }
        if(search.trim()) {
            result = result.filter(o => o.orderNumber?.toLowerCase().includes(search.toLowerCase()) || 
                                    o.user?.name?.toLowerCase().includes(search.toLowerCase()) )
        }
    
        setFiltered(result)
    }, [statusFilter, search, orders])

const handleStatusUpdate = async(orderId, status) => {
    setUpdating(orderId)
    try {
        const {data} = await updateOrderStatus(orderId, {status})
        setOrders(prev => prev.map(o => o._id === orderId ? data.order : o))
        toast.success(`Order marked as ${status}`)
    } catch(error) {
        toast.error(error?.response?.data?.message || 'Failed to update')
    } finally {
        setUpdating(null)
    }
}

    if(loading) {       
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4">
                
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">All Orders </h1>
                    <p className="text-gray-500 mt-1">{filtered.length} orders</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by order or customer..."
                        className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none" />

                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                          className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none">
                            <option value="all">All Status</option>
                            <option value="placed">Placed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                </div>

                <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase">
                        <div className="col-span-3">Orders</div>
                        <div className="col-span-2">Customer</div>
                        <div className="col-span-2 text-center">Total</div>
                        <div className="col-span-2 text-center">Status</div>
                        <div className="col-span-3 text-center">Actions</div>
                    </div>

                    <div className="divide-y">
                        {filtered.map(order => (
                        <div key={order._id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition">
                            <div className="col-span-3">
                                <p className="font-semibold text-gray-800 text-sm">{order.orderNumber}</p>
                                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm font-medium text-gray-700">{order.user?.name}</p>
                                <p className="text-xs text-gray-400">{order.user?.email}</p>
                            </div>
                            <div className="col-span-2 text-center font-bold text-gray-800">
                                {order.totalPrice}
                            </div>
                            <div className="col-span-2 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>
                                    {order.status}
                                </span>
                            </div >
                            <div className="col-span-3 flex justify-center gap-2 flex-wrap">
                                {order.status === 'placed' && (
                                    <button onClick={() => handleStatusUpdate(order._id, 'processing')}
                                        disabled={updating === order._id}
                                        className="px-3 py-1.5 text-xs font-semibold bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition disabled:opacity-50"
                                        >Processing </button>
                                )}
                                {order.status === 'processing' && (
                                    <button onClick={() => handleStatusUpdate(order._id, 'shipped')}
                                        disabled={updating === order._id}
                                        className="px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition disabled:opacity-50"
                                        >Shipped</button>
                                )}
                                {order.status === 'shipped' && (
                                    <button onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                        disabled={updating === order._id}
                                        className="px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition disabled:opacity-50"
                                        >Delivered</button>
                                )}
                                {!['delivered', 'cancelled'].includes(order.status) && (
                                    <button onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                        disabled={updating === order._id}
                                        className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                                        >Cancel </button>
                                )}
                                {['delivered', 'cancelled'].includes(order.status) && (
                                    <span className="text-xs text-gray-400">No Actions </span>
                                )}
                            </div>
                        </div>
                    ))}
                    </div>
                </div>

                    {filtered.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            <p className="text-4xl mb-2">Search</p>
                            <p>No Orders Found </p>
                        </div>
                    )}
            </div>
        </div>
    )
}
export default AdminOrders