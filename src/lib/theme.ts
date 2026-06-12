const KEY = "theme";

export function getTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem(KEY) as "light" | "dark") || "light";
}

export function applyTheme(t: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", t === "dark");
  localStorage.setItem(KEY, t);
}

export function toggleTheme() {
  applyTheme(getTheme() === "dark" ? "light" : "dark");
}