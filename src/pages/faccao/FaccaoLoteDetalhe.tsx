import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, PackageCheck, Truck, CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { FACCAO_LOGADA_ID, lotes, statusLoteLabel } from "@/data/mock";

const FaccaoLoteDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const lote = useMemo(() => lotes.find((l) => l.id === id && l.parceiroId === FACCAO_LOGADA_ID), [id]);

  const [avanco, setAvanco] = useState(lote?.avancoPct ?? 0);
  const [nota, setNota] = useState("");
  const [status, setStatus] = useState(lote?.status ?? "enviado");
  const [historico, setHistorico] = useState(lote?.historico ?? []);

  if (!lote) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-muted-foreground">Lote não encontrado.</p>
        <Button asChild variant="link"><Link to="/faccao/lotes">Voltar</Link></Button>
      </div>
    );
  }

  const salvarAvanco = () => {
    setHistorico((h) => [...h, { data: new Date().toISOString().slice(0, 10), texto: `Avanço atualizado para ${avanco}%${nota ? ` — ${nota}` : ""}`, autor: "Você" }]);
    if (avanco > 0 && status === "enviado") setStatus("em_producao");
    setNota("");
    toast.success("Avanço registrado.");
  };

  const marcarPronto = () => {
    setStatus("pronto");
    setAvanco(100);
    setHistorico((h) => [...h, { data: new Date().toISOString().slice(0, 10), texto: "Lote marcado como pronto para envio.", autor: "Você" }]);
    toast.success("Lote pronto! A confecção foi avisada.");
  };

  const confirmarEntrega = () => {
    setStatus("entregue");
    setHistorico((h) => [...h, { data: new Date().toISOString().slice(0, 10), texto: "Lote entregue à confecção.", autor: "Você" }]);
    toast.success("Entrega confirmada. Bom trabalho! 🧡");
    setTimeout(() => navigate("/faccao/lotes"), 800);
  };

  const atrasado = status === "atrasado";

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/faccao/lotes"><ArrowLeft className="mr-1 h-4 w-4" /> Voltar aos lotes</Link>
      </Button>

      <Card className="overflow-hidden">
        <div className={`h-1.5 ${atrasado ? "bg-destructive" : status === "pronto" ? "bg-accent" : "bg-gradient-warm"}`} />
        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Lote {lote.id} · Ordem {lote.ordemId}</p>
              <h1 className="font-display text-2xl font-extrabold">{lote.produto}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline" className="uppercase">{lote.etapa}</Badge>
                <Badge>{lote.quantidade} peças</Badge>
                <Badge variant="secondary">R$ {lote.valorPeca.toFixed(2)}/peça</Badge>
                <Badge variant="secondary">Total R$ {(lote.valorPeca * lote.quantidade).toFixed(2)}</Badge>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={atrasado ? "destructive" : status === "pronto" || status === "entregue" ? "default" : "secondary"} className="mb-1">
                {statusLoteLabel[status]}
              </Badge>
              <p className="text-xs text-muted-foreground">Prazo {new Date(lote.prazo).toLocaleDateString("pt-BR")}</p>
              <p className="text-xs text-muted-foreground">Recebido {new Date(lote.enviadoEm).toLocaleDateString("pt-BR")}</p>
            </div>
          </div>

          {lote.observacoes && (
            <div className="mt-4 rounded-xl bg-surface/50 p-3 text-sm">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Instruções da confecção</p>
              {lote.observacoes}
            </div>
          )}
        </div>
      </Card>

      {status !== "entregue" && (
        <Card className="p-5">
          <h3 className="font-display text-base font-bold">Atualizar andamento</h3>
          <p className="mt-1 text-xs text-muted-foreground">Informe o quanto do lote já foi produzido.</p>

          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progresso</span>
                <span className="font-display text-2xl font-bold">{avanco}%</span>
              </div>
              <Slider value={[avanco]} onValueChange={(v) => setAvanco(v[0])} min={0} max={100} step={5} />
              <Progress value={avanco} className="mt-2 h-2" />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <MessageSquare className="h-3 w-3" /> Nota (opcional)
              </label>
              <Textarea rows={2} value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ex: pausa por falta de linha, terminada primeira remessa..." />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={salvarAvanco} className="flex-1">Salvar avanço</Button>
              {status !== "pronto" && (
                <Button onClick={marcarPronto} variant="secondary" className="flex-1">
                  <CheckCircle2 className="mr-1.5 h-4 w-4" /> Marcar pronto p/ envio
                </Button>
              )}
              {status === "pronto" && (
                <Button onClick={confirmarEntrega} variant="default" className="flex-1 bg-accent hover:bg-accent/90">
                  <Truck className="mr-1.5 h-4 w-4" /> Confirmar entrega
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      <Card className="p-5">
        <h3 className="font-display text-base font-bold">Histórico</h3>
        <div className="mt-3 space-y-3">
          {historico.slice().reverse().map((h, i) => (
            <div key={i} className="flex gap-3 border-l-2 border-primary/30 pl-3">
              <div className="flex-1">
                <p className="text-sm">{h.texto}</p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(h.data).toLocaleDateString("pt-BR")}{h.autor ? ` · ${h.autor}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FaccaoLoteDetalhe;
