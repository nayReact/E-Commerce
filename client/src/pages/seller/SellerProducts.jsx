import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchSellerProducts, deleteProduct } from "../../api/sellerAPI";
import toast from "react-hot-toast";

const SellerProducts = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)

    useEffect(() => {
        load()
    }, [])

    const load = async () => {
        try {
            const {data} = await fetchSellerProducts()
            setProducts(data.products || [])
        } catch(error) {
            toast.error('Failed to load Products')
        } finally{
            setLoading(false)
        }
    }

    const handleDelete = async(id) => {
        if(!window.confirm('Are you sure want to delete this product?')) return
        setDeletingId(id)
        try {
            await deleteProduct(id)
            setProducts(prev => prev.filter(p => p._id !== id))
            toast.success('Product deleted')
        } catch(error) {
            toast.error('Failed to delete product')
        } finally {
            setDeletingId(null)
        }           
    }

    if(loading) {
        return(
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Products</h1>
                        <p className="text-gray-500 mt-1">{products.length} products listed. </p>
                    </div>
                    <Link to="/seller/products/add"
                        className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
                        > Add Product </Link>
                </div>

                {products.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow p-16 text-center border border-gray-100">
                        <p className="text-5xl mb-4">..P..</p>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">No Products yet </h2>
                        <p className="text-gray-500 mb-6">Start by adding your first Product</p>
                        <Link to="/seller/products/add"
                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"> Add Product </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            <div className="col-span-5"> Product </div>
                            <div className="col-span-2 text-center">Price</div>
                            <div className="col-span-2 text-center">Stock</div>
                            <div className="col-span-2 text-center">Status</div>
                            <div className="col-span-2 text-center">Actions</div>
                        </div>
                           { /*Table rows*/}
                        <div className="divide-y">
                            {products.map(product => (
                                <div key={product._id}
                                     className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition"
                                    >
                                    <div className="col-span-5 flex items-center gap-3">
                                        <img src={product.image?.[0]?.url || 'https://placehold.co/48x48/e3e3e3/666666?text=?'}
                                            alt={product.name}
                                            className="w-12 h-12 rounded-xl object-cover border flex-shrink-0"/>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-800 truncate">{product.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{product.category?.name}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-2 text-center">
                                        <p className="font-semibold text-gray-800">{product.finalPrice}</p>
                                        {product.discount > 0 && (
                                            <p className="text-xs text-gray-400 line-through">{product.price}</p>
                                        )}
                                    </div>

                                    <div className="col-span-2 text-center">
                                        <span className={`font-semibold ${
                                            product.stock === 0
                                                ? 'text-red-500'
                                                : product.stock <= 5
                                                ? 'text-orange-500'
                                                : 'text-green-600'
                                            }`}>{product.stock}</span>
                                    </div>

                                    <div className="col-span-1 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            product.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : product.status === 'draft'
                                                ? 'bg-gray-100 text-gray-500'
                                                : 'bg-red-100 text-red-500'
                                            }`}>{product.status}</span>
                                    </div>

                                    <div className="col-span-2 flex items-center justify-center gap-2">
                                        <Link to={`/seller/products/edit/${product._id}`}
                                            className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
                                            >Edit </Link>
                                        <button onClick={() => handleDelete(product._id)}
                                            disabled={deletingId === product._id}
                                            className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                                                >{deletingId === product._id ? '...' : 'Delete'}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default SellerProducts