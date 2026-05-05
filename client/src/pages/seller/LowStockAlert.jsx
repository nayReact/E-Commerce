import { Link } from "react-router-dom";

const LOW_STOCK_THRESHOLD = 5

const LowStockAlert = ({ products }) => {
    const lowStockProducts = products.filter(
        p => p.stock <= LOW_STOCK_THRESHOLD && p.stock > 0 && p.isActive
    )

    const outOfStockProducts = products.filter(
        p => p.stock === 0 && p.isActive
    )

    if(lowStockProducts.LENGTH === 0 && outOfStockProducts.length === 0) {
        return null
    }

    return (
        <div className="space-y-3 mb-8">
            {outOfStockProducts.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl"> 🚨</span>
                        <div className="flex-1">
                            <h3 className="font-bold text-red-700 mb-1">
                                {outOfStockProducts.length} Product{outOfStockProducts.length > 1 ? 'S' : ''} out of stock
                            </h3>
                            <p className="text-sm text-red-600 mb-3">
                                These products are hidden from customers. Restock immediately to resume salaes. 
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {outOfStockProducts.map(product => (
                                    <Link key={product._id}
                                        to={`/seller/products/edit/${product._id}`}
                                        className="flex items-center gap-2 bg-white border border-red-200 rounded-xl px-3 py-2 text-sm hover:border-red-400 transition">
                                        <img
                                            src={product.image?.[0]?.url || 'https://placehold.co/32x32/e3e3e3/666?text=?'}
                                            alt={product.name}
                                            className="w-6 h-6 rounded-lg object-cover"
                                        />
                                        <span className="font-medium text-gray-800 max-w-[120px] truncate">
                                            {product.name}
                                        </span>
                                        <span className="text-red-500 font-bold text-xs">
                                            0 left
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* low stock warning */}
            {lowStockProducts.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                    <div  className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div className="flex-1">
                            <h3 className="font-bold text-yellow-700 mb-1">
                                {lowStockProducts.length} Product{lowStockProducts.length > 1 ? 's' : ''} Running Low 
                            </h3>
                            <p className="text-sm text-yellow-600 mb-3">
                                These products have {LOW_STOCK_THRESHOLD} or fewer units left. Restock soon to avoid losing sales.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {lowStockProducts.map(product => (
                                    <Link  key={product._id}
                                        to={`/seller/products/edit/${product._id}`}
                                        className="flex items-center gap-2 bg-white border border-yellow-200 rounded-xl px-3 py-2 text-sm hover:border-yellow-400 transition">
                                        <img
                                            src={product.image?.[0]?.url || 'https://placehold.co/32x32/e3e3e3/666?text=?'}
                                            alt={product.name}
                                            className="w-6 h-6 rounded-lg object-cover"
                                        />
                                        <span className="font-medium text-gray-800 max-w-[120px] truncate">
                                            {product.name}
                                        </span>
                                        <span className="text-orange-500 font-bold text-xs">
                                            {product.stock} left
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LowStockAlert