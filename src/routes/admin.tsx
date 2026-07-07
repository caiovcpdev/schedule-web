import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/layout/AdminShell";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — ScheduleAPI" }] }),

  beforeLoad: () => {
    if (!auth.isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },

  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}