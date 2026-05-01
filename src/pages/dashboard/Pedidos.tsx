import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  Plus,
  Calendar,
  User,
  Package,
  ArrowRight,
  Undo2,
  CheckCircle2,
  Scissors,
  Sparkles,
  Truck,
  Circle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { pedidos as initialPedidos, equipe, type Pedido, type EtapaProducao, type StatusEtapa } from "@/data/mock";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { toast } from "sonner";

const etapasOrdem: EtapaProducao[] = ["corte", "costura", "acabamento", "entrega"];
const etapaLabel: Record<EtapaProducao, string> = {
  corte: "Corte",
  costura: "Costura",
  acabamento: "Acabamento",
  entrega: "Entrega",
};
const etapaIcon: Record<EtapaProducao, any> = {
  corte: Scissors,
  costura: Circle,
  acabamento: Sparkles,
  entrega: Truck,
};

const diasRestantes = (prazo: string) => {
  const ms = new Date(prazo).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

const prazoBadge = (prazo: string, finalizado: boolean) => {
  if (finalizado) {
    return <Badge variant="outline" className="border-success/30 bg-success/10 text-success gap-1"><CheckCircle2 className="h-3 w-3" /> Entregue</Badge>;
  }
  const d = diasRestantes(prazo);
  if (d < 0) return <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive gap-1"><AlertTriangle className="h-3 w-3" /> Atrasado {Math.abs(d)}d</Badge>;
  if (d <= 3) return <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning gap-1"><Clock className="h-3 w-3" /> Urgente · {d}d</Badge>;
  return <Badge variant="outline" className="border-border bg-muted text-muted-foreground gap-1"><Calendar className="h-3 w-3" /> {d} dias</Badge>;
};

const Pedidos = () => {
  const [lista, setLista] = useState<Pedido[]>(initialPedidos);
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState<"todos" | EtapaProducao>("todos");
  const [form, setForm] = useState({ cliente: "", produto: "", quantidade: "", prazo: "", valorPeca: "", responsavel: "" });

  // Resumo por etapa
  const resumo = useMemo(() => {
    const r: Record<EtapaProducao, { count: number; pecas: number }> = {
      corte: { count: 0, pecas: 0 },
      costura: { count: 0, pecas: 0 },
      acabamento: { count: 0, pecas: 0 },
      entrega: { count: 0, pecas: 0 },
    };
    lista.forEach((p) => {
      r[p.etapaAtual].count += 1;
      r[p.etapaAtual].pecas += p.quantidade;
    });
    return r;
  }, [lista]);

  const filtrados = filtro === "todos" ? lista : lista.filter((p) => p.etapaAtual === filtro);

  const avancarEtapa = (id: string) => {
    setLista((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const idx = etapasOrdem.indexOf(p.etapaAtual);
        const novasEtapas = { ...p.etapas, [p.etapaAtual]: "concluido" as StatusEtapa };
        if (idx >= 3) {
          toast.success(`Lote ${id} finalizado e entregue!`);
          return { ...p, etapas: novasEtapas };
        }
        const proxima = etapasOrdem[idx + 1];
        novasEtapas[proxima] = "em_andamento";
        toast.success(`Lote ${id} avançou para ${etapaLabel[proxima]}`);
        return { ...p, etapas: novasEtapas, etapaAtual: proxima };
      })
    );
  };

  const voltarEtapa = (id: string) => {
    setLista((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const idx = etapasOrdem.indexOf(p.etapaAtual);
        if (idx === 0 && p.etapas.corte === "pendente") return p;
        const novasEtapas = { ...p.etapas };
        if (p.etapas[p.etapaAtual] === "em_andamento" && idx > 0) {
          novasEtapas[p.etapaAtual] = "pendente";
          const ant = etapasOrdem[idx - 1];
          novasEtapas[ant] = "em_andamento";
          toast.info(`Lote ${id} voltou para ${etapaLabel[ant]}`);
          return { ...p, etapas: novasEtapas, etapaAtual: ant };
        }
        novasEtapas[p.etapaAtual] = "pendente";
        toast.info(`Lote ${id} marcado como pendente`);
        return { ...p, etapas: novasEtapas };
      })
    );
  };

  const criarPedido = () => {
    if (!form.cliente || !form.produto || !form.quantidade) {
      toast.error("Preencha cliente, produto e quantidade");
      return;
    }
    const novo: Pedido = {
      id: `LT-${2406 + lista.length - 4}`,
      cliente: form.cliente,
      produto: form.produto,
      quantidade: Number(form.quantidade),
      prazo: form.prazo || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      valorPeca: Number(form.valorPeca) || 10,
      responsavel: form.responsavel || undefined,
      etapaAtual: "corte",
      etapas: { corte: "em_andamento", costura: "pendente", acabamento: "pendente", entrega: "pendente" },
      criadoEm: new Date().toISOString().slice(0, 10),
    };
    setLista([novo, ...lista]);
    setForm({ cliente: "", produto: "", quantidade: "", prazo: "", valorPeca: "", responsavel: "" });
    setOpen(false);
    toast.success(`Pedido ${novo.id} criado`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pedidos"
        description="Cadastre lotes e acompanhe cada etapa: corte → costura → acabamento → entrega."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="lg"><Plus /> Novo pedido</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Novo pedido (lote)</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <Field label="Cliente" value={form.cliente} onChange={(v: string) => setForm({ ...form, cliente: v })} placeholder="Loja Mariposa" />
                <Field label="Produto" value={form.produto} onChange={(v: string) => setForm({ ...form, produto: v })} placeholder="Camiseta básica" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Quantidade" type="number" value={form.quantidade} onChange={(v: string) => setForm({ ...form, quantidade: v })} placeholder="100" />
                  <Field label="Valor por peça (R$)" type="number" value={form.valorPeca} onChange={(v: string) => setForm({ ...form, valorPeca: v })} placeholder="10" />
                </div>
                <Field label="Prazo" type="date" value={form.prazo} onChange={(v: string) => setForm({ ...form, prazo: v })} />
                <div>
                  <Label>Responsável</Label>
                  <select
                    value={form.responsavel}
                    onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
                    className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Definir depois</option>
                    {equipe.filter((m) => m.ativo).map((m) => (
                      <option key={m.id} value={m.nome}>{m.nome} — {m.funcao}</option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button variant="hero" onClick={criarPedido}>Criar pedido</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Resumo visual por etapa — também serve de filtro */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {etapasOrdem.map((e) => {
          const Icon = etapaIcon[e];
          const ativa = filtro === e;
          return (
            <button
              key={e}
              onClick={() => setFiltro(ativa ? "todos" : e)}
              className={`group rounded-xl border p-4 text-left transition-all ${
                ativa
                  ? "border-primary bg-gradient-warm text-primary-foreground shadow-warm"
                  : "border-border bg-card hover:border-primary/40 hover:shadow-soft"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${ativa ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-display text-2xl font-bold">{resumo[e].count}</span>
              </div>
              <p className={`mt-2 font-display text-sm font-semibold ${ativa ? "" : "text-foreground"}`}>{etapaLabel[e]}</p>
              <p className={`text-xs ${ativa ? "opacity-80" : "text-muted-foreground"}`}>{resumo[e].pecas} peças</p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{filtrados.length}</span> {filtrados.length === 1 ? "pedido" : "pedidos"}
          {filtro !== "todos" && <> em <span className="font-semibold text-primary">{etapaLabel[filtro]}</span></>}
        </p>
        {filtro !== "todos" && (
          <Button size="sm" variant="ghost" onClick={() => setFiltro("todos")}>Limpar filtro</Button>
        )}
      </div>

      {/* Lista */}
      <div className="grid gap-4">
        {filtrados.map((p) => {
          const idxAtual = etapasOrdem.indexOf(p.etapaAtual);
          const finalizado = p.etapas.entrega === "concluido";
          const proxima = !finalizado && idxAtual < 3 ? etapasOrdem[idxAtual + 1] : null;
          const podeFinalizarUltima = !finalizado && p.etapaAtual === "entrega";
          const progresso = (etapasOrdem.filter((e) => p.etapas[e] === "concluido").length / 4) * 100;

          return (
            <Card key={p.id} className="overflow-hidden shadow-soft transition-all hover:shadow-warm">
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">{p.id}</span>
                      {prazoBadge(p.prazo, finalizado)}
                    </div>
                    <h3 className="font-display text-lg font-semibold leading-tight">{p.produto}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {p.cliente}</span>
                      <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" /> {p.quantidade} peças</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Entrega {new Date(p.prazo).toLocaleDateString("pt-BR")}</span>
                      {p.responsavel && <span className="flex items-center gap-1">👤 {p.responsavel}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total previsto</p>
                    <p className="font-display text-2xl font-bold text-primary">
                      R$ {(p.quantidade * p.valorPeca).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>

                {/* Pipeline numerado */}
                <div className="bg-surface/50 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Etapas da produção</p>
                    <p className="text-xs font-medium text-muted-foreground">{Math.round(progresso)}% concluído</p>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {etapasOrdem.map((e, i) => {
                      const s = p.etapas[e];
                      const Icon = etapaIcon[e];
                      const concluida = s === "concluido";
                      const ativa = s === "em_andamento";
                      return (
                        <div key={e} className="flex flex-col items-center gap-2">
                          <div
                            className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all ${
                              concluida
                                ? "border-success bg-success text-background"
                                : ativa
                                  ? "border-accent bg-accent text-accent-foreground shadow-glow animate-pulse"
                                  : "border-border bg-background text-muted-foreground"
                            }`}
                          >
                            {concluida ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                            <span className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${concluida || ativa ? "bg-card text-foreground" : "bg-muted text-muted-foreground"} border border-border`}>
                              {i + 1}
                            </span>
                          </div>
                          <div className="text-center">
                            <p className={`text-xs font-semibold ${concluida ? "text-success" : ativa ? "text-accent" : "text-muted-foreground"}`}>
                              {etapaLabel[e]}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {concluida ? "Concluído" : ativa ? "Em andamento" : "Aguardando"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Barra de progresso */}
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-gradient-warm transition-all duration-500" style={{ width: `${progresso}%` }} />
                  </div>
                </div>

                {/* Ações */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card p-4">
                  <div className="text-sm">
                    {finalizado ? (
                      <span className="flex items-center gap-2 font-medium text-success">
                        <CheckCircle2 className="h-4 w-4" /> Pedido finalizado e entregue
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Etapa atual: <span className="font-semibold text-foreground">{etapaLabel[p.etapaAtual]}</span>
                        {proxima && <> → próxima: <span className="font-semibold text-accent">{etapaLabel[proxima]}</span></>}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!finalizado && idxAtual > 0 && (
                      <Button size="sm" variant="ghost" onClick={() => voltarEtapa(p.id)}>
                        <Undo2 className="h-4 w-4" /> Voltar
                      </Button>
                    )}
                    {!finalizado && proxima && (
                      <Button size="sm" variant="accent" onClick={() => avancarEtapa(p.id)}>
                        Concluir {etapaLabel[p.etapaAtual]} <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                    {podeFinalizarUltima && (
                      <Button size="sm" variant="hero" onClick={() => avancarEtapa(p.id)}>
                        <CheckCircle2 className="h-4 w-4" /> Marcar como entregue
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filtrados.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <Package className="h-10 w-10 text-muted-foreground" />
              <p className="font-display font-semibold">Nenhum pedido nesta etapa</p>
              <p className="text-sm text-muted-foreground">Tente outro filtro ou cadastre um novo pedido.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, ...rest }: any) => (
  <div>
    <Label>{label}</Label>
    <Input className="mt-1.5" value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
  </div>
);

export default Pedidos;
