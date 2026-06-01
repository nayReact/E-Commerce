import API from './axios'

export const getWishlist = () => API.get('/wishlist')
export const addToWishlist = (productId) => API.post('/wishlist', { productId })
export const removeFromWishlist = (productId) => API.delete(`/wishlist/${productId}`)
export const checkWishlist = (productId) => API.get(`/wishlist/check/${productId}`)
export const clearWishlist = () => API.delete('/wishlist/clear')
