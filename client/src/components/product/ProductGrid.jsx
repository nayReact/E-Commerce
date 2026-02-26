import { memo } from "react";
import ProductCard from "./ProductCard";

const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded=xl shadow-md animate-pulse overflow-hidden">  
         <div className="h-52 bg-grey-200" />
            <div className="p-4 space-y-3" > 
                <div className="h-3 bg-grey-200 rounded w-1/3" />
                <div className="h-4 bg-grey-200 rounded w-3/4" />
                <div className="h-4 bg-grey-200 rounded w-1/2" />
                <div className="h-10 bg-grey-200 rounded-lg" />
         </div>
        </div>
    )
}

const ProductGrid = ({products=[], loading=false, error = null }) => {
    if(loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({length: 8}).map((_, i) =>  (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        )
    }
    if(error) {
        return(
            <div className="text-center py-20">
                <p className="text-xl font-semibold text-red-500">Failed to load products</p>
                <p className="text-sm text-grey-500 mt-2">Please try again later</p>
            </div>
        )
    }
    if(!products.length) {
        return (
            <div className="text-center py-20 text-grey-400">
                <p className="text-xl font-semibold">No products found</p>
                <p className="text-sm mt-2"> Try adjusting your filters</p>
            </div>
        )
    }
        return(
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        )
       
}

export default memo(ProductGrid)