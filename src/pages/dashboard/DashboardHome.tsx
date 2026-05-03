import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight, ClipboardList, Boxes, Wallet, Users, AlertTriangle, TrendingUp,
  Target, Bell, AlertCircle, Clock, Flame, CheckCircle2, XCircle
} from "lucide-react";
import { pedidos, materiais, equipe } from "@/data/mock";
import { PageHeader } from "@/components/dashboard/PageHeader";
import type { EtapaProducao } from "@/data/mock";

/* ── Metas mensais (mockadas) ── */
const metas = {
  pecasMes: { label: "Peças produzidas", atual: 0, meta: 400, unidade: "peças" },
  receitaMes: { label: "Receita do mês", atual: 0, meta: 6000, unidade: "R$" },
  pedidosConcluidos: { label: "Pedidos entregues", atual: 0, meta: 8, unidade: "" },
  taxaPontualidade: { label: "Entregas no prazo", atual: 0, meta: 100, unidade: "%" },
};

const DashboardHome = () => {
  const hoje = new Date();
  const ativos = pedidos.filter((p) => p.etapaAtual !== "entrega").length;
  const entregues = pedidos.filter((p) => p.etapaAtual === "entrega").length;
  const pecasMes = pedidos.reduce((s, p) => s + p.quantidade, 0);
  const receita = pedidos.reduce((s, p) => s + p.quantidade * p.valorPeca, 0);
  const materiaisBaixos = materiais.filter((m) => m.estoque < m.minimo);

  // Prazos
  const atrasados = pedidos.filter((p) => p.etapaAtual !== "entrega" && new Date(p.prazo) < hoje);
  const urgentes = pedidos.filter((p) => {
    if (p.etapaAtual === "entrega") return false;
    const diff = (new Date(p.prazo).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  });

  // Metas calculadas
  const pecasEntregues = pedidos.filter(p => p.etapaAtual === "entrega").reduce((s, p) => s + p.quantidade, 0);
  const receitaRecebida = pedidos.filter(p => p.etapaAtual === "entrega").reduce((s, p) => s + p.quantidade * p.valorPeca, 0);
  const taxaPrazo = entregues > 0 ? Math.round((pedidos.filter(p => p.etapaAtual === "entrega" && new Date(p.prazo) >= new Date(p.criadoEm)).length / entregues) * 100) : 0;

  const metasCalc = {
    pecasMes: { ...metas.pecasMes, atual: pecasEntregues },
    receitaMes: { ...metas.receitaMes, atual: receitaRecebida },
    pedidosConcluidos: { ...metas.pedidosConcluidos, atual: entregues },
    taxaPontualidade: { ...metas.taxaPontualidade, atual: taxaPrazo },
  };

  // Gargalos — quantidade de pedidos em cada etapa
  const etapas: EtapaProducao[] = ["corte", "costura", "acabamento", "entrega"];
  const etapaCounts = etapas.map(e => ({
    etapa: e,
    count: pedidos.filter(p => p.etapaAtual === e && p.etapaAtual !== "entrega").length,
  }));
  const gargalo = etapaCounts.filter(e => e.etapa !== "entrega").sort((a, b) => b.count - a.count)[0];

  // Equipe por etapa (capacidade)
  const equipePorEtapa = etapas.slice(0, 3).map(e => ({
    etapa: e,
    membros: equipe.filter(m => m.ativo && m.etapas.includes(e)).length,
    pedidos: pedidos.filter(p => p.etapaAtual === e).length,
  }));

  // Alertas
  const alertas: { tipo: "danger" | "warning" | "info"; msg: string; icon: typeof AlertTriangle }[] = [];
  atrasados.forEach(p => alertas.push({ tipo: "danger", msg: `${p.id} está ATRASADO — prazo era ${new Date(p.prazo).toLocaleDateString("pt-BR")}`, icon: XCircle }));
  urgentes.forEach(p => alertas.push({ tipo: "warning", msg: `${p.id} vence em breve — ${new Date(p.prazo).toLocaleDateString("pt-BR")}`, icon: Clock }));
  materiaisBaixos.forEach(m => alertas.push({ tipo: "warning", msg: `${m.nome}: estoque baixo (${m.estoque} ${m.unidade}, mín. ${m.minimo})`, icon: AlertTriangle }));
  if (gargalo && gargalo.count >= 2) alertas.push({ tipo: "info", msg: `Gargalo detectado no ${gargalo.etapa.toUpperCase()} — ${gargalo.count} pedidos acumulados`, icon: Flame });

  const stats = [
    { label: "Pedidos ativos", value: ativos, icon: ClipboardList, color: "text-primary", bg: "bg-primary/10" },
    { label: "Peças no mês", value: pecasMes, icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
    { label: "Receita prevista", value: `R$ ${receita.toLocaleString("pt-BR")}`, icon: Wallet, color: "text-green-700", bg: "bg-green-100" },
    { label: "Alertas", value: alertas.length, icon: Bell, color: alertas.length > 0 ? "text-destructive" : "text-muted-foreground", bg: alertas.length > 0 ? "bg-destructive/10" : "bg-muted" },
  ];

  const alertColors = { danger: "border-destructive/30 bg-destructive/5 text-destructive", warning: "border-yellow-500/30 bg-yellow-50 text-yellow-800", info: "border-blue-500/30 bg-blue-50 text-blue-800" };

  return (
    <div className="space-y-8">
      <PageHeader title="Visão geral" description="Acompanhe a produção da sua confecção em tempo real." />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-soft">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-foreground">{s.value}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <Card className="shadow-soft border-destructive/20">
          <CardHeader className="pb-3">
            <CardTitle className="font-display flex items-center gap-2 text-base">
              <Bell className="h-5 w-5 text-destructive" />
              Central de Alertas
              <Badge variant="destructive" className="ml-2">{alertas.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alertas.map((a, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-lg border p-3 ${alertColors[a.tipo]}`}>
                <a.icon className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-sm font-medium">{a.msg}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Metas */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="font-display flex items-center gap-2 text-base">
              <Target className="h-5 w-5 text-primary" />
              Metas do Mês
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {Object.values(metasCalc).map((m) => {
              const pct = Math.min(100, Math.round((m.atual / m.meta) * 100));
              const atingida = pct >= 100;
              return (
                <div key={m.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{m.label}</span>
                    <span className={`font-semibold ${atingida ? "text-green-700" : "text-muted-foreground"}`}>
                      {m.unidade === "R$" ? `R$ ${m.atual.toLocaleString("pt-BR")}` : m.atual}{m.unidade === "%" ? "%" : ""} / {m.unidade === "R$" ? `R$ ${m.meta.toLocaleString("pt-BR")}` : m.meta}{m.unidade === "%" ? "%" : ` ${m.unidade}`}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={pct} className="h-3" />
                    {atingida && (
                      <CheckCircle2 className="absolute -right-1 -top-1 h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{pct}% da meta</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Gargalos */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="font-display flex items-center gap-2 text-base">
              <Flame className="h-5 w-5 text-accent" />
              Visão de Gargalos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Pedidos acumulados por etapa × capacidade da equipe
            </p>
            {equipePorEtapa.map((e) => {
              const isGargalo = e.pedidos > 0 && e.pedidos >= 2;
              const ratio = e.membros > 0 ? e.pedidos / e.membros : e.pedidos;
              return (
                <div key={e.etapa} className={`rounded-xl border p-4 ${isGargalo ? "border-destructive/30 bg-destructive/5" : "border-border"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold uppercase text-foreground">{e.etapa}</span>
                      {isGargalo && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">GARGALO</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ClipboardList className="h-3.5 w-3.5" />
                        {e.pedidos} pedido{e.pedidos !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {e.membros} membro{e.membros !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 rounded-full bg-surface overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isGargalo ? "bg-destructive" : "bg-primary"}`}
                        style={{ width: `${Math.min(100, ratio * 50)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${isGargalo ? "text-destructive" : "text-primary"}`}>
                      {ratio.toFixed(1)}x
                    </span>
                  </div>
                  {isGargalo && (
                    <p className="mt-2 text-xs text-destructive/80">
                      <AlertCircle className="inline h-3 w-3 mr-1" />
                      Considere realocar membros da equipe ou redistribuir pedidos
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Pedidos em andamento + estoque */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Pedidos em andamento</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/pedidos">Ver todos <ArrowRight /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {pedidos.filter(p => p.etapaAtual !== "entrega").slice(0, 4).map((p) => {
              const concluidas = Object.values(p.etapas).filter((s) => s === "concluido").length;
              const pct = Math.round((concluidas / 4) * 100);
              const prazoDate = new Date(p.prazo);
              const diasRestantes = Math.ceil((prazoDate.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
              const isAtrasado = diasRestantes < 0;
              const isUrgente = diasRestantes >= 0 && diasRestantes <= 3;
              return (
                <div key={p.id} className={`rounded-xl border p-4 ${isAtrasado ? "border-destructive/30 bg-destructive/5" : isUrgente ? "border-yellow-500/30 bg-yellow-50/50" : "border-border bg-background"}`}>
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm font-semibold text-primary">{p.id}</p>
                        {isAtrasado && <Badge variant="destructive" className="text-[10px]">ATRASADO</Badge>}
                        {isUrgente && !isAtrasado && <Badge className="bg-yellow-500 text-white text-[10px]">URGENTE</Badge>}
                      </div>
                      <p className="text-sm text-foreground">{p.cliente} · {p.produto}</p>
                    </div>
                    <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent capitalize">
                      {p.etapaAtual}
                    </Badge>
                  </div>
                  <div className="h-2 rounded-full bg-surface">
                    <div className="h-full rounded-full bg-gradient-warm transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                    <span>{p.quantidade} peças · {p.responsavel ?? "Sem responsável"}</span>
                    <span className={isAtrasado ? "text-destructive font-semibold" : ""}>
                      {isAtrasado ? `${Math.abs(diasRestantes)}d atrasado` : `${diasRestantes}d restantes`}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Estoque em alerta
            </CardTitle>
          </CardHeader>
          <CardContent>
            {materiaisBaixos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tudo em dia. ✨</p>
            ) : (
              <ul className="space-y-3">
                {materiaisBaixos.map((m) => (
                  <li key={m.id} className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                    <p className="text-sm font-semibold text-foreground">{m.nome}</p>
                    <div className="mt-1.5">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-destructive">{m.estoque} {m.unidade}</span>
                        <span className="text-muted-foreground">mín. {m.minimo}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-destructive/20">
                        <div className="h-full rounded-full bg-destructive" style={{ width: `${Math.min(100, (m.estoque / m.minimo) * 100)}%` }} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Button asChild variant="soft" className="mt-4 w-full">
              <Link to="/app/materiais">Gerenciar materiais</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <QuickAction to="/app/pedidos" icon={ClipboardList} label="Novo pedido" />
        <QuickAction to="/app/materiais" icon={Boxes} label="Registrar material" />
        <QuickAction to="/app/equipe" icon={Users} label="Cadastrar membro" />
      </div>
    </div>
  );
};

const QuickAction = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
  <Link
    to={to}
    className="group flex items-center gap-3 rounded-2xl border-2 border-dashed border-primary/20 bg-surface/40 p-5 transition-all hover:border-primary hover:bg-surface"
  >
    <div className="rounded-xl bg-gradient-warm p-3 text-primary-foreground shadow-soft transition-transform group-hover:scale-110">
      <Icon className="h-5 w-5" />
    </div>
    <span className="font-display font-semibold text-foreground">{label}</span>
    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
  </Link>
);

export default DashboardHome;
