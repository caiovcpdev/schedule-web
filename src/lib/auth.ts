import { authApi } from "./api/authApi";
import { UsuarioAutenticado } from "./types/auth";

const KEYS = {
    accessToken: "auth.accessToken",
    refreshToken: "auth.refreshToken",
    usuario: "auth.usuario",
} as const;

export const auth = {
    // ── Leitura ──────────────────────────────────────────
    getAccessToken(): string | null {
        return localStorage.getItem(KEYS.accessToken);
    },

    getRefreshToken(): string | null {
        return localStorage.getItem(KEYS.refreshToken);
    },

    getUsuario(): UsuarioAutenticado | null {
        const raw = localStorage.getItem(KEYS.usuario);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as UsuarioAutenticado;
        } catch { return null;}
    },

    isAuthenticated(): boolean {
        return !!this.getAccessToken();
    },

    isAdmin(): boolean {
        return this.getUsuario()?.role === "Admin";
    },


    // ── Escrita ──────────────────────────────────────────
    async login (email: string, senha: string): Promise<void>  {
        const resposta = await authApi.login({ email, senha });
        
        localStorage.setItem(KEYS.accessToken, resposta.accessToken);
        localStorage.setItem(KEYS.refreshToken, resposta.refreshToken);
        localStorage.setItem(
            KEYS.usuario, 
            JSON.stringify({
                nome: resposta.nome,
                email: resposta.email,
                role: resposta.role,
            })
        );
    },

    async logout(): Promise<void> {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
            await authApi.logout(refreshToken).catch(() => {});
        }

        localStorage.removeItem(KEYS.accessToken);
        localStorage.removeItem(KEYS.refreshToken);
        localStorage.removeItem(KEYS.usuario);
    },

    async renovarToken(): Promise<string | void> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return;

        try{
            const resposta = await authApi.refresh(refreshToken);
            localStorage.setItem(KEYS.accessToken, resposta.accessToken);
            localStorage.setItem(KEYS.refreshToken, resposta.refreshToken);
            return resposta.accessToken;
        } catch {
            // refresh token expirado ou revogado — força logout
            this.logout();
            return; 
        }
    }
};