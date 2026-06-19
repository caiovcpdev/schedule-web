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
import { clientesApi } from "@/lib/api/clientes";
import { id } from "date-fns/locale";

export const Route = createFileRoute("/admin/clientes")({
  component: ClientesPage,
});

function ClientesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["clientes"], queryFn: clientesApi.listar });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "" });

  const [openEdit, setOpenEdit] = useState(false);
  const [clienteEditando, setClienteEditando] = useState({
    id: "",
    nome:"",
    email:"",
    telefone:""
  });

  const criar = useMutation({
    mutationFn: () => clientesApi.criar(form),
    onSuccess: () => {
      toast.success("Cliente criado");
      qc.invalidateQueries({ queryKey: ["clientes"] });
      setOpen(false);
      setForm({ nome: "", email: "", telefone: "" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const atualizar  = useMutation({
    mutationFn: () => clientesApi.atualizar(clienteEditando.id, {
      nome: clienteEditando.nome,
      email: clienteEditando.email,
      telefone: clienteEditando.telefone
    }),

    onSuccess: () => { 
      toast.success("Cliente atualizado");
      qc.invalidateQueries({ queryKey: ["clientes"] });
      setOpenEdit(false);
    },

    onError: (e: Error) => toast.error(e.message),
  });  

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Gerencie a sua base."
        action={
          <><Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Novo cliente</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo cliente</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Nome</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
                <div className="space-y-2"><Label>E-mail</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="space-y-2"><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button onClick={() => criar.mutate()} disabled={criar.isPending}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar cliente</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={clienteEditando.nome}
                      onChange={(e) => setClienteEditando({
                        ...clienteEditando,
                        nome: e.target.value,
                      })} />
                  </div>

                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input
                      type="email"
                      value={clienteEditando.email}
                      onChange={(e) => setClienteEditando({
                        ...clienteEditando,
                        email: e.target.value,
                      })} />
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      value={clienteEditando.telefone}
                      onChange={(e) => setClienteEditando({
                        ...clienteEditando,
                        telefone: e.target.value,
                      })} />
                  </div>
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
              <TableHead>E-mail</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Carregando...</TableCell></TableRow>}
            {data?.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Nenhum cliente.</TableCell></TableRow>}
            {data?.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.nome}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.telefone}</TableCell>
                <TableCell>
                <Button variant="outline" size="sm" 
                  onClick={ () => {
                      setClienteEditando({
                        id: c.id,
                        nome: c.nome,
                        email: c. email,
                        telefone: c.telefone,
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