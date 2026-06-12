import axios from "axios";

// Cliente HTTP central. Troque a URL via VITE_API_URL no .env
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "https://localhost:7135",
  headers: { "Content-Type": "application/json" },
});

http.interceptors.response.use(
  (r) => r,
  (error) => {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.title ||
      error?.message ||
      "Erro inesperado";
    return Promise.reject(new Error(msg));
  },
);