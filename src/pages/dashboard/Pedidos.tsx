import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Calendar, User, Package, ArrowRight } from "lucide-react";
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

const statusBadge = (s: StatusEtapa) => {
  const map: Record<StatusEtapa, string> = {
    pendente: "bg-muted text-muted-foreground border-border",
    em_andamento: "bg-accent/15 text-accent border-accent/30",
    concluido: "bg-success/15 text-success border-success/30",
  };
  const label = { pendente: "Pendente", em_andamento: "Em andamento", concluido: "Concluído" }[s];
  return <Badge variant="outline" className={map[s]}>{label}</Badge>;
};

const Pedidos = () => {
  const [lista, setLista] = useState<Pedido[]>(initialPedidos);
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState<"todos" | EtapaProducao>("todos");
  const [form, setForm] = useState({ cliente: "", produto: "", quantidade: "", prazo: "", valorPeca: "", responsavel: "" });

  const filtrados = filtro === "todos" ? lista : lista.filter((p) => p.etapaAtual === filtro);

  const avancarEtapa = (id: string) => {
    setLista((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const idx = etapasOrdem.indexOf(p.etapaAtual);
        const novasEtapas = { ...p.etapas, [p.etapaAtual]: "concluido" as StatusEtapa };
        const proxima = etapasOrdem[Math.min(idx + 1, 3)];
        if (idx < 3) novasEtapas[proxima] = "em_andamento";
        toast.success(`Lote ${id} avançou para ${etapaLabel[proxima]}`);
        return { ...p, etapas: novasEtapas, etapaAtual: proxima };
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
        description="Cadastre lotes e acompanhe cada etapa da produção."
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
                <Field label="Cliente" value={form.cliente} onChange={(v) => setForm({ ...form, cliente: v })} placeholder="Loja Mariposa" />
                <Field label="Produto" value={form.produto} onChange={(v) => setForm({ ...form, produto: v })} placeholder="Camiseta básica" />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Quantidade" type="number" value={form.quantidade} onChange={(v) => setForm({ ...form, quantidade: v })} placeholder="100" />
                  <Field label="Valor por peça (R$)" type="number" value={form.valorPeca} onChange={(v) => setForm({ ...form, valorPeca: v })} placeholder="10" />
                </div>
                <Field label="Prazo" type="date" value={form.prazo} onChange={(v) => setForm({ ...form, prazo: v })} />
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

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {(["todos", ...etapasOrdem] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filtro === f ? "default" : "soft"}
            onClick={() => setFiltro(f as any)}
            className="capitalize"
          >
            {f === "todos" ? "Todos" : etapaLabel[f as EtapaProducao]}
          </Button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {filtrados.map((p) => (
          <Card key={p.id} className="shadow-soft transition-shadow hover:shadow-warm">
            <CardContent className="p-5">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-bold text-primary">{p.id}</span>
                    <h3 className="font-display text-lg font-semibold">{p.produto}</h3>
                    {statusBadge(p.etapas[p.etapaAtual])}
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Package className="h-4 w-4" /> {p.quantidade} peças</span>
                    <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {p.cliente}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(p.prazo).toLocaleDateString("pt-BR")}</span>
                    {p.responsavel && <span>👤 {p.responsavel}</span>}
                  </div>

                  {/* Pipeline visual */}
                  <div className="flex items-center gap-1 pt-1">
                    {etapasOrdem.map((e, i) => {
                      const s = p.etapas[e];
                      const cor = s === "concluido" ? "bg-success" : s === "em_andamento" ? "bg-accent" : "bg-muted";
                      return (
                        <div key={e} className="flex flex-1 flex-col items-center gap-1.5">
                          <div className="flex w-full items-center">
                            <div className={`h-2 flex-1 rounded-full ${cor}`} />
                            {i < 3 && <div className="w-1" />}
                          </div>
                          <span className={`text-[11px] font-medium ${s === "pendente" ? "text-muted-foreground" : "text-foreground"}`}>
                            {etapaLabel[e]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total previsto</p>
                    <p className="font-display text-xl font-bold text-primary">
                      R$ {(p.quantidade * p.valorPeca).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  {p.etapaAtual !== "entrega" || p.etapas.entrega !== "concluido" ? (
                    <Button size="sm" variant="accent" onClick={() => avancarEtapa(p.id)}>
                      Avançar etapa <ArrowRight />
                    </Button>
                  ) : (
                    <Badge className="bg-success text-background">Finalizado</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
