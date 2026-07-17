import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { toast } from "sonner";
import { FACCAO_LOGADA_ID, parceiros } from "@/data/mock";

const FaccaoPerfil = () => {
  const me = parceiros.find((p) => p.id === FACCAO_LOGADA_ID)!;
  const [nome, setNome] = useState(me.nome);
  const [responsavel, setResponsavel] = useState(me.responsavel);
  const [cidade, setCidade] = useState(me.cidade);
  const [contato, setContato] = useState(me.contato);
  const [capacidade, setCapacidade] = useState(String(me.capacidadeMes));
  const [bio, setBio] = useState("Facção de pequeno porte especializada em costura de malha e tecido plano. Prazo curto e capricho garantido.");

  const salvar = () => toast.success("Perfil atualizado.");

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader title="Meu perfil" description="Dados da facção que aparecem para as confecções parceiras." />

      <Card className="p-5">
        <h3 className="mb-4 font-display text-base font-bold">Dados da facção</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome da facção" value={nome} onChange={setNome} />
          <Field label="Responsável" value={responsavel} onChange={setResponsavel} />
          <Field label="Cidade" value={cidade} onChange={setCidade} />
          <Field label="WhatsApp" value={contato} onChange={setContato} />
          <Field label="Capacidade (peças/mês)" value={capacidade} onChange={setCapacidade} />
        </div>
        <div className="mt-4 space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Apresentação</Label>
          <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={salvar}>Salvar alterações</Button>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-3 font-display text-base font-bold">Reputação</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Avaliação" value={me.avaliacao.toFixed(1)} />
          <Stat label="Parceira desde" value={new Date(me.desde).toLocaleDateString("pt-BR")} />
          <Stat label="Lotes ativos" value={String(me.lotesEmAndamento)} />
        </div>
      </Card>
    </div>
  );
};

const Field = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-11" />
  </div>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-surface/50 p-3">
    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="mt-1 font-display text-xl font-bold">{value}</p>
  </div>
);

export default FaccaoPerfil;
