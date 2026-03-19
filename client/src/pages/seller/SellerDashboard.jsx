import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { fetchSellerOrders, fetchSellerProducts } from "../../api/sellerAPI"

const StartCard = ({ title, value, icon, color}) => (
    <div className={`bg-white rounded-2xl shadow p-6 border-l-4 ${color}`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
            <span className="text-4xl">{icon}</span>
        </div>
    </div>
)

const SellerDashboard = () => {
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async() => {
            try {
                const [prodRes, ordRes] = await Promise.all([
                    fetchSellerProducts(),
                    fetchSellerOrders()
                ])
                setProducts(prodRes.data.products || [])
                setOrders(ordRes.data.orders || [])
            } catch(error) {
                console.error("Dashboard load error:", error)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const totalRevenue = orders
        .filter(orders => orders.status !== 'cancelled')
        .reduce((sum, o) => {
            const sellerItems = o.items.filter(
                i => i.seller?.toString() === o.items[0]?.seller?.toString()
            )
            return sum + sellerItems.reduce((s, i) => s + i.price*i.quantity, 0)
        }, 0)

        const pendingOrders = orders.filter(o => ['placed', 'processing'].includes(o.status)).length

        if(loading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"/>
                </div>
            )
        }

        return (
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-6xl mx-auto px-4">

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
                            <p className="text-gray-500 mt-1">Manage your products and orders  </p>
                        </div>
                        <Link to='/seller/products/add'
                            className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"> Add Product </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StartCard title= "Total Products" value={products.length} icon="" colors="bordeer-indigo-500" />
                        <StartCard title= "Total Orders" value={orders.length} icon="" colors="bordeer-green-500" />
                        <StartCard title= "Pending Orders" value={pendingOrders} icon="" colors="bordeer-yellow-500" />
                        <StartCard title= "Total Revenue" value={`${totalRevenue.toFixed(0)}`} icon="" colors="bordeer-purple-500" />
                    </div>

                    <div className="bg-white rounded-2xl shadow border border-gray-100 mb-8">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Recent Products </h2>
                            <Link to='/seller/products'
                                className="text-sm text-indigo-600 hover:underline font-medium" 
                                >View All </Link>
                        </div>
                        <div className="divide-y">
                            {products.slice(0, 5).map(product => (
                                <div key={product._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition">
                                    <img src={product.image?.[0]?.url || 'https://placehold.co/48x48/e3e3e3/666666?text=?'}
                                            alt={product.name}
                                            className="w-12 h-12 rounded-xl object-cover border" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 truncate">{product.name}</p>
                                        <p className="text-sm text-gray-500">Rs: {product.finalPrice} Discount: {product.discount}% Stock: {product.stock}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        product.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                        }`}>{product.status}
                                    </span>
                                    <Link to={`/seller/products/edit/${product._id}`}
                                          className="text-sm text-indigo-600 hover:underline ml-2">Edit </Link>
                                </div>
                            ))}
                            {products.length === 0 && (
                                <div className="p-8 text-center text-gray-400">
                                    <p className="text-4xl mb-2">Product</p>
                                    <p>No Products yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow border border-gray-100">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                            <Link to="/seller/orders" className="text-sm text-indigo-600 hover:underline font-medium"> View All </Link>
                        </div>
                        <div className="divide-y">
                            {orders.slice(0, 5).map(order => (
                                <div key={order._id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                                    <div>
                                        <p className="font-semibold text-gray-800">{order.orderNumber}</p>
                                        <p className="text-sm text-gray-500">{order.user?.name} {order.totalPrice}</p>
                                    </div> 
                                    <span  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                            {
                                                placed: 'bg-blue-100 text-blue-700',
                                                processing: 'bg-yellow-100 text-yellow-700',
                                                shipped: 'bg-purple-100 text-purple-700',
                                                delivered: 'bg-green-100 text-green-700',
                                                cancelled: 'bg-red-100 text-red-700',
                                            }[order.status]
                                            }`}>{order.status}</span>
                                </div>
                            ))}
                            {orders.length === 0 && (
                                <div className="p-8 text-center text-gray-400">
                                    <p className="text-4xl mb-2"> Cart </p>
                                    <p>No orders yet </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default SellerDashboard