import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Wallet, Receipt } from "lucide-react";
import { pedidos, equipe } from "@/data/mock";
import { PageHeader } from "@/components/dashboard/PageHeader";

const Financeiro = () => {
  const total = pedidos.reduce((s, p) => s + p.quantidade * p.valorPeca, 0);
  const concluidos = pedidos.filter((p) => p.etapas.entrega === "concluido");
  const recebido = concluidos.reduce((s, p) => s + p.quantidade * p.valorPeca, 0);
  const pendente = total - recebido;

  // Pagamentos por membro da equipe (valor por peça definido no cadastro)
  const porProfissional: Record<string, number> = {};
  pedidos.forEach((p) => {
    if (!p.responsavel) return;
    const membro = equipe.find((m) => m.nome === p.responsavel);
    if (!membro) return;
    porProfissional[p.responsavel] = (porProfissional[p.responsavel] ?? 0) + p.quantidade * membro.pagamentoPorPeca;
  });

  const cards = [
    { label: "Receita total prevista", value: total, icon: TrendingUp, color: "from-primary to-primary-glow" },
    { label: "Recebido", value: recebido, icon: Wallet, color: "from-success to-success" },
    { label: "Pendente", value: pendente, icon: Receipt, color: "from-accent to-warning" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Financeiro" description="Acompanhe receitas e pagamentos por produção." />

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="overflow-hidden shadow-soft">
            <CardContent className="p-0">
              <div className={`bg-gradient-to-br ${c.color} p-5 text-primary-foreground`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase opacity-90">{c.label}</p>
                  <c.icon className="h-5 w-5 opacity-90" />
                </div>
                <p className="mt-3 font-display text-3xl font-bold">
                  R$ {c.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="font-display">Pagamento por pedido</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {pedidos.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div>
                  <p className="font-mono text-sm font-bold text-primary">{p.id}</p>
                  <p className="text-xs text-muted-foreground">{p.quantidade} × R$ {p.valorPeca.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold">R$ {(p.quantidade * p.valorPeca).toLocaleString("pt-BR")}</p>
                  {p.etapas.entrega === "concluido"
                    ? <Badge className="bg-success/15 text-success border-success/30" variant="outline">Pago</Badge>
                    : <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent">A receber</Badge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle className="font-display">A pagar aos profissionais</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(porProfissional).map(([nome, valor]) => (
              <div key={nome} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-warm font-display font-bold text-primary-foreground">
                    {nome[0]}
                  </div>
                  <span className="font-medium">{nome}</span>
                </div>
                <span className="font-display text-lg font-bold text-primary">
                  R$ {valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
            <p className="pt-2 text-xs text-muted-foreground">* Cálculo: valor por peça definido no cadastro de cada membro da equipe × quantidade do pedido.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Financeiro;
