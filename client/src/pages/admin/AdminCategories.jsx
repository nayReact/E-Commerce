import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createCategory, deleteCategory, fetchAllCategories, updateCategory } from "../../api/adminAPI";

const AdminCategories = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editiogCategory, setEditingCategory] = useState(null)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parent: ''
    })

    useEffect(() => {
        load()
    }, [])

    const load = async() => {
        try {
            const {data} = await fetchAllCategories()
            setCategories(data.categories || [])
        } catch(error) {
            toast.error('Failed to load categories')
        } finally {
            setLoading(false)
        }
    }

    const openAdd = () => {
        setEditingCategory(null)
        setFormData({
            name: '',
            description: '',
            parent: ''
        })
        setShowModal(true)
    }

    const openEdit = (cat) => {
        setEditingCategory(cat)
        setFormData({
            name: cat.name || '',
            description: cat.description || '',
            parent: cat.parent || ''
        })
        setShowModal(true)
    }

    const handleSave = async() => {
        if(!formData.name.trim()) {
            toast.error('Category name is required')
            return
        }
        setSaving(true)
        try {
            if(editiogCategory) {
                await updateCategory(editiogCategory._id, formData)
                toast.success('Category updated')
            } else {
                await createCategory(formData)
                toast.success('Category created')
            }
            setShowModal(false)
            load()
        } catch(error) {
            toast.error(error?.response?.data?.message || 'Failed to dave category')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async(id) => {
        if(!window.confirm('Delete this category'))
            return
        try {
            await deleteCategory(id)
            setCategories(prev => prev.filter(c => c._id !== id))
            toast.success('Category deleted')
        } catch(error){
            toast.error('failed to delete category')
        }
    }

    const topCategories = categories.filter(c => !c.parent)

    if(loading) {
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"  />
        </div>
    }


    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-4xl mx-auto px-4">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                        <p className="text-gray-500 mt-1">{categories.length} categories</p>
                    </div>
                    <button onClick={openAdd}
                         className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
                         >Add Category </button>
                </div>

                <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase">
                        <div className="col-span-1">Image</div>
                        <div className="col-span-3">Name</div>
                        <div className="col-span-3">Descriptionmage</div>
                        <div className="col-span-2">Parent</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1">Action</div>
                    </div>

                    <div className="divide-y">
                        {categories.map(cat => (
                            <div  key={cat._id}
                                 className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition">
                                <div  className="col-span-1">
                                    <img src={cat.image} alt={cat.name}
                                        className="w-10 h-10 rounded-lg object-cover border"  />
                                </div>
                                <div className="col-span-3">
                                    <p className="font-semibold text-gray-800">{cat.name}</p>
                                    <p className="text-xs text-gray-400">{cat.slug}</p>
                                </div>
                                <div className="col-span-3">
                                    <p className="text-sm text-gray-500 truncate">{cat.description || '-'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500">{cat.parent?.name || '-'}</p>
                                </div>
                                <div className="col-span-2 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'
                                    }`}>
                                        {cat.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="col-span-1 flex flex-col gap-1 items-center">
                                    <button onClick={() => openEdit(cat)}
                                      className="text-xs text-indigo-600 hover:underline" >Edit</button>
                                    <button onClick={() => handleDelete(cat._id)}
                                      className="text-xs text-red-500 hover:underline">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {categories.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            <p className="text-4xl mb-2">🏷️</p>
                            <p>No Categories yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/*Modal*/}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold text-gray-800 mb-5">{editiogCategory ? 'Edit Category' : 'Add Category'}</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Name *</label>
                                    <input type="text" value={formData.name}
                                    onChange={e => setFormData(p => ({ ...p, name: e.target.value}))}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                    placeholder="eg. Electronics" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                                    <textarea value={formData.description}
                                        onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                        rows={3}
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"
                                        placeholder="Optional description"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Parent Category </label>
                                    <select value={formData.parent}
                                        onChange={e => setFormData(p => ({ ...p, parent: e.target.value }))}
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none">
                                        <option value="">None (Top Level 1)</option>
                                        {topCategories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowModal(false)}
                                     className="flex-1 border border-gray-300 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                                <button onClick={handleSave} disabled={saving}
                                     className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-60">{saving ? 'saving...' : editiogCategory ? 'Save Changes' : 'Create'}</button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default AdminCategories