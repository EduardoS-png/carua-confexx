import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Package, AlertTriangle, CheckCircle2, Clock, Send } from "lucide-react";
import { lotes, parceiros, statusLoteLabel, StatusLote } from "@/data/mock";

const colunas: { status: StatusLote; label: string; icone: any; cor: string }[] = [
  { status: "enviado", label: "Enviados", icone: Send, cor: "text-muted-foreground" },
  { status: "em_producao", label: "Em produção", icone: Clock, cor: "text-primary" },
  { status: "pronto", label: "Prontos", icone: CheckCircle2, cor: "text-accent" },
  { status: "atrasado", label: "Atrasados", icone: AlertTriangle, cor: "text-destructive" },
  { status: "entregue", label: "Entregues", icone: Package, cor: "text-foreground" },
];

const Lotes = () => {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Lotes distribuídos"
        description="Acompanhe cada etapa terceirizada da sua produção: quem está executando, andamento e prazo."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        {colunas.map((c) => {
          const list = lotes.filter((l) => l.status === c.status);
          return (
            <div key={c.status} className="flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-lg bg-surface/50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <c.icone className={`h-4 w-4 ${c.cor}`} />
                  <span className="text-xs font-semibold uppercase tracking-wider">{c.label}</span>
                </div>
                <Badge variant="secondary">{list.length}</Badge>
              </div>
              <div className="flex flex-col gap-2">
                {list.length === 0 && <p className="rounded-lg border border-dashed border-border p-3 text-center text-[11px] text-muted-foreground">vazio</p>}
                {list.map((l) => {
                  const p = parceiros.find((pp) => pp.id === l.parceiroId);
                  return (
                    <Card key={l.id} className="p-3 text-sm">
                      <p className="line-clamp-1 font-display text-[13px] font-bold">{l.produto}</p>
                      <p className="text-[10px] text-muted-foreground">Lote {l.id} · {l.quantidade}pçs</p>
                      <Badge variant="outline" className="mt-1.5 text-[10px] uppercase">{l.etapa}</Badge>
                      <div className="mt-2 border-t border-border/50 pt-2">
                        <p className="line-clamp-1 text-[11px] font-medium">{p?.nome}</p>
                        <p className="text-[10px] text-muted-foreground">{p?.cidade}</p>
                      </div>
                      {l.status !== "entregue" && (
                        <div className="mt-2">
                          <Progress value={l.avancoPct} className="h-1" />
                          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                            <span>{l.avancoPct}%</span>
                            <span>Prazo {new Date(l.prazo).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Lotes;
