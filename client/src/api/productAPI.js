import API from "./axios";

export const fetchProducts = (params) => 
    API.get('/products', {params}) 
export const fetchProduct = (id) => 
    API.get(`/products/${id}`)
export const fetchSellerProducts = () =>
    API.get('/products/seller/me')
export const createProduct = (data) =>
    API.post('/products', data)
export const updateProduct = (id, data) => 
    API.put(`/products/${id}`, data)
export const deleteProduct = (id) => 
    API.delete(`/products/${id}`)
