import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { servicosApi } from "@/lib/api/servicos";

export const Route = createFileRoute("/admin/servicos")({
  component: ServicosPage,
});

const empty = { nome: "", descricao: "", preco: 0, duracaoEmMinutos: 30 };

function ServicosPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["servicos"], queryFn: servicosApi.listar });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const criar = useMutation({
    mutationFn: () => servicosApi.criar(form),
    onSuccess: () => {
      toast.success("Serviço criado");
      qc.invalidateQueries({ queryKey: ["servicos"] });
      setOpen(false); setForm(empty);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <PageHeader
        title="Serviços"
        description="Catálogo oferecido aos clientes."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Novo</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo serviço</DialogTitle></DialogHeader>
              <div className="grid gap-4">
                <div className="space-y-2"><Label>Nome</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
                <div className="space-y-2"><Label>Descrição</Label><Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Preço (R$)</Label><Input type="number" min={0} step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: Number(e.target.value) })} /></div>
                  <div className="space-y-2"><Label>Duração (min)</Label><Input type="number" min={1} value={form.duracaoEmMinutos} onChange={(e) => setForm({ ...form, duracaoEmMinutos: Number(e.target.value) })} /></div>
                </div>
              </div>
              <DialogFooter><Button onClick={() => criar.mutate()} disabled={criar.isPending}>Salvar</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Nome</TableHead><TableHead>Duração</TableHead><TableHead className="text-right">Preço</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Carregando...</TableCell></TableRow>}
            {data?.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Nenhum serviço.</TableCell></TableRow>}
            {data?.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.nome}</TableCell>
                <TableCell>{s.duracaoEmMinutos} min</TableCell>
                <TableCell className="text-right">R$ {s.preco.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}