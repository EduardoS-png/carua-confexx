import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Plus, ExternalLink } from "lucide-react";
import { profissionais, pedidos } from "@/data/mock";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Link } from "react-router-dom";

const Profissionais = () => {
  const tarefasPorProf = (nome: string) => pedidos.filter((p) => p.responsavel === nome).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profissionais"
        description="Sua equipe de produção e quem está em cada tarefa."
        action={<Button variant="hero" size="lg"><Plus /> Cadastrar</Button>}
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {profissionais.map((p) => {
          const tarefas = tarefasPorProf(p.nome);
          return (
            <Card key={p.id} className="overflow-hidden shadow-soft transition-all hover:-translate-y-1 hover:shadow-warm">
              <div className="aspect-[4/3] overflow-hidden bg-surface">
                <img src={p.foto} alt={p.nome} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{p.nome}</h3>
                    <p className="text-sm text-primary">{p.especialidade}</p>
                  </div>
                  <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
                    <Star className="h-3 w-3 fill-warning text-warning" /> {p.avaliacao}
                  </Badge>
                </div>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {p.cidade}
                </p>
                <div className="mt-4 flex items-center justify-between rounded-lg bg-surface px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Tarefas atuais</span>
                  <span className="font-display font-bold text-primary">{tarefas}</span>
                </div>
                <Button asChild variant="soft" size="sm" className="mt-3 w-full">
                  <Link to={`/marketplace/${p.id}`}>Ver perfil público <ExternalLink className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Profissionais;
