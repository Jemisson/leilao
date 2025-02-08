import axios from "axios"
import Cookies from "js-cookie"
import { ProfileUser } from "../types";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  }
})

api.interceptors.request.use((config) => {
  const token = Cookies.get("leilao_jwt_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

const authApi = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
})

export const login = async (email: string, password: string) => {
  const response = await authApi.post("/login", {
    user: { email, password },
  });
  return response.data;
}

export const fetchCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
}

export const fetchProducts = async (
  page: number,
  categoryId: string | null = null,
  auctioned: number
) => {
  const url = categoryId
  ? `/products?page=${page}&category_id=${categoryId}&auctioned=${auctioned}`
  : `/products?page=${page}&auctioned=${auctioned}`;
  
  const response = await api.get(url);
  return response.data;
}

export const logout = () => {
  Cookies.remove("leilao_jwt_token");
}

export const deleteProduct = async (productId: number) => {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    throw error;
  }
}

export const createProduct = async (productData: FormData) => {
  const response = await api.post("/products", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export const updateProduct = async (productId: number, formData: FormData) => {
  try {
    const response = await api.put(`/products/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
}

export const soldProduct = async (id: number) => {
  const response = await api.patch(`products/${id}/mark_as_sold`);
  return response.data;
}

export const fetchProductById = async (productId: number) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
}

export const fetchBids = async (page: number) => {
  const response = await api.get(`/bids?page=${page}`);
  return response.data;
}

export const fetchBidsById = async (productId: number, page: number) => {
  const response = await api.get(`/bids?product_id=${productId}&page=${page}`);
  return response.data;
}

export const deleteImage = async (id: number, imageId: string) => {
  try {
    const response = await api.delete(`/products/${id}/images/${imageId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao excluir imagem:", error);
    throw error;
  }
}

export const createBid = async (productId: number, value: number, profileUserId: number) => {
  try {
    const response = await api.post("/bids", {
      product_id: productId,
      value,
      profile_user_id: profileUserId,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao efetuar lance:", error);
    throw error;
  }
}

export const fetchUsers = async (page: number = 1) => {
  try {
    const response = await api.get(`/profile_users?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
}

export const fetchUserById = async (userId: number) => {
  const response = await api.get(`/profile_users/${userId}`);
  return response.data;
}

export const createUser = async (profileUser: ProfileUser) => {
  try {
    const response = await api.post("/profile_users", {
      profile_user: profileUser,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
}
