
import { useEffect, useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {updateProduct} from '../../api/sellerAPI'
import { fetchProduct} from '../../api/productAPI'
import { fetchCategories} from '../../api/categoryAPI'
import toast from 'react-hot-toast'

const EditProduct = () => {

    const {id} = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discount: 0,
        stock: '',
        brand: '',
        category: '',
        subcategory: '',
        status: 'active',
        specifications: ''
    })
    const [images, setImages] = useState([])
    const [previews, setPreviews] = useState([])
    const [existingImages, setExistingImages] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [ saving, setSaving] = useState(false)

    useEffect(() => {
        const load = async() => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    fetchProduct(id),
                    fetchCategories()
                ])
                const p = prodRes.data.product
                setFormData({
                    name: p.name || '',
                    description: p.description || '',
                    price: p.price || '',
                    discount: p.discount || 0,
                    stock: p.stock || '',
                    brand: p.brand || '',
                    category: p.category?._id || '',
                    subcategory: p.subcategory?._id || '',
                    status: p.status || '',
                    specifications: p.specifications ? JSON.stringify(Object.fromEntries(p.specifications)) : ''
                })
                setExistingImages(p.image || [])
                setCategories(catRes.data.categories || [])
            } catch(error) {
                console.log('Edit load error:', error)
                 console.log('Response:', error?.response?.data)
                toast.error("Failed to load product")
                navigate('/seller/products')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id, navigate])

    const handleChange = (e) => {
        const {name, value } = e.target
        setFormData(prev => ({...prev, [name] : value}))
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        if(files.length > 5) {
            toast.error("Maximum 5 images allowed")
            return 
        }
        setImages(files) 
        const newPreviews = []
        files.forEach((file, i)=>{
            const reader = new FileReader()
            reader.onloadend = () => {
                newPreviews[i] = reader.result 
                if(newPreviews.filter(Boolean).length === files.length) {
                    setPreviews([...newPreviews])
                }
            }
            reader.readAsDataURL(file)
        })   
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!formData.name.trim()) {
            toast.error('Product name is required')
            return
        }
        setSaving(true)
        try {
            const form = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                if(value !== '') form.append(key, value)
            })
        images.forEach(img => form.append('images', img ))

        await updateProduct(id, form)
        toast.success('Product updated successfully! ')
        navigate('/seller/products')
        } catch(error){
            console.log('Edit load error:', error)
                 console.log('Response:', error?.response?.data)
            toast.error(error?.response?.data?.message || "Failed to update product")
        } finally {
            setSaving(false)
        }
    }

    const topCategories = categories.filter(c => !c.parent)
    const subCategories = categories.filter(
        c => c.parent?._id === formData.category || c.parent === formData.category
    )

    if(loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-3xl mx-auto px-4">
                
                <div className="mb-8">
                    <button onClick={() => navigate('/seller/products')}
                        className='text-sm text-indigo-600 hover:underline mb-2 block'>Back to Products </button>
                    <h1 className="text-3xl font-bold text-gray-800">Edit Products </h1>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>

                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Basic Information </h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Product Name *</label>
                            <input type="text"  name="name" value={formData.name}
                                onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                            <textarea name="description" value={formData.description}
                                onChange={handleChange} rows={4}
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Brand</label>
                            <input type="text" name="brand" value={formData.brand}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"/>
                        </div>
                        
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Pricing & Stock</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Price *</label>
                                <input type="number" name='price' value={formData.price}
                                onChange={handleChange} min='0'
                                className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none'/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Discount</label>
                                <input type="number" name='discount' value={formData.discount}
                                onChange={handleChange} min='0' max='100'
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"  />
                            </div>
                        </div>

                        {formData.price > 0 && (
                            <div className="p-3 bg-indigo-50 rounded-xl text-sm">
                                <span className="text-gray-600">Final Price: </span>
                                <span className="font-bold text-indigo-600">{(formData.price - (formData.price * formData.discount / 100)).toFixed(2)}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Stock *</label>
                                <input type="number" name="stock" value={formData.stock}
                                onChange={handleChange} min= '0'
                                className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none'/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1"> Status</label>
                                <select name="status" value={formData.status} onChange={handleChange}
                                     className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none">
                                    <option value="active"> Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Category</h2>
                        <div  className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                                <select name="category" value={formData.category} onChange={handleChange}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none" >
                                    <option value="">Select Category</option>
                                    {topCategories.map(cat => (
                                        <option key={cat._id} value ={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Subcategory</label>
                                <select name="subcategory" value={formData.subcategory} onChange={handleChange} 
                                disabled={!formData.category || subCategories.length === 0}
                                 className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400">
                                    <option value="">Select Subcategory</option>
                                    {subCategories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Product Images </h2>

                        {existingImages.length > 0 && previews.length === 0 && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2">Current Images</p>
                                <div className="flex gap-3 flex-wrap">
                                    {existingImages.map((img, i) => (
                                        <div  key={i} className="relative">
                                            <img src={img.url} alt={`Product ${i + 1}`}
                                                className="w-20 h-20 rounded-xl object-cover border" />
                                            {i === 0 && (
                                                <span className="absolute -top-1 -left-1 bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">Main</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition">
                            <span className="text-2xl mb-1">Photos</span>
                            <span className="text-sm text-gray-500">{existingImages.length > 0 ? 'Click to replace images' : 'click to upload images'}</span>
                            <input type="file" multiple accept="image/*"
                                onChange={handleImageChange} className="hidden" />
                        </label>

                        {previews.length > 0 && (
                            <div  className="flex gap-3 mt-4 flex-wrap">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative">
                                        <img src={src} alt={`Preview ${i+1}`}
                                         className='w-20 h-20 rounded-xl object-cover border' />
                                        {i === 0 && (
                                            <span className="absolute -top-1 -left-1 bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">Main</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Specifications</h2>
                        <textarea name="specifications" value={formData.specifications}
                            onChange={handleChange}
                            placeholder={`{"Color": "Black", "Weight": "250g"}`}
                            rows={3}
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none font-mono text-sm" />
                    </div>

                    <div className="flex gap-4">
                        <button type="button" onClick={() => navigate('/seller/products')}
                             className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                             >Cancel</button>
                        <button type='submit' disabled={saving}
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                            >{saving ? 'Saving' : 'save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProduct