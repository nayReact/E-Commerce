import API from './axios'

export const requestReturn = (orderId, data) => 
    API.post(`/returns/${orderId}`, data)

export const updateReturnStatus = (orderId, data) => 
    API.put(`/returns/${orderId}`, data)

export const getReturnRequests = () => 
    API.get(`/returns`)

