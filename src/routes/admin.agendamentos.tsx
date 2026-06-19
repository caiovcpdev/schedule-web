import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { agendamentosApi } from "@/lib/api/agendamentos";

export const Route = createFileRoute("/admin/agendamentos")({
  component: AgendamentosPage,
});

function AgendamentosPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["agendamentos"],
    queryFn: agendamentosApi.listar,
  });

  console.log(data);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["agendamentos"] });

  const confirmar = useMutation({
    mutationFn: agendamentosApi.confirmar,
    onSuccess: () => { toast.success("Agendamento confirmado"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const cancelar = useMutation({
    mutationFn: agendamentosApi.cancelar,
    onSuccess: () => { toast.success("Agendamento cancelado"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <PageHeader title="Agendamentos" description="Confirme ou cancele as reservas." />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/hora</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Profissional</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Carregando...</TableCell></TableRow>
            )}
            {data?.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Nenhum agendamento.</TableCell></TableRow>
            )}
            {data?.map((a) => (
              <TableRow key={a.id}>
                
                <TableCell>
                  {new Date(a.dataHoraInicio).toLocaleDateString("pt-BR", {hour: "2-digit", minute: "2-digit"})}
                </TableCell>
                
                <TableCell>
                  {a.clienteNome ?? '-'}
                </TableCell>
                
                <TableCell>
                  {a.profissionalNome ?? '-' }
                </TableCell>
                
                <TableCell>
                  {a.servicoNome ?? '-'}
                </TableCell>
                
                <TableCell>
                    <Badge variant="secondary">
                      {a.status ?? "Pendente"}
                    </Badge>
                </TableCell>
                
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => confirmar.mutate(a.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => cancelar.mutate(a.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}