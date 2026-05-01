import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, ArrowDown, ArrowUp, Link2, History } from "lucide-react";
import {
  materiais as initialMateriais,
  movimentosIniciais,
  pedidos,
  type Material,
  type MovimentoMaterial,
  type TipoMovimento,
} from "@/data/mock";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { toast } from "sonner";

const Materiais = () => {
  const [lista, setLista] = useState<Material[]>(initialMateriais);
  const [movs, setMovs] = useState<MovimentoMaterial[]>(movimentosIniciais);
  const [openNovo, setOpenNovo] = useState(false);
  const [openHist, setOpenHist] = useState<string | null>(null);
  const [openMov, setOpenMov] = useState<{ material: Material; tipo: TipoMovimento } | null>(null);

  const [form, setForm] = useState({ nome: "", unidade: "un", estoque: "", minimo: "" });
  const [movForm, setMovForm] = useState({ quantidade: "", observacao: "", pedidoId: "" });

  const movsDe = (id: string) => movs.filter((m) => m.materialId === id).sort((a, b) => b.data.localeCompare(a.data));

  const aplicarMovimento = () => {
    if (!openMov) return;
    const qtd = Number(movForm.quantidade);
    if (!qtd || qtd <= 0) return toast.error("Informe uma quantidade válida");
    const { material, tipo } = openMov;
    const delta = tipo === "entrada" ? qtd : -qtd;
    if (tipo === "saida" && material.estoque < qtd) return toast.error("Estoque insuficiente");

    setLista((prev) =>
      prev.map((m) =>
        m.id === material.id
          ? { ...m, estoque: m.estoque + delta, ultimaEntrada: new Date().toISOString().slice(0, 10) }
          : m,
      ),
    );
    setMovs((prev) => [
      {
        id: `mv${prev.length + 1}-${Date.now()}`,
        materialId: material.id,
        tipo,
        quantidade: qtd,
        observacao: movForm.observacao || undefined,
        pedidoId: movForm.pedidoId || undefined,
        data: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    toast.success(`${tipo === "entrada" ? "Entrada" : "Saída"} de ${qtd} ${material.unidade} registrada`);
    setMovForm({ quantidade: "", observacao: "", pedidoId: "" });
    setOpenMov(null);
  };

  const criar = () => {
    if (!form.nome) return toast.error("Informe o nome do material");
    const novo: Material = {
      id: `M${lista.length + 1}`,
      nome: form.nome,
      unidade: form.unidade,
      estoque: Number(form.estoque) || 0,
      minimo: Number(form.minimo) || 0,
      ultimaEntrada: new Date().toISOString().slice(0, 10),
    };
    setLista([novo, ...lista]);
    setForm({ nome: "", unidade: "un", estoque: "", minimo: "" });
    setOpenNovo(false);
    toast.success("Material cadastrado");
  };

  const histMaterial = useMemo(() => (openHist ? lista.find((m) => m.id === openHist) : null), [openHist, lista]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Materiais"
        description="Controle entradas, saídas e vincule insumos a pedidos."
        action={
          <Dialog open={openNovo} onOpenChange={setOpenNovo}>
            <DialogTrigger asChild><Button variant="hero" size="lg"><Plus /> Novo material</Button></DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle className="font-display">Cadastrar material</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
                <div><Label>Nome</Label><Input className="mt-1.5" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Tecido algodão" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Unidade</Label><Input className="mt-1.5" value={form.unidade} onChange={(e) => setForm({ ...form, unidade: e.target.value })} /></div>
                  <div><Label>Estoque</Label><Input className="mt-1.5" type="number" value={form.estoque} onChange={(e) => setForm({ ...form, estoque: e.target.value })} /></div>
                  <div><Label>Mínimo</Label><Input className="mt-1.5" type="number" value={form.minimo} onChange={(e) => setForm({ ...form, minimo: e.target.value })} /></div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpenNovo(false)}>Cancelar</Button>
                <Button variant="hero" onClick={criar}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {lista.map((m) => {
          const baixo = m.estoque < m.minimo;
          const pedido = pedidos.find((p) => p.id === m.vinculadoA);
          return (
            <Card key={m.id} className={`shadow-soft ${baixo ? "border-destructive/40" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{m.nome}</h3>
                    <p className="text-xs text-muted-foreground">Atualizado em {new Date(m.ultimaEntrada).toLocaleDateString("pt-BR")}</p>
                  </div>
                  {baixo && <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">Estoque baixo</Badge>}
                </div>

                <div className="my-4 flex items-end gap-3">
                  <span className="font-display text-4xl font-bold text-primary">{m.estoque}</span>
                  <span className="pb-1 text-sm text-muted-foreground">{m.unidade} · mín. {m.minimo}</span>
                </div>

                {pedido && (
                  <div className="mb-3 flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-xs">
                    <Link2 className="h-3.5 w-3.5 text-primary" />
                    <span>Vinculado a <span className="font-mono font-semibold text-primary">{pedido.id}</span> · {pedido.produto}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="soft" className="flex-1" onClick={() => setOpenMov({ material: m, tipo: "entrada" })}>
                    <ArrowDown className="text-success" /> Entrada
                  </Button>
                  <Button size="sm" variant="soft" className="flex-1" onClick={() => setOpenMov({ material: m, tipo: "saida" })}>
                    <ArrowUp className="text-destructive" /> Saída
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setOpenHist(m.id)}>
                    <History className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Diálogo de movimentação flexível */}
      <Dialog open={!!openMov} onOpenChange={(v) => !v && setOpenMov(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {openMov?.tipo === "entrada" ? "Registrar entrada" : "Registrar saída"} — {openMov?.material.nome}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label>Quantidade ({openMov?.material.unidade})</Label>
              <Input
                className="mt-1.5"
                type="number"
                step="0.01"
                autoFocus
                value={movForm.quantidade}
                onChange={(e) => setMovForm({ ...movForm, quantidade: e.target.value })}
                placeholder="Ex: 12,5"
              />
              <p className="mt-1 text-xs text-muted-foreground">Estoque atual: {openMov?.material.estoque} {openMov?.material.unidade}</p>
            </div>
            {openMov?.tipo === "saida" && (
              <div>
                <Label>Vincular a pedido (opcional)</Label>
                <select
                  value={movForm.pedidoId}
                  onChange={(e) => setMovForm({ ...movForm, pedidoId: e.target.value })}
                  className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Nenhum</option>
                  {pedidos.map((p) => <option key={p.id} value={p.id}>{p.id} · {p.produto}</option>)}
                </select>
              </div>
            )}
            <div>
              <Label>Observação (opcional)</Label>
              <Textarea
                className="mt-1.5"
                rows={2}
                value={movForm.observacao}
                onChange={(e) => setMovForm({ ...movForm, observacao: e.target.value })}
                placeholder={openMov?.tipo === "entrada" ? "Ex: compra do fornecedor X" : "Ex: refugo de corte / amostra"}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenMov(null)}>Cancelar</Button>
            <Button variant="hero" onClick={aplicarMovimento}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Histórico */}
      <Dialog open={!!openHist} onOpenChange={(v) => !v && setOpenHist(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Histórico — {histMaterial?.nome}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-2 overflow-y-auto">
            {histMaterial && movsDe(histMaterial.id).length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">Sem movimentações ainda.</p>
            )}
            {histMaterial && movsDe(histMaterial.id).map((mv) => (
              <div key={mv.id} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
                <div className="flex items-start gap-3">
                  {mv.tipo === "entrada"
                    ? <ArrowDown className="mt-0.5 h-4 w-4 text-success" />
                    : <ArrowUp className="mt-0.5 h-4 w-4 text-destructive" />}
                  <div>
                    <p className="text-sm font-semibold">
                      {mv.tipo === "entrada" ? "Entrada" : "Saída"} de {mv.quantidade} {histMaterial.unidade}
                    </p>
                    {mv.observacao && <p className="text-xs text-muted-foreground">{mv.observacao}</p>}
                    {mv.pedidoId && <p className="mt-0.5 font-mono text-xs text-primary">{mv.pedidoId}</p>}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(mv.data).toLocaleDateString("pt-BR")}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Materiais;
