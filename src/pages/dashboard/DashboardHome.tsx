import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardList, Boxes, Wallet, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { pedidos, materiais } from "@/data/mock";
import { PageHeader } from "@/components/dashboard/PageHeader";

const DashboardHome = () => {
  const ativos = pedidos.filter((p) => p.etapaAtual !== "entrega").length;
  const pecasMes = pedidos.reduce((s, p) => s + p.quantidade, 0);
  const receita = pedidos.reduce((s, p) => s + p.quantidade * p.valorPeca, 0);
  const materiaisBaixos = materiais.filter((m) => m.estoque < m.minimo);

  const stats = [
    { label: "Pedidos ativos", value: ativos, icon: ClipboardList, color: "text-primary", bg: "bg-primary/10" },
    { label: "Peças no mês", value: pecasMes, icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
    { label: "Receita prevista", value: `R$ ${receita.toLocaleString("pt-BR")}`, icon: Wallet, color: "text-success", bg: "bg-success/10" },
    { label: "Materiais em alerta", value: materiaisBaixos.length, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Visão geral"
        description="Acompanhe a produção da sua confecção em tempo real."
      />

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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Pedidos em andamento</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/pedidos">Ver todos <ArrowRight /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {pedidos.slice(0, 4).map((p) => {
              const concluidas = Object.values(p.etapas).filter((s) => s === "concluido").length;
              const pct = Math.round((concluidas / 4) * 100);
              return (
                <div key={p.id} className="rounded-xl border border-border bg-background p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm font-semibold text-primary">{p.id}</p>
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
                    <span>{pct}%</span>
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
                    <p className="text-xs text-destructive">
                      {m.estoque} {m.unidade} · mínimo {m.minimo}
                    </p>
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
