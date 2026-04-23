import API from './axios'

export const getProductReviews = (productId, params) =>
    API.get(`/reviews/product/${productId}`, { params })

export const createReview = (data) => API.post('/reviews', data)
export const deleteReview = (id) => API.delete(`/reviews/${id}`)
export const checkCanReview = (productId) =>
    API.get(`/reviews/can-review/${productId}`)