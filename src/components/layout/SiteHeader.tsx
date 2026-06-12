import { Link } from "@tanstack/react-router";
import { Calendar, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { applyTheme, getTheme, toggleTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const t = getTheme();
    applyTheme(t);
    setTheme(t);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Atelier</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
            activeOptions={{ exact: true }}
          >
            Início
          </Link>
          <Link
            to="/agendar"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            activeProps={{ className: "text-foreground font-medium" }}
          >
            Agendar
          </Link>
          <Link
            to="/login"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Admin
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toggleTheme();
              setTheme(getTheme());
            }}
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </nav>
      </div>
    </header>
  );
}