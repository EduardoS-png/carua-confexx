import { Link, useParams } from "react-router-dom";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Clock, ArrowLeft, MessageSquare, Briefcase, Award } from "lucide-react";
import { profissionais } from "@/data/mock";
import patternImg from "@/assets/pattern-chita.jpg";

const ProfissionalDetalhe = () => {
  const { id } = useParams();
  const p = profissionais.find((x) => x.id === id);

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
                <Button variant="hero" size="lg"><MessageSquare /> Entrar em contato</Button>
                <Button variant="outline" size="lg">Solicitar orçamento</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-8 lg:grid-cols-3">
          <Card className="shadow-soft">
            <CardContent className="p-6 text-center">
              <Briefcase className="mx-auto h-7 w-7 text-primary" />
              <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Pedidos concluídos</p>
              <p className="mt-1 font-display text-3xl font-bold">{p.pedidosConcluidos}</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-6 text-center">
              <Clock className="mx-auto h-7 w-7 text-accent" />
              <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Prazo médio</p>
              <p className="mt-1 font-display text-3xl font-bold">{p.prazoMedioDias} dias</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-6 text-center">
              <Award className="mx-auto h-7 w-7 text-warning" />
              <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">A partir de</p>
              <p className="mt-1 font-display text-3xl font-bold text-primary">R$ {p.precoBase}</p>
            </CardContent>
          </Card>
        </div>

        <div className="container mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="heading-display text-2xl">Serviços oferecidos</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.servicos.map((s) => (
                <Badge key={s} className="bg-surface text-surface-foreground hover:bg-surface" variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

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
      </section>

      <SiteFooter />
    </div>
  );
};

export default ProfissionalDetalhe;
