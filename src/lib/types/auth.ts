export interface LoginRequest {
    email: string;
    senha: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    nome: string;
    email: string;
    role: "Admin" | "Profissional" | "Cliente";
}

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
}

export interface UsuarioAutenticado {
    nome: string;
    email: string;
    role: "Admin" | "Profissional" | "Cliente";
}