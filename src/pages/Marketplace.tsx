import { Link } from "react-router-dom";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, MapPin, Search, Clock, ArrowRight, Award, Package, CheckCircle2 } from "lucide-react";
import { profissionais } from "@/data/mock";
import patternImg from "@/assets/pattern-chita.jpg";

const Marketplace = () => {
  const [q, setQ] = useState("");
  const lista = profissionais.filter(
    (p) =>
      p.nome.toLowerCase().includes(q.toLowerCase()) ||
      p.especialidade.toLowerCase().includes(q.toLowerCase()) ||
      p.servicos.some((s) => s.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden bg-gradient-sunset py-16">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: `url(${patternImg})`, backgroundSize: "300px" }} aria-hidden />
        <div className="container relative max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Marketplace</span>
          <h1 className="heading-display mt-3 text-4xl text-foreground md:text-5xl">
            Profissionais do agreste pernambucano
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Costureiras, cortadores, bordadeiras e modelistas com portfólio digital.
            Encontre quem combina com seu projeto.
          </p>
          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft">
            <Search className="ml-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por especialidade, serviço ou nome..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container">
          <p className="mb-6 text-sm text-muted-foreground">{lista.length} profissionais disponíveis</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lista.map((p) => {
              const dispLabel = {
                imediata: "Disponível agora",
                "1_semana": "Em até 1 semana",
                "2_semanas": "Em até 2 semanas",
                agendar: "Agendar",
              }[p.disponibilidade];
              const dispCor = p.disponibilidade === "imediata" ? "text-success" : "text-accent";
              return (
              <Card key={p.id} className="overflow-hidden shadow-soft transition-all hover:-translate-y-1 hover:shadow-warm">
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  <img src={p.foto} alt={p.nome} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute right-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-xs font-semibold backdrop-blur">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" /> {p.avaliacao} <span className="text-muted-foreground">({p.pedidosConcluidos})</span></span>
                  </div>
                  <div className={`absolute left-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${dispCor}`}>
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {dispLabel}</span>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-display text-lg font-semibold">{p.nome}</h3>
                  <p className="text-sm text-primary">{p.especialidade}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {p.cidade}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-surface/60 p-2.5 text-xs">
                    <div className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-primary" /> {p.experienciaAnos} anos exp.</div>
                    <div className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5 text-accent" /> {p.capacidadePecasMes}/mês</div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.servicos.slice(0, 3).map((s) => (
                      <Badge key={s} variant="outline" className="border-primary/20 bg-surface text-xs">{s}</Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">A partir de</p>
                      <p className="font-display text-lg font-bold text-primary">R$ {p.precoBase}<span className="text-xs font-normal text-muted-foreground">/peça</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Prazo médio</p>
                      <p className="flex items-center justify-end gap-1 text-sm font-semibold"><Clock className="h-3.5 w-3.5" /> {p.prazoMedioDias} dias</p>
                    </div>
                  </div>
                  <Button asChild variant="hero" className="mt-4 w-full">
                    <Link to={`/marketplace/${p.id}`}>Ver portfólio <ArrowRight /></Link>
                  </Button>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Marketplace;
