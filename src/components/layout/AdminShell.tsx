import { Link, useRouter } from "@tanstack/react-router";
import {
  CalendarDays,
  Users,
  UserCog,
  Scissors,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

type NavItem = {
  to: "/admin" | "/admin/agendamentos" | "/admin/clientes" | "/admin/profissionais" | "/admin/servicos";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/agendamentos", label: "Agendamentos", icon: CalendarDays },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/profissionais", label: "Profissionais", icon: UserCog },
  { to: "/admin/servicos", label: "Serviços", icon: Scissors },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6 font-semibold">
          <span className="text-sidebar-primary">●</span> Atelier Admin
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: !!exact }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              activeProps={{
                className:
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm bg-sidebar-accent text-sidebar-foreground font-medium",
              }}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={() => {
              auth.logout();
              router.navigate({ to: "/login" });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}