import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — Admin" }] }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (auth.login(user, pass)) {
            router.navigate({ to: "/admin" });
          } else {
            toast.error("Credenciais inválidas");
          }
        }}
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Acesso administrativo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use <code className="rounded bg-muted px-1">admin</code> / <code className="rounded bg-muted px-1">admin</code>.
          </p>
        </div>
        <div className="space-y-2">
          <Label>Usuário</Label>
          <Input value={user} onChange={(e) => setUser(e.target.value)} autoFocus />
        </div>
        <div className="space-y-2">
          <Label>Senha</Label>
          <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        </div>
        <Button type="submit" className="w-full">Entrar</Button>
      </form>
    </div>
  );
}