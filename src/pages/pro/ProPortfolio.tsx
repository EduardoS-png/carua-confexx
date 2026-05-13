import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  portfolioItens as seed,
  profissionais,
  PROFISSIONAL_LOGADO_ID,
  type ItemPortfolio,
} from "@/data/mock";
import pro1 from "@/assets/pro-1.jpg";

const ProPortfolio = () => {
  const { toast } = useToast();
  const me = profissionais.find((p) => p.id === PROFISSIONAL_LOGADO_ID)!;
  const [itens, setItens] = useState<ItemPortfolio[]>(seed.filter((i) => i.profissionalId === me.id));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titulo: "", descricao: "", cliente: "", ano: new Date().getFullYear() });

  const adicionar = () => {
    if (!form.titulo || !form.descricao) {
      toast({ title: "Preencha título e descrição", variant: "destructive" });
      return;
    }
    setItens((c) => [
      { id: `po-${Date.now()}`, profissionalId: me.id, ...form, cliente: form.cliente || undefined, imagem: pro1 },
      ...c,
    ]);
    toast({ title: "Trabalho adicionado ✨" });
    setOpen(false);
    setForm({ titulo: "", descricao: "", cliente: "", ano: new Date().getFullYear() });
  };

  const remover = (id: string) => {
    setItens((c) => c.filter((i) => i.id !== id));
    toast({ title: "Removido do portfólio" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meu portfólio"
        description="Mostre o melhor do seu trabalho. Quanto mais completo, mais facções te encontram."
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline"><a href={`/marketplace/${me.id}`} target="_blank" rel="noreferrer"><Eye /> Ver como aparece</a></Button>
            <Button variant="hero" onClick={() => setOpen(true)}><Plus /> Novo trabalho</Button>
          </div>
        }
      />

      {itens.length === 0 ? (
        <Card className="shadow-soft"><CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Você ainda não cadastrou trabalhos. Comece pelo primeiro!</p>
          <Button variant="hero" className="mt-4" onClick={() => setOpen(true)}><Plus /> Adicionar trabalho</Button>
        </CardContent></Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {itens.map((it) => (
            <Card key={it.id} className="overflow-hidden shadow-soft transition-all hover:-translate-y-1 hover:shadow-warm">
              <div className="aspect-[4/3] overflow-hidden bg-surface">
                <img src={it.imagem} alt={it.titulo} className="h-full w-full object-cover" />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-semibold">{it.titulo}</h3>
                    <p className="text-xs text-muted-foreground">
                      {it.cliente ? `${it.cliente} · ` : ""}{it.ano}
                    </p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => remover(it.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{it.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo trabalho no portfólio</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Título</Label><Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ex: Lote 100 camisetas premium" /></div>
            <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Conte sobre o trabalho, técnicas usadas, etc." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Cliente (opcional)</Label><Input value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} /></div>
              <div><Label>Ano</Label><Input type="number" value={form.ano} onChange={(e) => setForm({ ...form, ano: Number(e.target.value) })} /></div>
            </div>
            <p className="text-xs text-muted-foreground">As fotos são adicionadas automaticamente neste MVP.</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="hero" onClick={adicionar}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProPortfolio;
