import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Building2, Search, Star, Phone, Plus } from "lucide-react";
import { parceiros, tipoParceiroLabel, TipoParceiro } from "@/data/mock";
import { toast } from "sonner";

const filtros: { id: "todos" | TipoParceiro; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "faccao", label: "Facções" },
  { id: "estamparia", label: "Estamparias" },
  { id: "lavanderia", label: "Lavanderias" },
  { id: "bordado", label: "Bordados" },
  { id: "corte", label: "Corte" },
];

const Parceiros = () => {
  const [busca, setBusca] = useState("");
  const [aba, setAba] = useState<"todos" | TipoParceiro>("todos");
  const filtrados = parceiros
    .filter((p) => (aba === "todos" ? true : p.tipo === aba))
    .filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()) || p.cidade.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Parceiros produtivos"
        description="Facções, estamparias, lavanderias e serviços que executam etapas da sua produção."
        action={
          <Button onClick={() => toast.info("Convite de parceiro em breve.")}>
            <Plus className="mr-1 h-4 w-4" /> Convidar parceiro
          </Button>
        }
      />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou cidade..." className="h-11 pl-9" />
      </div>

      <Tabs value={aba} onValueChange={(v) => setAba(v as any)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {filtros.map((f) => (
            <TabsTrigger key={f.id} value={f.id}>{f.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-3 md:grid-cols-2">
        {filtrados.map((p) => (
          <Card key={p.id} className="p-4 transition-all hover:border-primary/40 hover:shadow-soft">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-bold">{p.nome}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.cidade} · {p.responsavel}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {p.avaliacao.toFixed(1)}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="outline">{tipoParceiroLabel[p.tipo]}</Badge>
                  <Badge variant="secondary">{p.capacidadeMes} peças/mês</Badge>
                  {p.lotesEmAndamento > 0 && <Badge>{p.lotesEmAndamento} ativos</Badge>}
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" /> {p.contato}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Parceiros;
