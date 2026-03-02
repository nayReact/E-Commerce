import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { CartContext } from '../../context/CartContext'
const CartItem = ({item}) => {
    const {updateCartItem, removeFromCart } = useContext(CartContext)
    const [updating, setUpdating] = useState(false)

    const product = item.product
    const image = product?.image?.[0]?.url || 'https://placehold.co/100x100/e3e3e3/666666?text=No+Image'

    const handleQuantityChange = async (newQty) => {
        if(newQty < 1) return
        if(newQty > product.stock) {
            toast.error(`Only ${product.stock} items available`)
            return
        }
        setUpdating(true)
        try {
            await updateCartItem(item._id, newQty)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update")
        } finally {
            setUpdating(false)
        }
    }

    const handleRemove = async() => {
        try {
            await removeFromCart(item._id)
            toast.success('Items removed from cart')
        } catch(error) {
            toast.error('Failed to remove item')
        }
    }

    return (
        <div className='flex gap-4 py-5 border-b last:border-b-0'>

            <div className='w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-grey-100'>
                <img src={image} alt={product?.name} className='w-full h-full object-cover' />
            </div>

            <div className='flex-1 min-w-0'>
                <h3 className='font-semibold text-grey-800 truncate'> {product?.name} </h3>
                <p className='text-sm text-grey-500 mt-0.5'>{product?.category?.name}</p>
                
                <p className='text-indigo-600 font-medium mt-1'> {item.price?.toFixed(2)} each</p>
                {product?.stock <=5 && product.stock > 0 && (
                    <p className='text-xs text-orange-500 mt-1'>Only {product.stock} left</p>
                )}
            </div>
            
            <div className='flex flex-col items-end justify-between'>
                <p className='font-bold text-grey-900'> {(item.price * item.quantity).toFixed(2)} </p>
                <div className='flex items-center border rounded-lg overflow-hidden'>
                    <button onClick={() => handleQuantityChange(item.quantity - 1)}
                        disabled={updating || item.quantity <= 1}
                        className='px-3 py-1 hover:bg-grey-100 teansition text-lg font-bold disabled:opacity-40'> - </button>
                    <span className='px-3 py-1 font-semibold text-sm'>{updating ? '...' : item.quantity} </span>
                    <button onClick={()=> handleQuantityChange(item.quantity + 1)}
                    disabled={updating || item.quantity >= product?.stock}
                    className='px-3 py-1 hover:bg-gray-100 transition text-lg font-bold disabled:opacity-40'> +</button>
                </div>

                <button onClick={handleRemove}
                className='text-xs text-red-500 hover:text-red-700 hover:underline transition'> Remove </button>
            </div>
        </div>
    ) 
}
export default CartItem