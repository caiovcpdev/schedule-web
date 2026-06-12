import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { profissionaisApi } from "@/lib/api/profissionais";
import { servicosApi } from "@/lib/api/servicos";
import { clientesApi } from "@/lib/api/clientes";
import { agendamentosApi } from "@/lib/api/agendamentos";

export const Route = createFileRoute("/agendar")({
  head: () => ({
    meta: [
      { title: "Agendar — Atelier" },
      { name: "description", content: "Escolha serviço, profissional e horário." },
    ],
  }),
  component: AgendarPage,
});

function AgendarPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servicoId, setServicoId] = useState("");
  const [profissionalId, setProfissionalId] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [observacao, setObservacao] = useState("");

  const servicos = useQuery({ queryKey: ["servicos"], queryFn: servicosApi.listar });
  const profissionais = useQuery({
    queryKey: ["profissionais"],
    queryFn: profissionaisApi.listar,
  });

  const criar = useMutation({
    mutationFn: async () => {
      const cliente = await clientesApi.criar({ nome, email, telefone });
      return agendamentosApi.criar({
        clienteId: cliente.id,
        profissionalId,
        servicoId,
        dataHoraInicio: new Date(dataHora).toISOString(),
        observacao: observacao || undefined,
      });
    },
    onSuccess: () => {
      toast.success("Agendamento solicitado!", {
        description: "Você receberá a confirmação em breve.",
      });
      router.navigate({ to: "/" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const disabled =
    !nome || !email || !telefone || !servicoId || !profissionalId || !dataHora;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Novo agendamento</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Preencha seus dados e escolha o melhor horário.
        </p>

        <form
          className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            criar.mutate();
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome completo">
              <Input value={nome} onChange={(e) => setNome(e.target.value)} required />
            </Field>
            <Field label="Telefone">
              <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
            </Field>
          </div>
          <Field label="E-mail">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Serviço">
              <Select value={servicoId} onValueChange={setServicoId}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {servicos.data?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nome} — {s.duracaoEmMinutos}min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Profissional">
              <Select value={profissionalId} onValueChange={setProfissionalId}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {profissionais.data?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome} — {p.especialidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Data e hora">
            <Input
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
              required
            />
          </Field>

          <Field label="Observação (opcional)">
            <Textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} />
          </Field>

          <Button type="submit" className="w-full" size="lg" disabled={disabled || criar.isPending}>
            {criar.isPending ? "Enviando..." : "Confirmar agendamento"}
          </Button>
        </form>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}