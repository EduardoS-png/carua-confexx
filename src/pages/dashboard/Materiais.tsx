import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Plus, ArrowDown, ArrowUp, History, Search, Package, AlertTriangle, Boxes, User, ClipboardList } from "lucide-react";
import {
  materiais as initialMateriais,
  movimentosIniciais,
  pedidos,
  equipe,
  type Material,
  type MovimentoMaterial,
  type TipoMovimento,
} from "@/data/mock";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { toast } from "sonner";

type VinculoTab = "nenhum" | "pedido" | "membro";

const Materiais = () => {
  const [lista, setLista] = useState<Material[]>(initialMateriais);
  const [movs, setMovs] = useState<MovimentoMaterial[]>(movimentosIniciais);
  const [openNovo, setOpenNovo] = useState(false);
  const [openHist, setOpenHist] = useState<string | null>(null);
  const [openMov, setOpenMov] = useState<{ material: Material; tipo: TipoMovimento } | null>(null);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "baixo" | "ok">("todos");

  const [form, setForm] = useState({ nome: "", unidade: "un", estoque: "", minimo: "" });
  const [movForm, setMovForm] = useState({
    quantidade: "",
    observacao: "",
    pedidoId: "",
    membroId: "",
    vinculo: "nenhum" as VinculoTab,
  });

  const movsDe = (id: string) => movs.filter((m) => m.materialId === id).sort((a, b) => b.data.localeCompare(a.data));

  const stats = useMemo(() => {
    const baixo = lista.filter((m) => m.estoque < m.minimo).length;
    const total = lista.length;
    const movsHoje = movs.filter((m) => m.data === new Date().toISOString().slice(0, 10)).length;
    return { total, baixo, movsHoje };
  }, [lista, movs]);

  const filtrada = useMemo(() => {
    return lista.filter((m) => {
      const okBusca = !busca || m.nome.toLowerCase().includes(busca.toLowerCase());
      const okFiltro =
        filtro === "todos" ||
        (filtro === "baixo" && m.estoque < m.minimo) ||
        (filtro === "ok" && m.estoque >= m.minimo);
      return okBusca && okFiltro;
    });
  }, [lista, busca, filtro]);

  const aplicarMovimento = () => {
    if (!openMov) return;
    const qtd = Number(movForm.quantidade.replace(",", "."));
    if (!qtd || qtd <= 0) return toast.error("Informe uma quantidade válida");
    const { material, tipo } = openMov;
    const delta = tipo === "entrada" ? qtd : -qtd;
    if (tipo === "saida" && material.estoque < qtd) return toast.error("Estoque insuficiente");

    setLista((prev) =>
      prev.map((m) =>
        m.id === material.id
          ? { ...m, estoque: +(m.estoque + delta).toFixed(2), ultimaEntrada: new Date().toISOString().slice(0, 10) }
          : m,
      ),
    );
    const pedidoId = movForm.vinculo === "pedido" ? movForm.pedidoId || undefined : undefined;
    const membroId = movForm.vinculo === "membro" ? movForm.membroId || undefined : undefined;

    setMovs((prev) => [
      {
        id: `mv-${Date.now()}`,
        materialId: material.id,
        tipo,
        quantidade: qtd,
        observacao: movForm.observacao || undefined,
        pedidoId,
        membroId,
        data: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    toast.success(`${tipo === "entrada" ? "Entrada" : "Saída"} de ${qtd} ${material.unidade} registrada`);
    setMovForm({ quantidade: "", observacao: "", pedidoId: "", membroId: "", vinculo: "nenhum" });
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
  const nomePedido = (id?: string) => pedidos.find((p) => p.id === id)?.produto;
  const nomeMembro = (id?: string) => equipe.find((m) => m.id === id)?.nome;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Materiais"
        description="Controle simples de entrada e saída. Vincule cada movimento a um pedido ou a quem retirou."
        action={
          <Dialog open={openNovo} onOpenChange={setOpenNovo}>
            <DialogTrigger asChild><Button variant="hero" size="lg"><Plus /> Novo material</Button></DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle className="font-display">Cadastrar material</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
                <div><Label>Nome</Label><Input className="mt-1.5" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Tecido algodão" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Unidade</Label><Input className="mt-1.5" value={form.unidade} onChange={(e) => setForm({ ...form, unidade: e.target.value })} placeholder="m / un / kg" /></div>
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

      {/* Resumo rápido */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="shadow-soft">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-xl bg-primary/10 p-2.5"><Boxes className="h-5 w-5 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">Itens cadastrados</p><p className="font-display text-2xl font-bold">{stats.total}</p></div>
          </CardContent>
        </Card>
        <Card className={`shadow-soft ${stats.baixo > 0 ? "border-destructive/40" : ""}`}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-xl bg-destructive/10 p-2.5"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
            <div><p className="text-xs text-muted-foreground">Em estoque baixo</p><p className="font-display text-2xl font-bold text-destructive">{stats.baixo}</p></div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-xl bg-accent/10 p-2.5"><History className="h-5 w-5 text-accent" /></div>
            <div><p className="text-xs text-muted-foreground">Movimentações hoje</p><p className="font-display text-2xl font-bold">{stats.movsHoje}</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Busca + filtro */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar material..." className="h-8 border-0 bg-transparent shadow-none focus-visible:ring-0" />
        </div>
        <div className="flex gap-1 rounded-xl border border-border bg-card p-1">
          {[
            { v: "todos", l: "Todos" },
            { v: "baixo", l: "Estoque baixo" },
            { v: "ok", l: "Ok" },
          ].map((opt) => (
            <button
              key={opt.v}
              onClick={() => setFiltro(opt.v as typeof filtro)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filtro === opt.v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de materiais */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtrada.map((m) => {
          const baixo = m.estoque < m.minimo;
          const pct = Math.min(100, (m.estoque / Math.max(m.minimo * 2, 1)) * 100);
          const ultimosMovs = movsDe(m.id).slice(0, 2);
          return (
            <Card key={m.id} className={`shadow-soft transition hover:shadow-warm ${baixo ? "border-destructive/40" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2.5 ${baixo ? "bg-destructive/10" : "bg-surface"}`}>
                      <Package className={`h-5 w-5 ${baixo ? "text-destructive" : "text-primary"}`} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold leading-tight">{m.nome}</h3>
                      <p className="text-xs text-muted-foreground">Atualizado em {new Date(m.ultimaEntrada).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  {baixo && <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">Repor</Badge>}
                </div>

                <div className="mt-4">
                  <div className="flex items-end justify-between">
                    <div className="flex items-end gap-2">
                      <span className="font-display text-3xl font-bold text-primary">{m.estoque}</span>
                      <span className="pb-1 text-sm text-muted-foreground">{m.unidade}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">mínimo: {m.minimo} {m.unidade}</span>
                  </div>
                  <Progress value={pct} className={`mt-2 h-1.5 ${baixo ? "[&>div]:bg-destructive" : ""}`} />
                </div>

                {ultimosMovs.length > 0 && (
                  <div className="mt-4 space-y-1.5 rounded-lg bg-surface/60 p-2.5">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Últimos movimentos</p>
                    {ultimosMovs.map((mv) => (
                      <div key={mv.id} className="flex items-center gap-2 text-xs">
                        {mv.tipo === "entrada"
                          ? <ArrowDown className="h-3 w-3 text-success" />
                          : <ArrowUp className="h-3 w-3 text-destructive" />}
                        <span className="font-semibold">{mv.tipo === "entrada" ? "+" : "-"}{mv.quantidade} {m.unidade}</span>
                        {mv.pedidoId && <span className="text-muted-foreground">· pedido {mv.pedidoId}</span>}
                        {mv.membroId && <span className="text-muted-foreground">· {nomeMembro(mv.membroId)}</span>}
                        <span className="ml-auto text-muted-foreground">{new Date(mv.data).toLocaleDateString("pt-BR")}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
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
        {filtrada.length === 0 && (
          <div className="md:col-span-2 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nenhum material encontrado.
          </div>
        )}
      </div>

      {/* Diálogo de movimentação */}
      <Dialog open={!!openMov} onOpenChange={(v) => !v && setOpenMov(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display">
              {openMov?.tipo === "entrada"
                ? <><ArrowDown className="h-4 w-4 text-success" /> Registrar entrada</>
                : <><ArrowUp className="h-4 w-4 text-destructive" /> Registrar saída</>}
              <span className="text-muted-foreground">— {openMov?.material.nome}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="rounded-lg bg-surface p-3 text-xs">
              <span className="text-muted-foreground">Estoque atual: </span>
              <span className="font-semibold">{openMov?.material.estoque} {openMov?.material.unidade}</span>
            </div>

            <div>
              <Label>Quantidade ({openMov?.material.unidade})</Label>
              <Input
                className="mt-1.5"
                type="text"
                inputMode="decimal"
                autoFocus
                value={movForm.quantidade}
                onChange={(e) => setMovForm({ ...movForm, quantidade: e.target.value })}
                placeholder="Ex: 12,5"
              />
            </div>

            <div>
              <Label className="mb-2 block">Vincular este movimento a:</Label>
              <Tabs value={movForm.vinculo} onValueChange={(v) => setMovForm({ ...movForm, vinculo: v as VinculoTab })}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="nenhum">Nenhum</TabsTrigger>
                  <TabsTrigger value="pedido"><ClipboardList className="mr-1 h-3.5 w-3.5" /> Pedido</TabsTrigger>
                  <TabsTrigger value="membro"><User className="mr-1 h-3.5 w-3.5" /> Funcionário</TabsTrigger>
                </TabsList>
                <TabsContent value="pedido" className="mt-3">
                  <select
                    value={movForm.pedidoId}
                    onChange={(e) => setMovForm({ ...movForm, pedidoId: e.target.value })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Selecione um pedido...</option>
                    {pedidos.map((p) => <option key={p.id} value={p.id}>{p.id} · {p.produto}</option>)}
                  </select>
                </TabsContent>
                <TabsContent value="membro" className="mt-3">
                  <select
                    value={movForm.membroId}
                    onChange={(e) => setMovForm({ ...movForm, membroId: e.target.value })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Selecione um membro...</option>
                    {equipe.filter((m) => m.ativo).map((m) => <option key={m.id} value={m.id}>{m.nome} — {m.funcao}</option>)}
                  </select>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <Label>Observação (opcional)</Label>
              <Textarea
                className="mt-1.5"
                rows={2}
                value={movForm.observacao}
                onChange={(e) => setMovForm({ ...movForm, observacao: e.target.value })}
                placeholder={openMov?.tipo === "entrada" ? "Ex: compra fornecedor X" : "Ex: corte do lote, refugo, amostra..."}
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
                    <div className="mt-1 flex flex-wrap gap-2 text-xs">
                      {mv.pedidoId && (
                        <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-primary">
                          {mv.pedidoId} {nomePedido(mv.pedidoId) && `· ${nomePedido(mv.pedidoId)}`}
                        </span>
                      )}
                      {mv.membroId && (
                        <span className="rounded bg-accent/10 px-2 py-0.5 text-accent">
                          <User className="mr-1 inline h-3 w-3" />{nomeMembro(mv.membroId)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{new Date(mv.data).toLocaleDateString("pt-BR")}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Materiais;
