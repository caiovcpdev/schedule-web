// src/routes/mudasenha.tsx
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/authApi";

const schema = z
  .object({
    email: z.string().email("Email inválido"),
    senha: z
      .string()
      .min(6, "A senha deve possuir pelo menos 6 caracteres"),
    confirmarSenha: z
      .string()
      .min(6, "Confirme sua senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type FormData = z.infer<typeof schema>;

export const Route = createFileRoute("/mudasenha")({
  head: () => ({
    meta: [{ title: "Alterar senha — ScheduleAPI" }],
  }),
  component: MudarSenhaPage,
});

function MudarSenhaPage() {
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
      // Chame aqui seu endpoint de alteração de senha
      await authApi.alterarSenha({
        email: data.email,
        senha: data.senha,
      });

      toast.success("Senha atualizada com sucesso!");

      router.navigate({ to: "/login" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Não foi possível atualizar a senha."
      );
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Alterar senha
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Informe seu e-mail e a nova senha.
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
            <p className="text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Nova senha</Label>
          <Input
            type="password"
            {...register("senha")}
          />

          {errors.senha && (
            <p className="text-xs text-destructive">
              {errors.senha.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Confirmar nova senha</Label>
          <Input
            type="password"
            {...register("confirmarSenha")}
          />

          {errors.confirmarSenha && (
            <p className="text-xs text-destructive">
              {errors.confirmarSenha.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Atualizando..." : "Atualizar senha"}
        </Button>
      </form>
    </div>
  );
}