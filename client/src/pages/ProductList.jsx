import { useCallback, useEffect, useState } from "react"
import {fetchProducts} from '../api/productAPI'
import ProductFilters from "../components/product/ProductFilters"
import ProductGrid from '../components/product/ProductGrid'

const useDebounce = (value, delay) => {
    const [debounce, setDebounce] = useState(value)
    useEffect(() => {
        const timer = setTimeout(() =>{
            setDebounce(value), delay
        })
        return () => clearTimeout(timer)
    }, [value, delay])
    return debounce
}

const ProductList =() => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({page:1, pages:1, total: 0})
    const [filters, setfilters] = useState({
        search: '',
        category: "",
        minPrice: '',
        maxPrice: '',
        sort:'-createdAt',
        page: 1
    })

    const debouncedSearch = useDebounce(filters.search, 500)
    const activeFilters = {
        ...filters,
        search: debouncedSearch
    }

    const loadProducts = useCallback(async () => {
        setLoading(true)
        try{
            const cleanParams = Object.fromEntries(
                Object.entries(activeFilters).filter(([ , v]) => v !== '')
            )
            const {data} = await fetchProducts(cleanParams)
            setProducts(data.products)
            setPagination({
                 page: data.page, 
                 pages: data.page, 
                 total:data.total })
        } catch(error) {
            console.error("Failed to load Products", error)
        } finally{
            setLoading(false)
        }
    },[debouncedSearch, filters.category, filters.minPrice, filters.maxPrice, filters.sort, filters.page])

    useEffect(() => {
        loadProducts()
    }, [loadProducts])
    
    const handleFilterChange= (newFilters) => {
        setfilters(newFilters)
    }

    return(
        <div className="min-h-screen bg-grey-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800"> All Products </h1>
                    {!loading && (
                        <p className="text-gray-500 mt-1">{pagination.total} products found</p>
                    )}
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <ProductFilters filters={filters} onChange={handleFilterChange} />
                    </aside>

                    <div className="flex-1">
                        <ProductGrid products={products} loading={loading} />
                        {!loading && pagination.pages > 1 && (
                            <div className="flex-justify-center gap-2 mt-10">
                                <button disabled={filters.page=1} 
                                    onClick={() => setfilters(f => ({...f, page:f.page - 1}))}
                                    className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    > Prev </button>

                                {[...Array(pagination.pages)].map((_, i) => (
                                    <button key={i} 
                                        onClick={() => setfilters(f => ({...f, page:i+1}))}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                                                    filters.page === i + 1
                                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                                        : 'hover:bg-gray-100'
                                                    }`}>{i+1} </button>
                                    ))}

                                <button disabled={filters.page === pagination.pages}
                                onClick={() => setfilters(f => ({...f, page: f.page + 1}))}>
                                        Next </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 

export default ProductList
