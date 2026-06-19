import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Bolt, Pencil, Plus } from "lucide-react";
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
import { profissionaisApi } from "@/lib/api/profissionais";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/servicos")({
  component: ServicosPage,
});

const empty = { nome: "", descricao: "", preco: 0, duracaoEmMinutos: 30 };

function ServicosPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["servicos"], queryFn: servicosApi.listar });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const [openEdit, setOpenEdit] = useState(false);
  const[servicoEditando, setServicoEditando] = useState({
    id: "",
    nome: "",
    descricao: "",
    preco: 0.00,
    duracaoEmMinutos: 0
  });

  const {data: profissionais} = useQuery({
    queryKey: ["profissionais"],
    queryFn: profissionaisApi.listar
  });

  const [openAtribuir, setOpenAtribuir] = useState(false);
  const [atribuicao, setAtribuicao] = useState({
    profissionalId: "",
    servicoId:""
  });

  const criar = useMutation({
    mutationFn: () => servicosApi.criar(form),
    onSuccess: () => {
      toast.success("Serviço criado");
      qc.invalidateQueries({ queryKey: ["servicos"] });
      setOpen(false); setForm(empty);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const atribuir = useMutation({
    mutationFn: () => 
      profissionaisApi.vincularServico(atribuicao.profissionalId, atribuicao.servicoId),
      onSuccess: () => {
        toast.success("Serviço atribuído ao profissional.");
        qc.invalidateQueries({queryKey: ["profissionais"]});
        setOpenAtribuir(false);
        setAtribuicao({profissionalId: "", servicoId: ""})
      },
      onError: (e: Error) => toast.error(e.message)
  });

  const atualizar = useMutation({
    mutationFn: () => servicosApi.atualizar(servicoEditando.id, {
      nome: servicoEditando.nome,
      descricao: servicoEditando.descricao,
      preco: servicoEditando.preco,
      duracaoEmMinutos: servicoEditando.duracaoEmMinutos
    }),

    onSuccess: () => { 
      toast.success("Servico atualizado.");
      qc.invalidateQueries({queryKey: ["servicos"]});
      setOpenEdit(false);
    },

    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <PageHeader
        title="Serviços"
        description="Catálogo oferecido aos clientes."
        action={
          <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Novo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo serviço</DialogTitle>
              </DialogHeader>
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
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar cliente</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input
                        value={servicoEditando.nome}
                        onChange={(e) => setServicoEditando({
                          ...servicoEditando,
                          nome: e.target.value,
                        })} />
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Input
                        type="email"
                        value={servicoEditando.descricao}
                        onChange={(e) => setServicoEditando({
                          ...servicoEditando,
                          descricao: e.target.value,
                        })} />
                    </div>

                    <div className="space-y-2">
                      <Label>Preço</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min = "0"
                        value={servicoEditando.preco}
                        onChange={(e) => setServicoEditando({
                          ...servicoEditando,
                          preco: Number(e.target.value),
                        })} />
                    </div>

                    <div className="space-y-2">
                      <Label>Duração</Label>
                      <Input
                        type="number"
                        min = "1"
                        value={servicoEditando.duracaoEmMinutos}
                        onChange={(e) => setServicoEditando({
                          ...servicoEditando,
                          duracaoEmMinutos: Number(e.target.value),
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

              <Dialog open={openAtribuir} onOpenChange={setOpenAtribuir}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Bolt className="mr-2 h-4 w-4" /> Atribuir
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Atribuir serviço a um profissional</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Serviço</Label>
                      <Select
                        value={atribuicao.servicoId}
                        onValueChange={(value) =>
                          setAtribuicao({ ...atribuicao, servicoId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Profissional</Label>
                      <Select
                        value={atribuicao.profissionalId}
                        onValueChange={(value) =>
                          setAtribuicao({ ...atribuicao, profissionalId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um profissional" />
                        </SelectTrigger>
                        <SelectContent>
                          {profissionais?.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      onClick={() => atribuir.mutate()}
                      disabled={
                        atribuir.isPending ||
                        !atribuicao.servicoId ||
                        !atribuicao.profissionalId
                      }
                    >
                      Atribuir
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
              <TableHead>Duração</TableHead>
              <TableHead >Preço</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Carregando...</TableCell></TableRow>}
            {data?.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Nenhum serviço.</TableCell></TableRow>}
            {data?.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.nome}</TableCell>
                <TableCell>{s.duracaoEmMinutos} min</TableCell>
                <TableCell >R$ {s.preco.toFixed(2)}</TableCell>
                  <Button variant="outline" size="sm" 
                      onClick={ () => {
                          setServicoEditando({
                            id: s.id,
                            nome: s.nome,
                            descricao: s.descricao,
                            preco: s.preco,
                            duracaoEmMinutos: s.duracaoEmMinutos
                          });
                          setOpenEdit(true);
                        }}>
                      <Pencil></Pencil>
                    </Button>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}