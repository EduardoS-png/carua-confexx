import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  Plus, Calendar, User, Package, ArrowRight, Undo2, CheckCircle2,
  Scissors, Sparkles, Truck, Circle, AlertTriangle, Clock, UserCheck, UserX,
} from "lucide-react";
import { pedidos as initialPedidos, equipe, type Pedido, type EtapaProducao, type StatusEtapa } from "@/data/mock";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { toast } from "sonner";

const etapasOrdem: EtapaProducao[] = ["corte", "costura", "acabamento", "entrega"];
const etapaLabel: Record<EtapaProducao, string> = {
  corte: "Corte", costura: "Costura", acabamento: "Acabamento", entrega: "Entrega",
};
const etapaIcon: Record<EtapaProducao, any> = {
  corte: Scissors, costura: Circle, acabamento: Sparkles, entrega: Truck,
};

const diasRestantes = (prazo: string) => Math.ceil((new Date(prazo).getTime() - Date.now()) / 86400000);

const prazoBadge = (prazo: string, finalizado: boolean) => {
  if (finalizado) return <Badge variant="outline" className="border-success/30 bg-success/10 text-success gap-1"><CheckCircle2 className="h-3 w-3" /> Entregue</Badge>;
  const d = diasRestantes(prazo);
  if (d < 0) return <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive gap-1"><AlertTriangle className="h-3 w-3" /> Atrasado {Math.abs(d)}d</Badge>;
  if (d <= 3) return <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning gap-1"><Clock className="h-3 w-3" /> Urgente · {d}d</Badge>;
  return <Badge variant="outline" className="border-border bg-muted text-muted-foreground gap-1"><Calendar className="h-3 w-3" /> {d} dias</Badge>;
};

const Pedidos = () => {
  const [lista, setLista] = useState<Pedido[]>(initialPedidos);
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState<"todos" | EtapaProducao>("todos");
  const [form, setForm] = useState({
    cliente: "", produto: "", quantidade: "", prazo: "", valorPeca: "",
    responsaveis: {} as Partial<Record<EtapaProducao, string>>,
  });

  const setResp = (etapa: EtapaProducao, nome: string) =>
    setForm(f => ({ ...f, responsaveis: { ...f.responsaveis, [etapa]: nome || undefined } }));

  const resumo = useMemo(() => {
    const r: Record<EtapaProducao, { count: number; pecas: number }> = {
      corte: { count: 0, pecas: 0 }, costura: { count: 0, pecas: 0 },
      acabamento: { count: 0, pecas: 0 }, entrega: { count: 0, pecas: 0 },
    };
    lista.forEach(p => { r[p.etapaAtual].count += 1; r[p.etapaAtual].pecas += p.quantidade; });
    return r;
  }, [lista]);

  const filtrados = filtro === "todos" ? lista : lista.filter(p => p.etapaAtual === filtro);

  const avancarEtapa = (id: string) => {
    setLista(prev => prev.map(p => {
      if (p.id !== id) return p;
      const idx = etapasOrdem.indexOf(p.etapaAtual);
      const novasEtapas = { ...p.etapas, [p.etapaAtual]: "concluido" as StatusEtapa };
      if (idx >= 3) { toast.success(`Lote ${id} finalizado e entregue!`); return { ...p, etapas: novasEtapas }; }
      const proxima = etapasOrdem[idx + 1];
      novasEtapas[proxima] = "em_andamento";
      const resp = p.responsaveisPorEtapa[proxima];
      toast.success(`Lote ${id} → ${etapaLabel[proxima]}${resp ? ` (com ${resp})` : ""}`);
      return { ...p, etapas: novasEtapas, etapaAtual: proxima };
    }));
  };

  const voltarEtapa = (id: string) => {
    setLista(prev => prev.map(p => {
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
      return { ...p, etapas: novasEtapas };
    }));
  };

  const atribuirResponsavel = (pedidoId: string, etapa: EtapaProducao, nome: string) => {
    setLista(prev => prev.map(p =>
      p.id === pedidoId
        ? { ...p, responsaveisPorEtapa: { ...p.responsaveisPorEtapa, [etapa]: nome || undefined } }
        : p
    ));
    if (nome) toast.success(`${nome} atribuído(a) ao ${etapaLabel[etapa]}`);
  };

  const criarPedido = () => {
    if (!form.cliente || !form.produto || !form.quantidade) {
      toast.error("Preencha cliente, produto e quantidade"); return;
    }
    const novo: Pedido = {
      id: `LT-${2406 + lista.length - 4}`,
      cliente: form.cliente, produto: form.produto,
      quantidade: Number(form.quantidade),
      prazo: form.prazo || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      valorPeca: Number(form.valorPeca) || 10,
      responsaveisPorEtapa: form.responsaveis,
      responsavel: form.responsaveis.costura || form.responsaveis.corte,
      etapaAtual: "corte",
      etapas: { corte: "em_andamento", costura: "pendente", acabamento: "pendente", entrega: "pendente" },
      criadoEm: new Date().toISOString().slice(0, 10),
    };
    setLista([novo, ...lista]);
    setForm({ cliente: "", produto: "", quantidade: "", prazo: "", valorPeca: "", responsaveis: {} });
    setOpen(false);
    toast.success(`Pedido ${novo.id} criado`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pedidos"
        description="Cadastre lotes, defina quem faz cada etapa e acompanhe o fluxo de produção."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="hero" size="lg"><Plus /> Novo pedido</Button></DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle className="font-display">Novo pedido (lote)</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <Field label="Cliente" value={form.cliente} onChange={(v: string) => setForm({ ...form, cliente: v })} placeholder="Loja Mariposa" />
                <Field label="Produto" value={form.produto} onChange={(v: string) => setForm({ ...form, produto: v })} placeholder="Camiseta básica" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Quantidade" type="number" value={form.quantidade} onChange={(v: string) => setForm({ ...form, quantidade: v })} placeholder="100" />
                  <Field label="Valor por peça (R$)" type="number" value={form.valorPeca} onChange={(v: string) => setForm({ ...form, valorPeca: v })} placeholder="10" />
                </div>
                <Field label="Prazo" type="date" value={form.prazo} onChange={(v: string) => setForm({ ...form, prazo: v })} />

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                  <div>
                    <Label className="font-display text-sm">Distribuir etapas</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Defina quem é responsável por cada etapa do lote.</p>
                  </div>
                  {etapasOrdem.map((e) => {
                    const Icon = etapaIcon[e];
                    const aptos = equipe.filter(m => m.ativo && m.etapas.includes(e));
                    return (
                      <div key={e} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
                        <span className="w-24 text-sm font-medium">{etapaLabel[e]}</span>
                        <select
                          value={form.responsaveis[e] || ""}
                          onChange={(ev) => setResp(e, ev.target.value)}
                          className="flex-1 h-9 rounded-md border border-input bg-background px-2 text-sm"
                        >
                          <option value="">— A definir —</option>
                          {aptos.map(m => <option key={m.id} value={m.nome}>{m.nome}</option>)}
                        </select>
                      </div>
                    );
                  })}
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

      {/* Resumo / filtros */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {etapasOrdem.map((e) => {
          const Icon = etapaIcon[e];
          const ativa = filtro === e;
          return (
            <button key={e} onClick={() => setFiltro(ativa ? "todos" : e)}
              className={`group rounded-xl border p-4 text-left transition-all ${
                ativa ? "border-primary bg-gradient-warm text-primary-foreground shadow-warm"
                      : "border-border bg-card hover:border-primary/40 hover:shadow-soft"
              }`}>
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
        {filtro !== "todos" && <Button size="sm" variant="ghost" onClick={() => setFiltro("todos")}>Limpar filtro</Button>}
      </div>

      <div className="grid gap-4">
        {filtrados.map((p) => {
          const idxAtual = etapasOrdem.indexOf(p.etapaAtual);
          const finalizado = p.etapas.entrega === "concluido";
          const proxima = !finalizado && idxAtual < 3 ? etapasOrdem[idxAtual + 1] : null;
          const podeFinalizarUltima = !finalizado && p.etapaAtual === "entrega";
          const progresso = (etapasOrdem.filter(e => p.etapas[e] === "concluido").length / 4) * 100;
          const respAtual = p.responsaveisPorEtapa[p.etapaAtual];
          const semRespCount = etapasOrdem.filter(e => !p.responsaveisPorEtapa[e]).length;

          return (
            <Card key={p.id} className="overflow-hidden shadow-soft transition-all hover:shadow-warm">
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">{p.id}</span>
                      {prazoBadge(p.prazo, finalizado)}
                      {semRespCount > 0 && !finalizado && (
                        <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning gap-1">
                          <UserX className="h-3 w-3" /> {semRespCount} etapa(s) sem responsável
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-semibold leading-tight">{p.produto}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {p.cliente}</span>
                      <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" /> {p.quantidade} peças</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(p.prazo).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total previsto</p>
                    <p className="font-display text-2xl font-bold text-primary">R$ {(p.quantidade * p.valorPeca).toLocaleString("pt-BR")}</p>
                  </div>
                </div>

                {/* Pipeline com responsável por etapa */}
                <div className="bg-surface/50 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Etapas e responsáveis</p>
                    <p className="text-xs font-medium text-muted-foreground">{Math.round(progresso)}% concluído</p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                    {etapasOrdem.map((e, i) => {
                      const s = p.etapas[e];
                      const Icon = etapaIcon[e];
                      const concluida = s === "concluido";
                      const ativa = s === "em_andamento";
                      const resp = p.responsaveisPorEtapa[e];
                      const aptos = equipe.filter(m => m.ativo && m.etapas.includes(e));

                      return (
                        <div key={e}
                          className={`rounded-lg border p-3 transition-all ${
                            concluida ? "border-success/30 bg-success/5"
                            : ativa ? "border-accent bg-accent/5 shadow-glow"
                            : "border-border bg-background"
                          }`}>
                          <div className="flex items-center gap-2">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                              concluida ? "bg-success text-background"
                              : ativa ? "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground"
                            }`}>
                              {concluida ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-semibold ${concluida ? "text-success" : ativa ? "text-accent" : "text-foreground"}`}>
                                {etapaLabel[e]}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {concluida ? "Concluído" : ativa ? "Em andamento" : "Aguardando"}
                              </p>
                            </div>
                            <Icon className="h-4 w-4 text-muted-foreground/60" />
                          </div>
                          <div className="mt-2">
                            {concluida && resp ? (
                              <div className="flex items-center gap-1.5 rounded-md bg-success/10 px-2 py-1 text-[11px] text-success">
                                <UserCheck className="h-3 w-3" /> {resp}
                              </div>
                            ) : (
                              <select
                                value={resp || ""}
                                disabled={finalizado}
                                onChange={(ev) => atribuirResponsavel(p.id, e, ev.target.value)}
                                className={`w-full h-7 rounded-md border px-1.5 text-[11px] ${
                                  resp ? "border-primary/30 bg-primary/5 text-primary font-medium"
                                       : "border-warning/40 bg-warning/5 text-warning"
                                }`}
                              >
                                <option value="">— Definir —</option>
                                {aptos.map(m => <option key={m.id} value={m.nome}>{m.nome}</option>)}
                              </select>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-gradient-warm transition-all duration-500" style={{ width: `${progresso}%` }} />
                  </div>
                </div>

                {/* Ações */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card p-4">
                  <div className="text-sm">
                    {finalizado ? (
                      <span className="flex items-center gap-2 font-medium text-success">
                        <CheckCircle2 className="h-4 w-4" /> Pedido finalizado
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Agora: <span className="font-semibold text-foreground">{etapaLabel[p.etapaAtual]}</span>
                        {respAtual ? <> com <span className="font-semibold text-primary">{respAtual}</span></> : <span className="text-warning"> · sem responsável</span>}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!finalizado && idxAtual > 0 && (
                      <Button size="sm" variant="ghost" onClick={() => voltarEtapa(p.id)}><Undo2 className="h-4 w-4" /> Voltar</Button>
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
