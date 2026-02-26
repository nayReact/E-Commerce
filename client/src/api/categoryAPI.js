import API from "./axios";

export const fetchCategories =() => 
    API.get('/categories')
export const fetchCategory= (id) => 
    API.get(`/categories/${id}`)