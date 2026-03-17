import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { cancelOrder, fetchOrder } from "../api/orderAPI"
import toast from "react-hot-toast"

const statusColors = {
    placed: 'bg-blue-100 text-blue-700',
    processing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
}

const statusSteps = ['placed','processing', 'shipped', 'delivered']

const OrderDetail = () => {
    const {id} = useParams()
    const navigate = useNavigate()

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [cancelling, setCancelling] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [cancelReason, setCancelReason] = useState('')

    useEffect(() => {
        if(!id || id === 'undefined') {
            navigate('/orders')
            return
        }
        const load = async () => {
            try {
                const {data} = await fetchOrder(id)
                setOrder(data.order)
            } catch (error) {
                console.log('Full error', error)
                console.log('Response: ', error?.response?.data)

                toast.error(error?.response?.data?.message || "Order Not found")
                navigate('/orders')
            } finally{
                setLoading(false)
            }
        }
        load()
    }, [id, navigate])

    const handleCancel = async() => {
        if(!cancelReason.trim()) {
            toast.error('Please provide a cancellation reason')
            return
        }
        setCancelling(true)
        try {
            const {data} = await cancelOrder(id, cancelReason)
            setOrder(data.order)
            setShowCancelModal(false)
            toast.success('Order cancelled successfully')
        } catch(error) {
            toast.error(error?.response?.data?.message || "Failed to cancel order ")
        } finally {
            setCancelling(false)
        }
    }

    if(loading) {
        return (
            <div className="min-h-screen flex item-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        )
    }

    if(!order) return null

    const currentStepIndex = statusSteps.indexOf(order.status)
    const canCancel = ['placed', 'processing'].includes(order.status)

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-4xl mx-auto px-4">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button onClick={() => navigate('/orders')}
                            className="text-sm text-indigo-600 hover:underline mb-1 block">Back to orders </button>
                        <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
                        <p className="text-gray-500 text-sm mt-1">{order.orderNumber}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${statusColors[order.status]}`}>{order.status }</span>
                </div>

                {order.status !== 'cancelled' && (
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 mb-6">
                        <h2 className="font-bold text-gray-800 mb-6">Order Progress</h2>
                        <div className="flex items-center">
                            {statusSteps.map((step, i) => (
                                <div key={step} className="flex items-center flex-1 last:flex-none">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                                                i <= currentStepIndex
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-200 text-gray-400'
                                                }`}>
                                            {i < currentStepIndex ? '=' : i+1}
                                        </div>
                                        <p className={`text-xs mt-2 capitalize font-medium ${
                                            i <= currentStepIndex ? 'text-indigo-600' : 'text-gray-400'
                                            }`}>{step}</p>
                                    </div>
                                    {i < statusSteps.length - 1 && (
                                        <div className={`flex-1 h-1 mx-2 rounded transition ${
                                            i < currentStepIndex ? 'bg-indigo-600' : 'bg-gray-200'
                                            }`}  />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="font-bold text-gray-800 mb-4">Shipping Address</h2>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                            <p>PIN: {order.shippingAddress.pin}</p>
                            <p>Phone: {order.shippingAddress.phone}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="font-bold text-gray-800 mb-4">Payment Info </h2>
                        <div className="text-sm text-gray-600 space-y-2">
                            <div className="flex justify-between">
                                <span>Method </span>
                                <span className="font-medium uppercase"> {order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status</span>
                                <span className={`font-medium capitalize ${
                                    order.paymentStatus === 'success' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>{order.paymentStatus}</span>
                            </div>
                            {order.trackingNumber && (
                                <div className="flex justify-between">
                                    <span>Tracking </span>
                                    <span className="font-medium">{order.trackingNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 mb-6">
                    <h2 className="font-bold text-gray-800 mb-5">Items Ordered </h2>
                    <div className="space-y-4">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex gap-4 py-3 border-b last:border-b-0"> 
                                <img src={item.image || 'https://placehold.co/64x64/e3e3e3/666666?text=?' } alt={item.namae}
                                className="w-16 h-16 rounded-xl object-cover border flex-shrink-0"/>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.quantity}</p>
                                    <p className="text-sm text-gray-500">{item.price}</p>
                                </div>
                                <p className="font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)} </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Items Total </span>
                            <span>{order.itemsPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping </span>
                            {order.shippingPrice === 0 
                             ?  <span> Free</span>
                            : <span>{order.shippingPrice.toFixed(2) }</span>}
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t">
                            <span>Total</span>
                            <span>{order.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {canCancel && (
                    <div className="flex justify-end">
                        <button onClick={() => setShowCancelModal(true)}
                            className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition"> Cancel Order </button>
                    </div>
                )}

                {showCancelModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Cancel Order </h3>
                            <p className="text-gray-500 text-sm mb-4">Please Provide a reason for cancellation </p>
                            <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="e.g. Changed my mind, ordered by mistake..." rows={3}
                                className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none mb-4" />
                                <div className="flex gap-3">
                                    <button onClick={() => setShowCancelModal(false)}
                                        className="flex-1 border border-gray-300 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Go Back </button>
                                    <button onClick={handleCancel}
                                        disabled={cancelling}
                                        className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition disabled:opacity-60">{cancelling ? 'cancelling...' : 'confirm Cancel'}</button>
                                </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderDetail