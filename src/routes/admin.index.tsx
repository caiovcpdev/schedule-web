import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Users, Scissors, UserCog } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { agendamentosApi } from "@/lib/api/agendamentos";
import { clientesApi } from "@/lib/api/clientes";
import { profissionaisApi } from "@/lib/api/profissionais";
import { servicosApi } from "@/lib/api/servicos";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const agendamentos = useQuery({ queryKey: ["agendamentos"], queryFn: agendamentosApi.listar });
  const clientes = useQuery({ queryKey: ["clientes"], queryFn: clientesApi.listar });
  const profissionais = useQuery({ queryKey: ["profissionais"], queryFn: profissionaisApi.listar });
  const servicos = useQuery({ queryKey: ["servicos"], queryFn: servicosApi.listar });

  const cards = [
    { label: "Agendamentos", value: agendamentos.data?.length ?? "—", icon: CalendarDays },
    { label: "Clientes", value: clientes.data?.length ?? "—", icon: Users },
    { label: "Profissionais", value: profissionais.data?.length ?? "—", icon: UserCog },
    { label: "Serviços", value: servicos.data?.length ?? "—", icon: Scissors },
  ];

  return (
    <>
      <PageHeader title="Visão geral" description="Resumo do seu atelier." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
          </div>
        ))}
      </div>
    </>
  );
}