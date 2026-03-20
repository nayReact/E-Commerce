import { useState, useEffect, use, useDeferredValue } from "react";
import { fetchSellerOrders, updateOrderStatus } from "../../api/sellerAPI";
import toast from "react-hot-toast";

const statusColors = {
    placed: 'bg-blue-100 text-blue-700',
    processing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-blurede-700'
}

const nextStatusOptions = {
    placed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: []
                                       
}

const SellerOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)
    const [expandedOrder, setExpandedOrder] = useState(null)


    useEffect(() => {
        load()
    }, [])

    const load = async() => {
        try{
            const {data} = await fetchSellerOrders()
            setOrders(data.orders || [])
        } catch(error) {
            toast.error("Failed to load order")
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (orderId, status) => {
    setUpdating(orderId);
    try {
      const { data } = await updateOrderStatus(orderId, { status });
      setOrders(prev =>
        prev.map(o => o._id === orderId ? data.order : o)
      );
      toast.success(`Order marked as ${status}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };


    if(loading) {
        return (
            <div>
                <div />
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4">
                
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Seller Orders</h1>
                    <p className="text-gray-500 mt-1">{orders.length} total Orders </p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow p-16 text-center border border-gray-100">
                        <p className="text-5xl mb-4">cart</p>
                        <h2  className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
                        <p className="text-gray-500">Orders for your products will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order._id}
                                className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => setExpandedOrder(
                                        expandedOrder === order._id ? null : order._id
                                    )}>
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="font-bold text-gray-800">{order.orderNumber}</p>
                                                <p className="text-sm text-gray-500"> {order.user?.name} • {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>{order.status}</span>
                                            <span className="font-bold text-gray-800">{order.totalPrice}</span>
                                            <span  className="text-gray-400 text-sm">{expandedOrder === order._id ? '▲' : '▼'}</span>
                                        </div>
                                </div>
                                
                                {expandedOrder === order._id && (
                                    <div  className="border-t px-5 pb-5">

                                        <div className="mt-4 space-y-3 mb-5">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <img src={item.image || 'https://placehold.co/48x48/e3e3e3/666666?text=?'} alt={item.name} 
                                                      className="w-12 h-12 rounded-xl object-cover border"/>
                                                      <div className="flex-1">
                                                        <p className="font-medium text-gray-800">{item.name}</p>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity} x {item.price}</p>
                                                      </div>
                                                      <p className="font-semibold">{(item.price * item.quantity). toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-600">
                                            <p className="font-semibold text-gray-800 mb-1">Ship to:</p>
                                            <p>{order.shippingAddress.street}</p>
                                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pin} </p>
                                            <p>{order.phone}</p>
                                        </div>

                                        {nextStatusOptions[order.status]?.length > 0 && (
                                            <div className="flex items-center gap-3">
                                                <p>Update Status: </p>
                                                <div className="text-sm font-medium text-gray-600">
                                                    {nextStatusOptions[order.status].map(status => (
                                                        <button key={status}
                                                            onClick={() => handleStatusUpdate(order._id, status)}
                                                            disabled={updating === order._id}
                                                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${
                                                                status === 'cancelled'
                                                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                                            }`}>{updating === order._id ? '...' : `Mark ${status}`}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}

export default SellerOrders
