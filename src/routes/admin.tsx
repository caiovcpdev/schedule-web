import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/layout/AdminShell";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Atelier" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  useEffect(() => {
    if (!auth.isAuthenticated()) router.navigate({ to: "/login" });
  }, [router]);

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}