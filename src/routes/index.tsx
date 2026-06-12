import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { CalendarCheck, Clock, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atelier — Agendamento online" },
      { name: "description", content: "Reserve seu horário em poucos cliques com nossos profissionais." },
      { property: "og:title", content: "Atelier — Agendamento online" },
      { property: "og:description", content: "Reserve seu horário em poucos cliques com nossos profissionais." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Agendamento simples e elegante
            </span>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">
              Reserve seu horário em <span className="text-primary">poucos cliques</span>.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Escolha o serviço, o profissional e o melhor horário. Confirmação imediata, sem complicação.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/agendar">Agendar agora</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Área do profissional</Link>
              </Button>
            </div>
          </div>

          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {[
              { icon: CalendarCheck, title: "Reserva instantânea", desc: "Veja horários disponíveis em tempo real." },
              { icon: Clock, title: "Sem espera", desc: "Confirme em segundos e receba lembrete." },
              { icon: Sparkles, title: "Experiência cuidada", desc: "Atendimento personalizado do início ao fim." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
