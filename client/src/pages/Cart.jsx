import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import { Link } from "react-router-dom"
import CartItem from "../components/cart/CartItem"
import CartSummary from "../components/cart/CartSummary"

const Cart = () => {
    const {cart, loading, clearCart } = useContext(CartContext)
    const {user} = useContext(AuthContext)

    if(!user) {     //if not logged in
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <p className="text-5xl mb-4"> cart </p>
                <h2 className="text-2xl font-bold text-grey-800 mb-2">Your cart is waiting</h2>
                <p className="text-grey-500 mb-6"> Please login to view your Cart</p>
                <Link to='/login' className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"> Login </Link>
            </div>
        )
    }
    if(loading) {       //if loading
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 border-b-2"/>
            </div>
        )
    }
    if(!cart?.items?.length) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <p className="text-6xl mb-4"> Empty </p>
                <h2 className="text-2xl font-bold text-grey-800 mb-2">Your cart is empty</h2>
                <p className="text-grey-500 mb-6">Looks like you haven't added anything yet</p>
                <Link to='/products' className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">Browse Products </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-grey-50 py-10">
            <div className="max-w-6xl mx-auto px-4"> 
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl fint-bold text-grey-600">Your cart
                        <span className="ml-2 text-lg font-normal text-gray-500">({cart.totalItems} items)</span>
                    </h1>
                    <button onClick={clearCart} 
                        className="text-sm text-red-500 hover:text-red-700 hover:underline transition">Clear cart </button>
                </div>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 bg-white rounded-2xl shadow p-6 border border-gray-100">
                        {cart.items.map(item => (
                            <CartItem key={item._id} item={item}/>
                        ))}
                    </div>

                    <div className="w-full lg:w-80">
                        <CartSummary cart={cart} />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Cart