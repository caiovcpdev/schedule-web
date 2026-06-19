import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { profissionaisApi } from "@/lib/api/profissionais";
import { clientesApi } from "@/lib/api/clientes";

export const Route = createFileRoute("/admin/profissionais")({
  component: ProfissionaisPage,
});

const empty = { nome: "", email: "", especialidade: "", inicioExpediente: "09:00:00", fimExpediente: "18:00:00" };

function ProfissionaisPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["profissionais"], queryFn: profissionaisApi.listar });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const [openEdit, setOpenEdit] = useState(false);
  const [profissionalEditando, setProfissionalEditando] = useState({
    id: "",
    nome: "",
    email: "",
    especialidade: "",
    inicioExpediente: "09:00:00", 
    fimExpediente: "18:00:00"
  })

  const criar = useMutation({
    mutationFn: () => profissionaisApi.criar(form),
    onSuccess: () => {
      toast.success("Profissional cadastrado");
      qc.invalidateQueries({ queryKey: ["profissionais"] });
      setOpen(false); setForm(empty);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const atualizar =  useMutation({
    mutationFn: () => profissionaisApi.atualizar(profissionalEditando.id, {
      nome: profissionalEditando.nome,
      email: profissionalEditando.email,
      especialidade: profissionalEditando.especialidade,
      inicioExpediente: profissionalEditando.inicioExpediente,
      fimExpediente: profissionalEditando.fimExpediente
    }),

    onSuccess: () => { 
      toast.success("Profissional atualizado");
      qc.invalidateQueries({ queryKey: ["clientes"] });
      setOpenEdit(false); 
    },

    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <PageHeader
        title="Profissionais"
        description="Quem realiza os atendimentos."
        action={
          <><Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Novo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo profissional</DialogTitle></DialogHeader>
              <div className="grid gap-4">
                <Field label="Nome"><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></Field>
                <Field label="E-mail"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
                <Field label="Especialidade"><Input value={form.especialidade} onChange={(e) => setForm({ ...form, especialidade: e.target.value })} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Início expediente">
                    <Input type="time" value={form.inicioExpediente.slice(0, 5)} onChange={(e) => setForm({ ...form, inicioExpediente: e.target.value + ":00" })} />
                  </Field>
                  <Field label="Fim expediente">
                    <Input type="time" value={form.fimExpediente.slice(0, 5)} onChange={(e) => setForm({ ...form, fimExpediente: e.target.value + ":00" })} />
                  </Field>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => criar.mutate()} disabled={criar.isPending}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog><Dialog open={openEdit} onOpenChange={setOpenEdit}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar cliente</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={profissionalEditando.nome}
                      onChange={(e) => setProfissionalEditando({
                        ...profissionalEditando,
                        nome: e.target.value,
                      })} />
                  </div>

                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input
                      type="email"
                      value={profissionalEditando.email}
                      onChange={(e) => setProfissionalEditando({
                        ...profissionalEditando,
                        email: e.target.value,
                      })} />
                  </div>

                  <div className="space-y-2">
                    <Label>Especialidade</Label>
                    <Input
                      value={profissionalEditando.especialidade}
                      onChange={(e) => setProfissionalEditando({
                        ...profissionalEditando,
                        especialidade: e.target.value,
                      })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Início expediente">
                    <Input
                      type="time"
                      value={profissionalEditando.inicioExpediente.slice(0, 5)}
                      onChange={(e) =>
                        setProfissionalEditando({
                          ...profissionalEditando,
                          inicioExpediente: e.target.value + ":00",
                        })
                      }
                    />
                  </Field>

                  <Field label="Fim expediente">
                    <Input
                      type="time"
                      value={profissionalEditando.fimExpediente.slice(0, 5)}
                      onChange={(e) =>
                        setProfissionalEditando({
                          ...profissionalEditando,
                          fimExpediente: e.target.value + ":00",
                        })
                      }
                    />
                  </Field>
                </div>

                <DialogFooter>
                  <Button
                    onClick={() => atualizar.mutate()}
                    disabled={atualizar.isPending}
                  >
                    Salvar alterações
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Expediente</TableHead>
              <TableHead>Açoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Carregando...</TableCell></TableRow>}
            {data?.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Nenhum cadastro.</TableCell></TableRow>}
            {data?.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.nome}</TableCell>
                <TableCell>{p.especialidade}</TableCell>
                <TableCell>{p.inicioExpediente?.slice(0,5)} - {p.fimExpediente?.slice(0,5)}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm"
                    onClick={ () => { 
                      setProfissionalEditando({
                        id: p.id,
                        nome: p.nome,
                        email: p.email,
                        especialidade: p.especialidade,
                        inicioExpediente: p.inicioExpediente,
                        fimExpediente: p.fimExpediente,
                      });
                      setOpenEdit(true);
                     }}
                  >
                  <Pencil></Pencil>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}