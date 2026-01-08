import axios from "axios";

const API_BASE_URL = "https://localhost:7200/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor per aggiungere il token JWT a ogni richiesta
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor per gestire errori di autenticazione
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
};

// Animals API
export const animalsAPI = {
  getAll: async () => {
    const response = await api.get("/animals");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/animals/${id}`);
    return response.data;
  },
  create: async (animalData) => {
    const response = await api.post("/animals", animalData);
    return response.data;
  },
  update: async (id, animalData) => {
    const response = await api.put(`/animals/${id}`, animalData);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/animals/${id}`);
  },
  getByMicrochip: async (microchipNumber) => {
    const response = await api.get(`/animals/microchip/${microchipNumber}`);
    return response.data;
  },
};

// Visits API
export const visitsAPI = {
  getAll: async () => {
    const response = await api.get("/visits");
    return response.data;
  },
  getAnimalHistory: async (animalId) => {
    const response = await api.get(`/visits/animal/${animalId}/history`);
    return response.data;
  },
  create: async (visitData) => {
    const response = await api.post("/visits", visitData);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async () => {
    const response = await api.get("/products");
    return response.data;
  },
  getMedicines: async () => {
    const response = await api.get("/products/medicines");
    return response.data;
  },
  getFood: async () => {
    const response = await api.get("/products/food");
    return response.data;
  },
};

export default api;
