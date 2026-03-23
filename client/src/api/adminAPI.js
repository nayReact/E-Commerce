import API from './axios'

export const fetchAllOrders = () => API.get('/orders')
export const fetchAllUsers = () => API.get('/admin/users')
export const updateUserStatus = (id, data) => API.put(`/admin/users/${id}`, data)
export const fetchAllCategories = () => API.get('/categories')
export const createCategory = (data) => API.post('/categories', data)
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data)
export const deleteCategory = (id) => API.delete(`/categories/${id}`)