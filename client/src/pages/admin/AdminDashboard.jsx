import { useState, useEffect } from "react"
import {Link} from 'react-router-dom'
import { fetchAllOrders } from "../../api/adminAPI"
import {fetchProducts} from "../../api/productAPI"


const StatCard = ({title, value, icon, color, to }) => {
    <Link to={to} className={`bg-white rounded-2xl shadow p-6 border-l-4 ${color} hover:shadow-md transition block`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1">{title}</p>
                <p  className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
            <span className="text-4xl">{icon}</span>
        </div>
    </Link>
}


const AdminDashboard = () => {
    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async() => {
            try {
                const [ordRes, prodRes] = await Promise.all([
                    fetchAllOrders(),
                    fetchProducts({ limit: 100 })
                ])
                setOrders(ordRes.data.orders || [])
                setProducts(prodRes.data.products || [])
            } catch(error) {
                console.error("Admin dashboard error: ", error)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const totalRevenue = orders.filter(o=> o.status !== 'cancelled').reduce((sum ,o) => sum + o.totalPrice, 0)

    const ordersByStatus = {
        placed: orders.filter( o => o.status === 'placed').length,
        processing: orders.filter( o => o.status === 'processing').length,
        shipped: orders.filter( o => o.status === 'shipped').length,
        delivered: orders.filter( o => o.status === 'delivered').length,
        cancelled: orders.filter( o => o.status === 'cancelled').length
    }

    if(loading) {
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
    }
    return (
        <div className="min-h-screen bg-gray-50 py-10" >
            <div className="max-w-6xl mx-auto px-4">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Admin dashboard</h1>
                    <p  className="text-gray-500 mt-1">Platform Overview </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Total Orders" value={orders.length} icon="icon" color="border-ingigo-500" to='/admin/orders' />
                    <StatCard title="Total Products" value={products.length} icon="📦" color="border-green-500" to="/admin/orders" />
                    <StatCard title="Total Revenue" value={`₹${totalRevenue.toFixed(0)}`} icon="💰"color="border-purple-500" to="/admin/orders" />
                    <StatCard title="Cancelled Orders" value={ordersByStatus.cancelled} icon="❌"color="border-red-500" to="/admin/orders" />
                </div>

                <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-8" >
                    <h2 className="text-xl font-bold text-gray-800 mb-5">Orders by Status </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {Object.entries(ordersByStatus).map(([status, count]) => (
                            <div key={status} className="text-center p-4 bg-gray-50 rounded-xl">
                                <p className="text-2xl font-bold text-gray-800">{count}</p>
                                <p className="text-xs text-gray-500 capitalize mt-1">{status}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <Link to='/admin/orders' 
                        className="bg-white rounded-2xl shadow border border-gray-100 p-6 hover:shadow-md transition text-center">
                            <p className="text-4xl mb-3">🛒</p>
                            <p className="font-bold text-gray-800">Manage Orders</p>
                            <p className="text-sm text-gray-500 mt-1">View and update all orders</p>
                        </Link>
                        <Link to ='/admin/users' 
                          className="bg-white rounded-2xl shadow border border-gray-100 p-6 hover:shadow-md transition text-center"  >
                            <p  className="text-4xl mb-3">👥</p>
                            <p className="font-bold text-gray-800">Manage Users</p>
                            <p className="text-sm text-gray-500 mt-1">View users and approve sellers</p>
                          </Link>
                         < Link to ='/admin/categories' 
                          className="bg-white rounded-2xl shadow border border-gray-100 p-6 hover:shadow-md transition text-center"  >
                            <p  className="text-4xl mb-3">🏷️</p>
                            <p className="font-bold text-gray-800">Manage Categories</p>
                            <p className="text-sm text-gray-500 mt-1">Add, Edit or delete Categories</p>
                          </Link>
                </div>

                <div className="bg-white rounded-2xl shadow border border-gray-100">
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                        <Link to="/admin/orders" className="text-sm text-indigo-600 hover:underline font-medium">View All</Link>
                    </div>
                    <div className="divide-y">
                        {orders.slice(0, 7).map(order => (
                            <div key={order._id} 
                                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                                <div>
                                    <p className="font-semibold text-gray-800">{order.orderNumber}</p>
                                    <p className="text-sm text-gray-500">{order.user?.name} * {order.totalPrice}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                        {
                                        placed: 'bg-blue-100 text-blue-700',
                                        processing: 'bg-yellow-100 text-yellow-700',
                                        shipped: 'bg-purple-100 text-purple-700',
                                        delivered: 'bg-green-100 text-green-700',
                                        cancelled: 'bg-red-100 text-red-700',
                                        }[order.status]
                                    }`}>{order.status}</span>
                                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

}
export default AdminDashboard