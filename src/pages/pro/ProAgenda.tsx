import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { profissionais, pedidosConexao, PROFISSIONAL_LOGADO_ID, type Profissional } from "@/data/mock";

const ProAgenda = () => {
  const { toast } = useToast();
  const me = profissionais.find((p) => p.id === PROFISSIONAL_LOGADO_ID)!;
  const [disp, setDisp] = useState<Profissional["disponibilidade"]>(me.disponibilidade);

  const meusPedidos = pedidosConexao.filter((p) => p.profissionalId === me.id);
  const ativos = meusPedidos.filter((p) => p.status === "aceito" || p.status === "negociando");
  const pecasComprometidas = ativos.reduce((acc, p) => acc + p.quantidade, 0);
  const ocupacao = Math.min(100, Math.round((pecasComprometidas / me.capacidadePecasMes) * 100));

  const ordenados = [...ativos].sort((a, b) => a.prazo.localeCompare(b.prazo));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Minha agenda"
        description="Controle sua disponibilidade e veja quanto da sua capacidade já está comprometida."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-bold">Compromissos firmados</h2>
            {ordenados.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Nenhum compromisso ativo.</p>
            ) : (
              <ul className="mt-4 divide-y divide-border">
                {ordenados.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-semibold"><Building2 className="h-4 w-4 text-primary" /> {p.faccaoNome}</p>
                      <p className="truncate text-sm text-muted-foreground">{p.servico}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-surface text-foreground hover:bg-surface">{p.quantidade} peças</Badge>
                      <p className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" /> entrega {p.prazo}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-bold">Disponibilidade</h2>
              <p className="mt-1 text-sm text-muted-foreground">Aparece no seu perfil público.</p>
              <Select
                value={disp}
                onValueChange={(v) => {
                  setDisp(v as Profissional["disponibilidade"]);
                  toast({ title: "Disponibilidade atualizada" });
                }}
              >
                <SelectTrigger className="mt-3"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="imediata">Disponível agora</SelectItem>
                  <SelectItem value="1_semana">Em até 1 semana</SelectItem>
                  <SelectItem value="2_semanas">Em até 2 semanas</SelectItem>
                  <SelectItem value="agendar">Apenas agendamento</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-bold">Ocupação do mês</h2>
              <div className="mt-3 flex items-end justify-between">
                <p className="font-display text-3xl font-bold">{ocupacao}%</p>
                <p className="text-xs text-muted-foreground">{pecasComprometidas} / {me.capacidadePecasMes} peças</p>
              </div>
              <Progress value={ocupacao} className="mt-3 h-2" />
              <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> Restam {Math.max(0, me.capacidadePecasMes - pecasComprometidas)} peças disponíveis.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProAgenda;
