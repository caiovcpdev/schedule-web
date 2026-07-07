import axios from "axios";
import { auth } from "../auth";

// Cliente HTTP central. Troque a URL via VITE_API_URL no .env
export const http = axios.create({
  baseURL: "https://localhost:7135",
  headers: { "Content-Type": "application/json" },
});


//Injeta o access token no header Authorization de todas as requisições
http.interceptors.request.use((config) => {
  const token = auth.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Tratamento de erros globais. Se o access token estiver expirado, tenta renovar com o refresh token
http.interceptors.response.use(
  (r) => r,
  (error) => {
    const original = error.config;
    if (error?.response?.status === 401 && !original._retry) {
      original._retry = true;
    

      const novoToken = auth.renovarToken();
      if (novoToken) {
          original.headers.Authorization = `Bearer ${novoToken}`;
          return http(original);
      }

      window.location.href = "/login";
      return Promise.reject(new Error("Sessão expirada. Faça login novamente."));
    }
    
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.title ||
      error?.message ||
      "Erro inesperado";
    return Promise.reject(new Error(msg));
  },
);