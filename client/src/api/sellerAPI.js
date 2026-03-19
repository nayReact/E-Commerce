import API from "./axios";

export const fetchSellerProducts = () => API.get('/products/seller/me')
export const fetchSellerOrders = () => API.get('/orders/seller/me')
export const createProduct = (data) => API.post('/products', data,{
    headers: {'Content-Type' : 'multipart/form-data'}
})
export const updateProduct = (id, data) => API.put(`/products/${id}`, data, {
    headers: {'Content-Type': 'multipart/form-data' }
} )
export const deleteProduct = (id) => API.delete(`/products/${id}`)
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data)