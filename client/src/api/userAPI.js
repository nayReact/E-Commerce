import API from "./axios";

export const getProfile = () => API.get('/users/profile')
export const updateProfile = (data) => API.put('/users/profile', data)
export const addAddress = (data) => API.post('/users/profile/address', data)
export const updateAddress = (id, data) => API.put(`/users/profile/address/${id}`, data)
export const deleteAddress = (id) => API.delete(`/users/profile/address/${id}`)
export const setDefaultAddress = (id) => API.put(`/users/profile/address/${id}/default`)