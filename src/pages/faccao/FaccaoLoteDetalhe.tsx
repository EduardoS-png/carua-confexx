import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  ArrowLeft, Truck, CheckCircle2, MessageSquare, Building2, Store, UserPlus, Star, ExternalLink, UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { FACCAO_LOGADA_ID, lotes, statusLoteLabel, profissionais, type SubcontratadoLote } from "@/data/mock";

const FaccaoLoteDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const lote = useMemo(() => lotes.find((l) => l.id === id && l.parceiroId === FACCAO_LOGADA_ID), [id]);

  const [avanco, setAvanco] = useState(lote?.avancoPct ?? 0);
  const [nota, setNota] = useState("");
  const [status, setStatus] = useState(lote?.status ?? "enviado");
  const [historico, setHistorico] = useState(lote?.historico ?? []);
  const [subs, setSubs] = useState<SubcontratadoLote[]>(lote?.subcontratados ?? []);
  const [openConvidar, setOpenConvidar] = useState(false);
  const [convite, setConvite] = useState({ profissionalId: "", papel: "", pecas: "" });

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
    toast.success("Avanço registrado. A confecção coordenadora foi notificada.");
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

  const enviarConvite = () => {
    if (!convite.profissionalId || !convite.papel) return toast.error("Escolha o profissional e o papel");
    const novo: SubcontratadoLote = {
      profissionalId: convite.profissionalId,
      papel: convite.papel,
      pecas: Number(convite.pecas) || 0,
      status: "convidado",
    };
    setSubs((s) => [...s, novo]);
    const prof = profissionais.find((p) => p.id === convite.profissionalId);
    setHistorico((h) => [...h, { data: new Date().toISOString().slice(0, 10), texto: `Profissional autônomo convidado: ${prof?.nome} — ${convite.papel}.`, autor: "Você" }]);
    setConvite({ profissionalId: "", papel: "", pecas: "" });
    setOpenConvidar(false);
    toast.success(`Convite enviado para ${prof?.nome}`);
  };

  const atrasado = status === "atrasado";
  const jaConvidados = new Set(subs.map((s) => s.profissionalId));
  const disponiveis = profissionais.filter((p) => !jaConvidados.has(p.id));

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

          {/* Confecção coordenadora — origem do lote */}
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Confecção coordenadora</p>
              <p className="truncate font-display font-bold">{lote.confeccaoNome}</p>
              <p className="text-xs text-muted-foreground">Enviou este lote e receberá as atualizações de progresso em tempo real.</p>
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
          <p className="mt-1 text-xs text-muted-foreground">Informe o quanto do lote já foi produzido — a confecção enxerga em tempo real.</p>

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

      {/* Integração com Marketplace — profissionais autônomos ajudando neste lote */}
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 font-display text-base font-bold">
              <Store className="h-4 w-4 text-accent" /> Reforço do marketplace
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Precisa acelerar? Convide profissionais autônomos do marketplace para dividir peças deste lote.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/marketplace" target="_blank"><ExternalLink className="mr-1 h-3.5 w-3.5" /> Explorar</Link>
            </Button>
            <Dialog open={openConvidar} onOpenChange={setOpenConvidar}>
              <DialogTrigger asChild>
                <Button size="sm"><UserPlus className="mr-1 h-3.5 w-3.5" /> Convidar</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle className="font-display">Convidar profissional para o lote</DialogTitle></DialogHeader>
                <div className="grid gap-3 py-2">
                  <div>
                    <Label>Profissional</Label>
                    <select
                      value={convite.profissionalId}
                      onChange={(e) => setConvite({ ...convite, profissionalId: e.target.value })}
                      className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Selecione...</option>
                      {disponiveis.map((p) => (
                        <option key={p.id} value={p.id}>{p.nome} — {p.especialidade} ({p.cidade})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Papel neste lote</Label>
                    <Input
                      className="mt-1.5"
                      value={convite.papel}
                      onChange={(e) => setConvite({ ...convite, papel: e.target.value })}
                      placeholder="Ex: reforço de costura, bainha, casa de botão..."
                    />
                  </div>
                  <div>
                    <Label>Peças que vão com ele(a)</Label>
                    <Input
                      className="mt-1.5"
                      type="number"
                      value={convite.pecas}
                      onChange={(e) => setConvite({ ...convite, pecas: e.target.value })}
                      placeholder="Ex: 40"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpenConvidar(false)}>Cancelar</Button>
                  <Button onClick={enviarConvite}>Enviar convite</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {subs.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Nenhum profissional convidado ainda para este lote.
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {subs.map((sub, i) => {
              const prof = profissionais.find((p) => p.id === sub.profissionalId);
              if (!prof) return null;
              const statusCfg = {
                convidado: { label: "Aguardando resposta", cls: "border-warning/30 bg-warning/10 text-warning" },
                confirmado: { label: "Confirmado", cls: "border-primary/30 bg-primary/10 text-primary" },
                concluido: { label: "Concluído", cls: "border-success/30 bg-success/10 text-success" },
              }[sub.status];
              return (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border p-3">
                  <img src={prof.foto} alt={prof.nome} className="h-11 w-11 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold">{prof.nome}</p>
                      <Badge variant="outline" className={`shrink-0 text-[10px] ${statusCfg.cls}`}>{statusCfg.label}</Badge>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{prof.especialidade} · {prof.cidade}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Star className="h-3 w-3 fill-warning text-warning" /> {prof.avaliacao} · {sub.pecas} peça(s)
                    </p>
                    <p className="mt-1 text-xs">{sub.papel}</p>
                    <Link to={`/marketplace/${prof.id}`} className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      <UserRound className="h-3 w-3" /> Ver perfil
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

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
