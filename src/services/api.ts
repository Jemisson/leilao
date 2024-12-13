import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
})

export const fetchCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
}

export const fetchProducts = async (page: number) => {
  const response = await api.get(`/products?page=${page}`);
  return response.data;
}
