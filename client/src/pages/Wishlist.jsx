import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { WishlistContext } from '../context/WishlistContext'
import { CartContext } from '../context/CartContext'
import WishlistButton from '../components/product/WishlistButton'
import toast from 'react-hot-toast'

const Wishlist = () => {
    const { wishlist, loading, clear } = useContext(WishlistContext)
    const { addToCart } = useContext(CartContext)

    const handleAddToCart = async(productId) => {
        try {
            await addToCart(productId, 1)
            toast.success('Added to cart!')
        } catch(error) {
            toast.error(error?.response?.data?.message || 'Failed to add to cart')
        }
    }

    if(loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        )
    }

    if(!wishlist?.products?.length) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <p className="text-6xl mb-4">❤️</p>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Your wishlist is empty
                </h2>
                <p className="text-gray-500 mb-6">
                    Save products you love by clicking the heart icon
                </p>
                <Link to="/products"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                    Browse Products
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
                        <p className="text-gray-500 mt-1">
                            {wishlist.products.length} saved items
                        </p>
                    </div>
                    <button onClick={clear}
                        className="text-sm text-red-500 hover:underline font-medium">
                        Clear All
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.products.map(({ product, addedAt }) => {
                        if(!product) return null
                        const image = product.image?.[0]?.url ||
                            'https://placehold.co/300x300/e3e3e3/666?text=No+Image'

                        return (
                            <div key={product._id}
                                className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden hover:shadow-md transition">

                                {/* Image */}
                                <Link to={`/products/${product._id}`}>
                                    <div className="relative h-48 overflow-hidden">
                                        <img src={image} alt={product.name}
                                            className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                                        {product.discount > 0 && (
                                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {product.discount}% OFF
                                            </span>
                                        )}
                                        {product.stock === 0 && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <span className="text-white font-semibold">Out of Stock</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                {/* Info */}
                                <div className="p-4">
                                    <p className="text-xs text-indigo-500 font-medium mb-1">
                                        {product.category?.name}
                                    </p>
                                    <Link to={`/products/${product._id}`}>
                                        <h3 className="font-semibold text-gray-800 truncate hover:text-indigo-600 transition">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    {/* Price */}
                                    <div className="flex items-center gap-2 my-2">
                                        <span className="font-bold text-gray-900">
                                            ₹{product.finalPrice?.toFixed(2)}
                                        </span>
                                        {product.discount > 0 && (
                                            <span className="text-xs text-gray-400 line-through">
                                                ₹{Number(product.price).toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs text-gray-400 mb-3">
                                        Added {new Date(addedAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short'
                                        })}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product._id)}
                                            disabled={product.stock === 0}
                                            className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                        <WishlistButton
                                            productId={product._id}
                                            className="p-2 border rounded-xl hover:bg-red-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Wishlist