import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { profissionais, PROFISSIONAL_LOGADO_ID, type Profissional } from "@/data/mock";

type Perfil = Pick<Profissional,
  "nome" | "especialidade" | "cidade" | "bio" | "servicos" | "precoBase" |
  "prazoMedioDias" | "capacidadePecasMes" | "experienciaAnos" | "maquinario" |
  "certificacoes" | "formaPagamento" | "atendeRemoto" | "disponibilidade"
> & { telefone: string; email: string };

const ProPerfil = () => {
  const { toast } = useToast();
  const me = profissionais.find((p) => p.id === PROFISSIONAL_LOGADO_ID)!;
  const [p, setP] = useState<Perfil>({
    nome: me.nome,
    especialidade: me.especialidade,
    cidade: me.cidade,
    bio: me.bio,
    servicos: [...me.servicos],
    precoBase: me.precoBase,
    prazoMedioDias: me.prazoMedioDias,
    capacidadePecasMes: me.capacidadePecasMes,
    experienciaAnos: me.experienciaAnos,
    maquinario: [...(me.maquinario ?? [])],
    certificacoes: [...(me.certificacoes ?? [])],
    formaPagamento: [...me.formaPagamento],
    atendeRemoto: me.atendeRemoto,
    disponibilidade: me.disponibilidade,
    telefone: me.contato.telefone,
    email: me.contato.email ?? "",
  });

  const [novo, setNovo] = useState({ servico: "", maquina: "", cert: "", pag: "" });

  const addChip = (key: "servicos" | "maquinario" | "certificacoes" | "formaPagamento", val: string) => {
    if (!val.trim()) return;
    setP({ ...p, [key]: [...(p[key] as string[]), val.trim()] });
  };
  const rmChip = (key: "servicos" | "maquinario" | "certificacoes" | "formaPagamento", idx: number) => {
    setP({ ...p, [key]: (p[key] as string[]).filter((_, i) => i !== idx) });
  };

  const salvar = () => toast({ title: "Perfil atualizado ✨", description: "Suas alterações foram salvas." });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meu perfil"
        description="Mantenha suas informações sempre atualizadas para fechar mais pedidos."
        action={<Button variant="hero" onClick={salvar}><Save /> Salvar alterações</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardContent className="space-y-4 p-6">
            <h2 className="font-display text-lg font-bold">Identificação</h2>
            <div><Label>Nome</Label><Input value={p.nome} onChange={(e) => setP({ ...p, nome: e.target.value })} /></div>
            <div><Label>Especialidade</Label><Input value={p.especialidade} onChange={(e) => setP({ ...p, especialidade: e.target.value })} /></div>
            <div><Label>Cidade</Label><Input value={p.cidade} onChange={(e) => setP({ ...p, cidade: e.target.value })} /></div>
            <div><Label>Bio</Label><Textarea rows={4} value={p.bio} onChange={(e) => setP({ ...p, bio: e.target.value })} /></div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="space-y-4 p-6">
            <h2 className="font-display text-lg font-bold">Contato e disponibilidade</h2>
            <div><Label>Telefone</Label><Input value={p.telefone} onChange={(e) => setP({ ...p, telefone: e.target.value })} /></div>
            <div><Label>E-mail</Label><Input type="email" value={p.email} onChange={(e) => setP({ ...p, email: e.target.value })} /></div>
            <div>
              <Label>Disponibilidade atual</Label>
              <Select value={p.disponibilidade} onValueChange={(v) => setP({ ...p, disponibilidade: v as Perfil["disponibilidade"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="imediata">Disponível agora</SelectItem>
                  <SelectItem value="1_semana">Em até 1 semana</SelectItem>
                  <SelectItem value="2_semanas">Em até 2 semanas</SelectItem>
                  <SelectItem value="agendar">Apenas agendamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">Atende remoto</p>
                <p className="text-xs text-muted-foreground">Aceita envios para outras cidades</p>
              </div>
              <Switch checked={p.atendeRemoto} onCheckedChange={(v) => setP({ ...p, atendeRemoto: v })} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft lg:col-span-2">
          <CardContent className="space-y-4 p-6">
            <h2 className="font-display text-lg font-bold">Capacidade e preços</h2>
            <div className="grid gap-4 sm:grid-cols-4">
              <div><Label>Preço base (R$/peça)</Label><Input type="number" value={p.precoBase} onChange={(e) => setP({ ...p, precoBase: Number(e.target.value) })} /></div>
              <div><Label>Prazo médio (dias)</Label><Input type="number" value={p.prazoMedioDias} onChange={(e) => setP({ ...p, prazoMedioDias: Number(e.target.value) })} /></div>
              <div><Label>Capacidade (peças/mês)</Label><Input type="number" value={p.capacidadePecasMes} onChange={(e) => setP({ ...p, capacidadePecasMes: Number(e.target.value) })} /></div>
              <div><Label>Anos de experiência</Label><Input type="number" value={p.experienciaAnos} onChange={(e) => setP({ ...p, experienciaAnos: Number(e.target.value) })} /></div>
            </div>
          </CardContent>
        </Card>

        {([
          { key: "servicos", title: "Serviços oferecidos", input: "servico", placeholder: "Ex: Costura overlock" },
          { key: "maquinario", title: "Maquinário", input: "maquina", placeholder: "Ex: Reta industrial" },
          { key: "certificacoes", title: "Certificações", input: "cert", placeholder: "Ex: SENAI - Costura" },
          { key: "formaPagamento", title: "Formas de pagamento", input: "pag", placeholder: "Ex: PIX" },
        ] as const).map((bloco) => (
          <Card key={bloco.key} className="shadow-soft">
            <CardContent className="space-y-4 p-6">
              <h2 className="font-display text-lg font-bold">{bloco.title}</h2>
              <div className="flex flex-wrap gap-2">
                {(p[bloco.key] as string[]).map((v, i) => (
                  <Badge key={`${v}-${i}`} variant="outline" className="border-primary/20 bg-surface gap-1.5">
                    {v}
                    <button onClick={() => rmChip(bloco.key, i)} className="text-muted-foreground hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={bloco.placeholder}
                  value={novo[bloco.input as keyof typeof novo]}
                  onChange={(e) => setNovo({ ...novo, [bloco.input]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addChip(bloco.key, novo[bloco.input as keyof typeof novo]);
                      setNovo({ ...novo, [bloco.input]: "" });
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    addChip(bloco.key, novo[bloco.input as keyof typeof novo]);
                    setNovo({ ...novo, [bloco.input]: "" });
                  }}
                >
                  <Plus />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProPerfil;
