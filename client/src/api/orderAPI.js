import API from "./axios";

export const fetchMyOrders = () => API.get('/orders/my-orders', {
    headers: { 'Cache-control' : 'no-cache'}
})
export const fetchMyOrder = (id) => API.get(`/orders/${id}`, {
    headers: {'cache-Control' : 'no-cache'}
})
export const fetchOrder = (id) => API.get(`/orders/${id}`)
export const cancelOrder = (id, reason) => API.put(`/orders/${id}/cancel`, {reason})