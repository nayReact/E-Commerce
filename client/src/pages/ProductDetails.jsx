import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import { fetchProduct } from "../api/productAPI"
import toast from "react-hot-toast"

const ProductDetails = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const {addToCart} = useContext(CartContext)
    const {user} = useContext(AuthContext)

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [addingToCart, setAddingToCart] = useState(false)

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true)
            try {
                const {data} = await fetchProduct(id)
                setProduct(data.product)
            } catch(error) {
                toast.error('Product not found')
                navigate('/products')
            } finally {
                setLoading(false)
            }
        }
        loadProduct()
    }, [id, navigate])

    const handleAddToCart = async() => {
        if(!user) {
            toast.error('Please login to add items to cart')
            navigate('/login')
            return
        }
        setAddingToCart(true)
        try {
            await addToCart (product._id, quantity)
            toast.success('Added to cart')
        } catch(error) {
            toast.error(error?.response?.data?.message || 'Failed to add to cart')
        } finally {
            setAddingToCart(false)
        }
    }

    if(loading) {
        return (
            <div>
                <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded-xl" />
                    <div className="flex-1 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3" />
                        <div className="h-8 bg-gray-200 rounded w-2/3" />
                        <div className="h-5 bg-gray-200 rounded w-1/4" />
                        <div className="h-24 bg-gray-200 rounded" />
                        <div className="h-12 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        )
    }
    
    if(!product) return null

    const images = product.images?.length ? product.image : [{url: 'https://placehold.co/600x600/e3e3e3/666666?text=No+Image'}]

    const isOutOfStock = product.stock === 0 
    return (
        <div className="min-h-screen bg-grey-50 py-10">
            <div className="max-w-6xl mx-auto px-4">
                <nav className="text-sm text-grey-500 mb-6">
                    <span onClick={() => navigate('/products')} className="hover:text-indigo-600 cursor-pointer"> Products </span>
                    <span className="mx-2" >/</span>
                    <span onClick={() => navigate(`/products?category =${product.category?._id}`)}
                        className="hover:text-indigo-600 cursor-pointer">{product.category?.name} </span>
                    <span className="mx-2">/</span>
                    <span className="text-grey-600 font-medium">{product.name} </span>
                </nav>

                <div className="bg-white rounded-2xl shadow p-6 md:p-10">
                    <div className="flex flex-col md:flex-row gap-10">
                        <div className="w-full md:w-1/2">
                            <div className="rounded-xl overflow-hidden h-80 md:h-96 bg-gray-100">
                                <img src={images[selectedImage]?.url} 
                                    alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            {images.length > 1 && (
                                <div className="flex gap-2 mt-3">
                                    {images.map((img, i) => (
                                        <button key={i} onClick={() => setSelectedImage(i)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                                                    selectedImage === i
                                                    ? 'border-indigo-500'
                                                    : 'border-transparent hover:border-gray-300'
                                                }`}> <img src={img.url} alt="" className="w-full h-full object-cover"/> 
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2 text-sm text-indigo-500 font-medium">
                                <span>{product.category?.name}</span>
                                {product.brand && (
                                    <>
                                        <span className="text-grey-300">|</span>
                                        <span className="text-grey-500">{product.brand}</span>
                                    </>
                                )}
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold text-grey-900">{product.name}</h1>
                            
                            <div className="flex items-center gap-2"> 
                                <div className="flex text-yellow-400">
                                    {[...Array(5).map((_, i) => (
                                        <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
                                    ))]}
                                </div>
                                <span className="text-sm text-grey-500">
                                    ({product.numReviews} reviews)
                                </span>
                                <span className="text-sm text-grey-400">
                                    {product.views} views
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-grey-900">
                                    {product.finalPrice?.toFixed(2)}
                                </span>
                                {product.discount > 0 && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through">
                                            ₹{Number(product.price).toFixed(2)}
                                        </span>
                                        <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-0.5 rounded-full">
                                            {product.discount}% OFF
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                <div>
                                    {isOutOfStock ? (
                                    <span className="text-red-500 font-medium">Out of Stock</span>
                                    ) : (
                                    <span className="text-green-600 font-medium">
                                        In Stock ({product.stock} available)
                                    </span>
                                    )}
                                </div>
                                
                                  {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-4 py-2 text-lg font-bold hover:bg-gray-100 transition"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="px-4 py-2 text-lg font-bold hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              )}

              <div className="pt-4 border-t text-sm text-gray-500">
                Sold by{' '}
                <span className="font-medium text-gray-700">
                  {product.seller?.name}
                </span>
              </div>
                        </div>
                    </div>

                     {product.specifications && (
            <div className="mt-10 border-t pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[...product.specifications.entries()].map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-sm">
                    <span className="font-medium text-gray-600 capitalize">{key}:</span>
                    <span className="text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
                </div>
            </div>
        </div>
    )
}

export default ProductDetails