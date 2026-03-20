import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../api/sellerAPI";
import { fetchCategories } from "../../api/categoryAPI";
import toast from "react-hot-toast";

const initialState = {
    name: '',
    description: '',
    price: '',
    discount: 0,
    stock: '',
    brand: '',
    category: '',
    subcategory: '',
    status: 'active',
    specification: ''
}

const AddProduct = () => {
    const navigate = useNavigate()
    const [formData, setFormDate] = useState(initialState)
    const [images, setImages] = useState([])
    const [previews, setPreviews] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchCategories()
            .then(({data}) => setCategories(data.categories || []))
            .catch(console.error)
    }, [])

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormDate(prev => ({...prev, [name] : value }))
    }
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        if(files.length > 5) {
            toast.error("Maximum 5 images allowed")
            return
        }
        setImages(files)

        const readers = files.map(file => {
            return new Promise(resolve => {
                const reader = new FileReader()
                reader.onload = (e) => resolve(e.target.result)
                reader.readAsDataURL(file)
            })
        })
         Promise.all(readers).then(setPreviews)
     }


      const validate = () => {
    if (!formData.name.trim()) return 'Product name is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.price || Number(formData.price) <= 0) return 'Valid price is required';
    if (!formData.stock || Number(formData.stock) < 0) return 'Valid stock is required';
    if (!formData.category) return 'Category is required';
    return null;
  };

    const handleSubmit = async(e) => {
        e.preventDefault()
        const validationError = validate()
        if(validationError) {
            toast.error(validationError)
            return
        }
        
        setLoading(true)
        try {
            const form = new FormData()
            Object.entries(formData).forEach(([Key, value]) => {
                if(value !== '') form.append(Key, value)
            })
        images.forEach(img => form.append('images', img))

        await createProduct(form)
        toast.success("Product created successfully")
            navigate('/seller/products')
        } catch(error) {
            toast.error(error?.response?.data?.message || 'Failed to create Product' )
        } finally {
            setLoading(false)
        }
    }

    const topCategories = categories.filter(c => !c.parent)
    const subcategories = categories.filter(
        c => c.parent?._id === formData.category || c.parent === formData.category
    )

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-3xl mx-auto px-4">

                <div className="mb-8">
                    <button onClick={() => navigate('/seller/products')}
                        className="text-sm text-indigo-600 hover:underline mb-2 block"> Back to Products </button>
                    <h1 className="text-3xl font-bold text-gray-800">Add New Product </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Basic Information </h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1"> Product Name  *</label>
                            <input type="text" name="name" value={formData.name}
                            onChange={handleChange} placeholder="e.g Sony WH-1000XM5 Headphones"
                            className=" w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1"> Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange}
                            placeholder="Describe your product details..." 
                            rows={4} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"/>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1"> Brand</label>
                            <input type="text" name="brand" value={formData.brand}
                            onChange={handleChange} placeholder="e.g. Sony, Apple, Nike etc"
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                             />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Pricing & Stock </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1"> Price *</label>
                                <input type="number" name="price" value={formData.price}
                                onChange={handleChange} min='0' placeholder="0"
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1"> Discount (%)</label>
                                <input type="number" name="discount" value={formData.discount} 
                                onChange={handleChange} min='0' max='100' placeholder="0"
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                            </div>
                        </div>

                        {formData.price > 0 && (
                            <div className="p-3 bg-indigo-50 rounded-xl text-sm">
                                <span className="text-gray-600">Final Price </span>
                                <span className="font-bold text-indigo-600">{(formData.price - (formData.price* formData.discount/100)).toFixed(2)}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1"> Stock *</label>
                                <input type="number" name="stock" value={formData.stock}
                                onChange={handleChange} min='0' placeholder="0"
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none">
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Category</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1"> Category *</label>
                                <select name="category" value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none">
                                    <option value="">Select Category </option>
                                    {topCategories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1"> Subcategory </label>
                                <select name="subcategory" value={formData.subcategory}
                                onChange={handleChange} 
                                disabled={!formData.category || subcategories.length === 0}
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400">
                                    <option value="">Select Subcategory </option>
                                    {subcategories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Product Images </h2>
                        <p className="text-sm text-gray-500 mb-3">Upload upto 5 images(JPEG, PNG, WEBP)</p>

                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition">
                            <span className="text-3xl mb-1">Images </span>
                            <span className="text-sm text-gray-500">Click to upload Images </span>
                            <input type="file" multiple accept="image/*"
                            onChange={handleImageChange} className="hidden" />
                        </label>

                        {previews.length > 0 && (
                            <div className="flex gap-3 mt-4 flex-wrap">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative">
                                        <img src={src} alt={`Preview ${i+1}`}
                                        className="w-20 h-20 rounded-xl object-cover border" />
                                        {i === 0 && (
                                            <span className="absolute -top-1 -left-1 bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">Main </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Specification (Optional)</h2>
                        <p className="text-sm text-gray-500 mb-3">Enter as JSON format</p>
                        <textarea name="specification" value={formData.specification} onChange={handleChange}
                        placeholder={`{"Color": "Black", "Weight": "250g", "Warranty": "1 year"}`}
                        rows={3} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none font-mono text-sm" />
                    </div>

                    <div className="flex gap-4">
                        <button type="button" onClick={() => navigate('/seller/products')}
                            className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                            >Cancel</button>
                        <button type="submit" disabled={loading}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                          >{loading ? 'Creating Product...' : 'Create Product'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProduct