import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, ArrowDown, ArrowUp, Link2 } from "lucide-react";
import { materiais as initialMateriais, pedidos, type Material } from "@/data/mock";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { toast } from "sonner";

const Materiais = () => {
  const [lista, setLista] = useState<Material[]>(initialMateriais);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", unidade: "un", estoque: "", minimo: "" });

  const movimentar = (id: string, delta: number) => {
    setLista((prev) => prev.map((m) => m.id === id ? { ...m, estoque: Math.max(0, m.estoque + delta), ultimaEntrada: new Date().toISOString().slice(0, 10) } : m));
    toast.success(delta > 0 ? "Entrada registrada" : "Saída registrada");
  };

  const criar = () => {
    if (!form.nome) return toast.error("Informe o nome do material");
    const novo: Material = {
      id: `M${lista.length + 1}`,
      nome: form.nome,
      unidade: form.unidade,
      estoque: Number(form.estoque) || 0,
      minimo: Number(form.minimo) || 0,
      ultimaEntrada: new Date().toISOString().slice(0, 10),
    };
    setLista([novo, ...lista]);
    setForm({ nome: "", unidade: "un", estoque: "", minimo: "" });
    setOpen(false);
    toast.success("Material cadastrado");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Materiais"
        description="Controle entradas, saídas e vincule insumos a pedidos."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="hero" size="lg"><Plus /> Novo material</Button></DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle className="font-display">Cadastrar material</DialogTitle></DialogHeader>
              <div className="grid gap-3 py-2">
                <div><Label>Nome</Label><Input className="mt-1.5" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Tecido algodão" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Unidade</Label><Input className="mt-1.5" value={form.unidade} onChange={(e) => setForm({ ...form, unidade: e.target.value })} /></div>
                  <div><Label>Estoque</Label><Input className="mt-1.5" type="number" value={form.estoque} onChange={(e) => setForm({ ...form, estoque: e.target.value })} /></div>
                  <div><Label>Mínimo</Label><Input className="mt-1.5" type="number" value={form.minimo} onChange={(e) => setForm({ ...form, minimo: e.target.value })} /></div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button variant="hero" onClick={criar}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {lista.map((m) => {
          const baixo = m.estoque < m.minimo;
          const pedido = pedidos.find((p) => p.id === m.vinculadoA);
          return (
            <Card key={m.id} className={`shadow-soft ${baixo ? "border-destructive/40" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{m.nome}</h3>
                    <p className="text-xs text-muted-foreground">Atualizado em {new Date(m.ultimaEntrada).toLocaleDateString("pt-BR")}</p>
                  </div>
                  {baixo && <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">Estoque baixo</Badge>}
                </div>

                <div className="my-4 flex items-end gap-3">
                  <span className="font-display text-4xl font-bold text-primary">{m.estoque}</span>
                  <span className="pb-1 text-sm text-muted-foreground">{m.unidade} · mín. {m.minimo}</span>
                </div>

                {pedido && (
                  <div className="mb-3 flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-xs">
                    <Link2 className="h-3.5 w-3.5 text-primary" />
                    <span>Vinculado a <span className="font-mono font-semibold text-primary">{pedido.id}</span> · {pedido.produto}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="soft" className="flex-1" onClick={() => movimentar(m.id, 10)}>
                    <ArrowDown className="text-success" /> Entrada
                  </Button>
                  <Button size="sm" variant="soft" className="flex-1" onClick={() => movimentar(m.id, -1)}>
                    <ArrowUp className="text-destructive" /> Saída
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Materiais;
