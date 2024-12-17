import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
})

export const fetchCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
}

export const fetchProducts = async (
  page: number,
  categoryId: string | null = null
) => {
  const url = categoryId
    ? `/products?page=${page}&category_id=${categoryId}`
    : `/products?page=${page}`;

  const response = await api.get(url);
  return response.data;
};
