import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext"
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ProductCard = ({product}) => {
    const {addToCart} = useContext(CartContext)
    const {user} =useContext(AuthContext)

    const handleAddToCart = async(e) => {
        e.preventDefault()
        if(!user) {
            toast.error('Please login to add items to cart')
            return
        }
        try{
            await addToCart(product._id, 1)
            toast.success('Added to cart!')
        } catch(error) {
            toast.error(error?.response?.data?.message || 'Failed to add to cart')
        }
    }
    const image = product.omage?.[0]?.url || 'https://placehold.co/300x300/e3e3e3/666666?text=No+Image'


    return(
        <Link to={`/products/${product._id}`} className="group">
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border-grey-100">
                <div className="relative overflow-hidden h-52">
                    <img src={image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition suration-300" />

                    {product.discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {product.discount}% OFF
                        </span>
                    )}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg"> Out of Stock</span>
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <p className="text-xs text-indigo-500 font-medium mb-1">{product.category?.name || 'Uncategorized'}</p>
                    <h3 className="font-semibold text-grey-800 truncate mb-2 group-hover:text-indigo-600 transition">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold next-grey-900">
                            {product.finalPrice?.toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                            <span className="text-sm text-grey-400 line-through"> 
                                {Number(product.price).toFixed(2)}
                            </span>
                        )}
                    </div>
                    
                    {/* Add to Cart — only for customers and guests */}
                    {(!user || user.role === 'customer') && (
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    )}

                    {/* Show View Product instead for seller/admin */}
                    {user && user.role !== 'customer' && (
                    <div className="w-full bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-semibold text-center">
                        View Product
                    </div>
                    )}
                    {/* <button onClick={handleAddToCart} disabled={product.stock === 0}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed">
                        {product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
                    </button> */}



                </div>
            </div>
        </Link>
    )
}

export default ProductCard