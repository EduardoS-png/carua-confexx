import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, MapPin, Clock, ArrowLeft, MessageSquare, Briefcase, Award, Package, Phone, Mail, Wrench, CheckCircle2, CreditCard, Send } from "lucide-react";
import { profissionais } from "@/data/mock";
import { useToast } from "@/hooks/use-toast";
import patternImg from "@/assets/pattern-chita.jpg";

const ProfissionalDetalhe = () => {
  const { id } = useParams();
  const p = profissionais.find((x) => x.id === id);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ servico: "", quantidade: "", valor: "", prazo: "", mensagem: "" });
  const enviar = () => {
    if (!form.servico || !form.quantidade || !form.prazo) {
      toast({ title: "Preencha os campos principais", variant: "destructive" });
      return;
    }
    toast({ title: "Pedido enviado 🎉", description: `${p?.nome} vai receber sua proposta.` });
    setOpen(false);
    setForm({ servico: "", quantidade: "", valor: "", prazo: "", mensagem: "" });
  };

  if (!p) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Profissional não encontrado.</p>
          <Button asChild variant="hero" className="mt-4"><Link to="/marketplace">Voltar</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden bg-gradient-sunset pb-16 pt-10">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url(${patternImg})`, backgroundSize: "260px" }} aria-hidden />
        <div className="container relative">
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link to="/marketplace"><ArrowLeft /> Voltar para marketplace</Link>
          </Button>

          <div className="grid gap-10 md:grid-cols-[260px_1fr] md:items-center">
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-3xl border-4 border-card bg-surface shadow-warm">
                <img src={p.foto} alt={p.nome} className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-3 -right-3 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground shadow-glow">
                <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-current" /> {p.avaliacao}</span>
              </div>
            </div>

            <div>
              <h1 className="heading-display text-4xl text-foreground md:text-5xl">{p.nome}</h1>
              <p className="mt-2 text-xl text-primary">{p.especialidade}</p>
              <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {p.cidade}
              </p>
              <p className="mt-5 max-w-2xl text-lg text-foreground">{p.bio}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="hero" size="lg" onClick={() => setOpen(true)}><Send /> Solicitar conexão</Button>
                <Button variant="outline" size="lg" onClick={() => setOpen(true)}><MessageSquare /> Enviar proposta</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-soft">
            <CardContent className="p-5 text-center">
              <Briefcase className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Pedidos concluídos</p>
              <p className="mt-1 font-display text-2xl font-bold">{p.pedidosConcluidos}</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-5 text-center">
              <Award className="mx-auto h-6 w-6 text-warning" />
              <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Experiência</p>
              <p className="mt-1 font-display text-2xl font-bold">{p.experienciaAnos} anos</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-5 text-center">
              <Package className="mx-auto h-6 w-6 text-accent" />
              <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Capacidade</p>
              <p className="mt-1 font-display text-2xl font-bold">{p.capacidadePecasMes}<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-5 text-center">
              <Clock className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Prazo médio</p>
              <p className="mt-1 font-display text-2xl font-bold">{p.prazoMedioDias} dias</p>
            </CardContent>
          </Card>
        </div>

        <div className="container mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <div>
              <h2 className="heading-display text-2xl">Serviços oferecidos</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.servicos.map((s) => (
                  <Badge key={s} className="bg-surface text-surface-foreground hover:bg-surface" variant="secondary">{s}</Badge>
                ))}
              </div>
            </div>

            {p.maquinario && p.maquinario.length > 0 && (
              <div>
                <h2 className="heading-display text-2xl">Maquinário disponível</h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {p.maquinario.map((m) => (
                    <div key={m} className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-sm">
                      <Wrench className="h-4 w-4 text-primary" /> {m}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {p.certificacoes && p.certificacoes.length > 0 && (
              <div>
                <h2 className="heading-display text-2xl">Certificações</h2>
                <ul className="mt-4 space-y-2">
                  {p.certificacoes.map((c) => (
                    <li key={c} className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h2 className="heading-display text-2xl">Trabalhos realizados</h2>
              <ul className="mt-4 space-y-2">
                {p.portfolio.map((t, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
                    <span className="text-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-4">
            <Card className="shadow-warm">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">A partir de</p>
                <p className="font-display text-3xl font-bold text-primary">R$ {p.precoBase}<span className="text-base font-normal text-muted-foreground">/peça</span></p>
                <Button variant="hero" size="lg" className="mt-4 w-full" onClick={() => setOpen(true)}><Send /> Solicitar conexão</Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">Resposta em até 24h</p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="space-y-3 p-5 text-sm">
                <h3 className="font-display text-base font-semibold">Contato</h3>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {p.contato.telefone}</p>
                {p.contato.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {p.contato.email}</p>}
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="space-y-3 p-5 text-sm">
                <h3 className="font-display text-base font-semibold">Formas de pagamento</h3>
                <div className="flex flex-wrap gap-1.5">
                  {p.formaPagamento.map((f) => (
                    <Badge key={f} variant="outline" className="border-primary/20 bg-surface">
                      <CreditCard className="mr-1 h-3 w-3" /> {f}
                    </Badge>
                  ))}
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground">Atendimento remoto</p>
                  <p className="font-semibold">{p.atendeRemoto ? "Sim, envia para outras cidades" : "Apenas atendimento local"}</p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar conexão com {p?.nome}</DialogTitle>
            <DialogDescription>
              Envie uma proposta. {p?.nome.split(" ")[0]} responde em até 24h.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Serviço desejado</Label>
              <Input value={form.servico} onChange={(e) => setForm({ ...form, servico: e.target.value })} placeholder="Ex: Costura de 100 camisetas" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Quantidade</Label>
                <Input type="number" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} />
              </div>
              <div>
                <Label>Valor (R$)</Label>
                <Input type="number" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} />
              </div>
              <div>
                <Label>Prazo</Label>
                <Input type="date" value={form.prazo} onChange={(e) => setForm({ ...form, prazo: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Mensagem</Label>
              <Textarea rows={4} value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} placeholder="Conte mais sobre o trabalho..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="hero" onClick={enviar}><Send /> Enviar pedido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
};

export default ProfissionalDetalhe;
