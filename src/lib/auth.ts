// Auth mockada apenas no frontend.
// Troque por chamada real quando o backend expuser login.
const KEY = "auth.admin";

export const auth = {
  isAuthenticated() {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(KEY) === "1";
  },
  login(user: string, pass: string) {
    if (user === "admin" && pass === "admin") {
      localStorage.setItem(KEY, "1");
      return true;
    }
    return false;
  },
  logout() {
    localStorage.removeItem(KEY);
  },
};