import { useEffect, useState } from "react";
import { fetchCategories } from '../../api/categoryAPI'

const ProductFilters = ({filters, onChange}) => {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetchCategories()
        .then(({data}) => {
            setCategories(data.categories)
        })
        .catch(console.error)
    }, [])

    return(
        <div className="bg-white rounded-xl shadow p-5 space-y-5 border border-grey-100">
            <h3 className="font-semibold text-grey-800 text-lg">
                Filters
            </h3>
            <div>
                <label className="text-sm font-medium text-grey-600 mb-1 block"> Search </label>
                <input type="text" value={filters.search} onChange={(e) => onChange({...filters, search:e.target.value, page:1})} 
                placeholder="Search Products" 
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"/>
            </div>
            <div>
                <label className="text-sm, font-medium text-grey-600 mb-1 block"> Category </label>
                <select value={filters.category} onChange={(e) => onChange({...filters, category: e.target.value, page:1})}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none">
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                </select>
            </div>

            <div>
                <label className="text-sm font-medium text-grey-600 mb-1 block">Price Range </label>
                <div className="flex-gap-2">
                    <input type="number" value={filters.minPrice} 
                    onChange = {(e) => onChange({...filters, minPrice:e.target.value, page: 1})}
                    placeholder="Min "
                    className="w-1/2 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" />

                    <input type="number" value={filters.maxPrice} onChange={(e) => onChange({...filters, maxPrice:e.target.value, page:1})}
                    placeholder="Max " className="w-1/2 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-grey-600 mb-1 block">Sort by</label>
                <select value={filters.sort} onChange={(e) => onChange({...filters, sort:e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none">
                        <option value="-createdAt"> Newest first</option>
                        <option value ="finalPrice"> Price: Low to High</option>
                        <option value="-finalPrice">Price: High to Low</option>
                        <option value="-rating">Top Rated</option>
                </select>
            </div>
            <button onClick={() => onChange({search: '', category: '', minPrice: '', maxPrice: '',sort: '-createdAt',page:1})}
                className="w-full text-sm text-indigo-600 hover:underline font:medium"> Clear Filters </button>
        </div>
    )
}

export default ProductFilters