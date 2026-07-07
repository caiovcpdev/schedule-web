// src/routes/login.tsx
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(1, "Senha obrigatória"),
});

type FormData = z.infer<typeof schema>;

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — ScheduleAPI" }] }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      await auth.login(data.email, data.senha);
      router.navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Credenciais inválidas");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Acesso administrativo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entre com seu email e senha.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            autoFocus
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Senha</Label>
          <Input
            type="password"
            {...register("senha")}
          />
          {errors.senha && (
            <p className="text-xs text-destructive">{errors.senha.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}