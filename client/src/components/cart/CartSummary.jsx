import {useNavigate} from 'react-router-dom'

const CartSummary = ({ cart }) => {
    const navigate = useNavigate()
    const itemsPrice = cart?.totalPrice || 0
    const shippingPrice = itemsPrice > 500 ? 0 : 50
    const totalPrice = itemsPrice + shippingPrice

    return (
        <div className='bg-white rounded-2xl shadow p-6 border border-grey-100 sticky top-24'>
            <h2 className='text-xl font-bold text-grey-800 mb-5'> Order summary </h2>
            <div className='space-y-3 text-sm'>
                <div className='flex justify-between text-grey-600'>
                    <span> Items ({cart?.totalItems}) </span>
                    <span>{itemsPrice.toFixed(2)} </span>
                </div>
                <div className='flex justify-between text-grey-600'>
                    <span>Shipping</span>
                    {shippingPrice === 0 ? (
                        <span className='text-green-600 font-medium'>Free</span>
                    ) : (
                        <span>{shippingPrice.toFixed(2)} </span>
                    )}
                </div>

                {shippingPrice > 0 && (
                    <p className='text-xs text-grey-400'> Add {(500 - itemsPrice).toFixed(2)} more for free shipping </p>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-base">
                    <span>Toatl</span>
                    <span>{totalPrice.toFixed(2)} </span>
                </div>
            </div>

            <button onClick={() => navigate('/checkout')}
                className='w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition'>
                    Proceed to Checkout
                </button>

                <button onClick={() => navigate('/products')}
                    className='w-full mt-3 text-indigo-600 text-sm font-medium hover:underline'>
                        Continue Shopping 
                </button>
        </div>

    )
}
export default CartSummary