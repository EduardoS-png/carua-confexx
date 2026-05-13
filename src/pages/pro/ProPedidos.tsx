import { useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, MessageSquare, MapPin, Calendar, Package, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  pedidosConexao as seedPedidos,
  PROFISSIONAL_LOGADO_ID,
  type PedidoConexao,
  type StatusPedidoConexao,
} from "@/data/mock";

const statusLabel: Record<StatusPedidoConexao, string> = {
  pendente: "Aguardando resposta",
  negociando: "Em negociação",
  aceito: "Aceito",
  recusado: "Recusado",
  concluido: "Concluído",
};
const statusCor: Record<StatusPedidoConexao, string> = {
  pendente: "bg-accent/15 text-accent",
  negociando: "bg-warning/15 text-warning",
  aceito: "bg-success/15 text-success",
  recusado: "bg-destructive/10 text-destructive",
  concluido: "bg-muted text-muted-foreground",
};

const ProPedidos = () => {
  const { toast } = useToast();
  const [pedidos, setPedidos] = useState<PedidoConexao[]>(
    seedPedidos.filter((p) => p.profissionalId === PROFISSIONAL_LOGADO_ID),
  );
  const [contraOpen, setContraOpen] = useState<PedidoConexao | null>(null);
  const [contraValor, setContraValor] = useState("");
  const [contraPrazo, setContraPrazo] = useState("");
  const [contraObs, setContraObs] = useState("");

  const grupos = useMemo(
    () => ({
      novos: pedidos.filter((p) => p.status === "pendente" || p.status === "negociando"),
      andamento: pedidos.filter((p) => p.status === "aceito"),
      historico: pedidos.filter((p) => p.status === "concluido" || p.status === "recusado"),
    }),
    [pedidos],
  );

  const atualizar = (id: string, patch: Partial<PedidoConexao>) =>
    setPedidos((curr) => curr.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const aceitar = (p: PedidoConexao) => {
    atualizar(p.id, { status: "aceito" });
    toast({ title: "Pedido aceito 🎉", description: `${p.faccaoNome} foi avisado.` });
  };
  const recusar = (p: PedidoConexao) => {
    atualizar(p.id, { status: "recusado" });
    toast({ title: "Pedido recusado", description: `${p.faccaoNome} foi avisado.` });
  };
  const enviarContra = () => {
    if (!contraOpen) return;
    const valor = Number(contraValor);
    if (!valor || !contraPrazo) {
      toast({ title: "Preencha os campos", variant: "destructive" });
      return;
    }
    atualizar(contraOpen.id, {
      status: "negociando",
      contraproposta: { valor, prazo: contraPrazo, observacao: contraObs || undefined },
    });
    toast({ title: "Contraproposta enviada", description: `${contraOpen.faccaoNome} vai receber sua resposta.` });
    setContraOpen(null);
    setContraValor("");
    setContraPrazo("");
    setContraObs("");
  };

  const renderCard = (p: PedidoConexao) => (
    <Card key={p.id} className="shadow-soft">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <h3 className="font-display text-lg font-bold">{p.faccaoNome}</h3>
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {p.faccaoCidade} · {p.faccaoResponsavel}
            </p>
          </div>
          <Badge className={`${statusCor[p.status]} hover:${statusCor[p.status]}`}>{statusLabel[p.status]}</Badge>
        </div>

        <p className="mt-3 text-sm font-medium">{p.servico}</p>

        <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-surface/60 p-3 text-xs">
          <div>
            <p className="text-muted-foreground">Quantidade</p>
            <p className="mt-0.5 flex items-center gap-1 text-sm font-bold"><Package className="h-3.5 w-3.5" /> {p.quantidade}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Prazo</p>
            <p className="mt-0.5 flex items-center gap-1 text-sm font-bold"><Calendar className="h-3.5 w-3.5" /> {p.prazo}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Valor</p>
            <p className="mt-0.5 text-sm font-bold text-primary">R$ {p.valorProposto.toLocaleString("pt-BR")}</p>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
          <p className="flex items-start gap-2"><MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {p.mensagem}</p>
        </div>

        {p.contraproposta && (
          <div className="mt-3 rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs">
            <p className="font-semibold text-warning">Sua contraproposta:</p>
            <p className="mt-1 text-foreground">
              R$ {p.contraproposta.valor.toLocaleString("pt-BR")} · até {p.contraproposta.prazo}
            </p>
            {p.contraproposta.observacao && <p className="mt-1 italic text-muted-foreground">"{p.contraproposta.observacao}"</p>}
          </div>
        )}

        {(p.status === "pendente" || p.status === "negociando") && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="hero" onClick={() => aceitar(p)}><Check /> Aceitar</Button>
            <Button size="sm" variant="outline" onClick={() => { setContraOpen(p); setContraValor(String(p.valorProposto)); setContraPrazo(p.prazo); }}>
              <MessageSquare /> Contraproposta
            </Button>
            <Button size="sm" variant="ghost" onClick={() => recusar(p)} className="text-destructive hover:text-destructive">
              <X /> Recusar
            </Button>
          </div>
        )}

        <p className="mt-3 text-[11px] text-muted-foreground/70">Recebido em {p.recebidoEm}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pedidos de conexão"
        description="Facções que querem trabalhar com você. Aceite, recuse ou negocie diretamente."
      />

      <Tabs defaultValue="novos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="novos">Novos · {grupos.novos.length}</TabsTrigger>
          <TabsTrigger value="andamento">Em andamento · {grupos.andamento.length}</TabsTrigger>
          <TabsTrigger value="historico">Histórico · {grupos.historico.length}</TabsTrigger>
        </TabsList>

        {(["novos", "andamento", "historico"] as const).map((key) => (
          <TabsContent key={key} value={key} className="space-y-4">
            {grupos[key].length === 0 ? (
              <Card className="shadow-soft"><CardContent className="p-10 text-center text-sm text-muted-foreground">Nada por aqui ainda.</CardContent></Card>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">{grupos[key].map(renderCard)}</div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!contraOpen} onOpenChange={(o) => !o && setContraOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar contraproposta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Novo valor (R$)</Label>
              <Input type="number" value={contraValor} onChange={(e) => setContraValor(e.target.value)} />
            </div>
            <div>
              <Label>Novo prazo</Label>
              <Input type="date" value={contraPrazo} onChange={(e) => setContraPrazo(e.target.value)} />
            </div>
            <div>
              <Label>Observação (opcional)</Label>
              <Textarea value={contraObs} onChange={(e) => setContraObs(e.target.value)} placeholder="Explique sua proposta..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setContraOpen(null)}>Cancelar</Button>
            <Button variant="hero" onClick={enviarContra}>Enviar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProPedidos;
