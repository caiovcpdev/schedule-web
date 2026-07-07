import { LoginRequest, LoginResponse, RefreshResponse } from "../types/auth";
import { http } from "./http";
import { authHttp } from "@/lib/api/authHttps";

const AUTH_URL = "http://localhost:7135/api/auth";

export const authApi = {
  login: (dto: LoginRequest) => authHttp.post<LoginResponse>("/api/auth/login", dto).then((r) => r.data),

  refresh: (refreshToken: string) => authHttp.post<RefreshResponse>("/api/auth/refresh", { refreshToken }).then((r) => r.data),

  logout: (refreshToken: string) => authHttp.post("/api/auth/logout", { refreshToken }).then((r) => r.data),

  alterarSenha: (dto: LoginRequest) => authHttp.post<LoginResponse>("/api/auth/muda-senha", dto).then((r) => r.data),
};