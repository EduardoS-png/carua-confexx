import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/site/Logo";
import {
  Eye, EyeOff, ArrowRight, ArrowLeft, Check, Scissors, BarChart3, Users,
  Building2, UserCircle2, MapPin, Phone, Mail, Briefcase, Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImg from "@/assets/hero-textile.jpg";

type Tipo = "faccao" | "profissional";

const totalEtapas = 4;

const Cadastro = () => {
  const [etapa, setEtapa] = useState(1);
  const [tipo, setTipo] = useState<Tipo>("faccao");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Etapa 2 — pessoais
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");

  // Etapa 3 — profissionais
  const [nomeConfeccao, setNomeConfeccao] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [tamanhoEquipe, setTamanhoEquipe] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [experienciaAnos, setExperienciaAnos] = useState("");
  const [bio, setBio] = useState("");

  // Etapa 4 — senha
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const senhaForte = senha.length >= 6;
  const senhasOk = senha === confirmarSenha && senhaForte;

  const validarEtapa = (): string | null => {
    if (etapa === 2) {
      if (!nome.trim()) return "Informe seu nome";
      if (!email.trim() || !email.includes("@")) return "E-mail inválido";
      if (!telefone.trim()) return "Informe um telefone";
      if (!cidade.trim()) return "Informe sua cidade";
    }
    if (etapa === 3) {
      if (tipo === "faccao" && !nomeConfeccao.trim()) return "Nome da confecção é obrigatório";
      if (tipo === "profissional" && !especialidade.trim()) return "Informe sua especialidade";
    }
    if (etapa === 4) {
      if (!senhaForte) return "Senha deve ter pelo menos 6 caracteres";
      if (senha !== confirmarSenha) return "As senhas não coincidem";
    }
    return null;
  };

  const proximo = () => {
    const err = validarEtapa();
    if (err) {
      toast({ title: "Atenção", description: err, variant: "destructive" });
      return;
    }
    setEtapa((e) => Math.min(e + 1, totalEtapas));
  };

  const voltar = () => setEtapa((e) => Math.max(e - 1, 1));

  const finalizar = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validarEtapa();
    if (err) {
      toast({ title: "Atenção", description: err, variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Conta criada! 🎉",
        description: tipo === "faccao" ? "Bem-vindo(a) ao painel da sua confecção." : "Sua área profissional está pronta.",
      });
      navigate(tipo === "faccao" ? "/confeccao" : "/pro");
    }, 900);
  };

  return (
    <div className="flex min-h-screen">
      {/* Hero esquerda */}
      <div className="relative hidden w-[45%] overflow-hidden lg:block">
        <img src={heroImg} alt="Produção têxtil" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[hsl(20,43%,8%)]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(20,43%,6%)] via-transparent to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" inverted />
            <span className="font-display text-xl font-bold text-white">Caruá Confex</span>
          </Link>

          <div className="max-w-md space-y-6">
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] text-white">
              {etapa === 1 && <>Comece sua jornada<br /><span className="text-orange-300">em 4 passos.</span></>}
              {etapa === 2 && <>Quem é você?<br /><span className="text-orange-300">Conte-nos.</span></>}
              {etapa === 3 && (tipo === "faccao"
                ? <>Sobre sua<br /><span className="text-orange-300">confecção.</span></>
                : <>Seu trabalho,<br /><span className="text-orange-300">seu portfólio.</span></>)}
              {etapa === 4 && <>Quase lá!<br /><span className="text-orange-300">Proteja sua conta.</span></>}
            </h1>
            <p className="text-base leading-relaxed text-white/85">
              {etapa === 1 && "Vamos configurar sua conta sob medida para o que você precisa."}
              {etapa === 2 && "Suas informações de contato ficam só com você. Usamos para identificar sua conta."}
              {etapa === 3 && "Esses dados ajudam a conectar você às pessoas certas no marketplace."}
              {etapa === 4 && "Defina uma senha segura para começar a usar o sistema."}
            </p>

            {/* indicadores no hero */}
            <div className="space-y-3 pt-4">
              {[
                { n: 1, label: "Tipo de conta" },
                { n: 2, label: "Dados pessoais" },
                { n: 3, label: tipo === "faccao" ? "Sobre a confecção" : "Sobre seu trabalho" },
                { n: 4, label: "Segurança" },
              ].map((s) => {
                const concluida = etapa > s.n;
                const ativa = etapa === s.n;
                return (
                  <div key={s.n} className="flex items-center gap-3">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      concluida ? "bg-orange-300 text-[hsl(20,43%,8%)]" :
                      ativa ? "bg-white text-[hsl(20,43%,8%)] ring-4 ring-white/30" :
                      "bg-white/10 text-white/50"
                    }`}>
                      {concluida ? <Check className="h-3.5 w-3.5" /> : s.n}
                    </div>
                    <span className={`text-sm ${ativa ? "font-semibold text-white" : concluida ? "text-white/80" : "text-white/40"}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-white/60">Feito com 🧡 para o polo têxtil do Agreste</p>
        </div>
      </div>

      {/* Form direita */}
      <div className="flex flex-1 flex-col bg-background">
        <div className="flex items-center justify-between p-6 lg:justify-end">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <Logo className="h-7 w-7" />
            <span className="font-display text-base font-bold">Caruá Confex</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Já tem conta? <Link to="/login" className="font-semibold text-primary hover:text-accent">Entrar</Link>
          </p>
        </div>

        <div className="flex flex-1 items-start justify-center px-6 pb-12 sm:items-center">
          <div className="w-full max-w-[440px] space-y-6">
            {/* progress mobile */}
            <div className="lg:hidden">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>Passo {etapa} de {totalEtapas}</span>
                <span>{Math.round((etapa / totalEtapas) * 100)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                <div className="h-full bg-gradient-warm transition-all duration-500" style={{ width: `${(etapa / totalEtapas) * 100}%` }} />
              </div>
            </div>

            {/* Etapa 1 — tipo */}
            {etapa === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-[26px] font-bold tracking-tight">Como você vai usar?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Escolha o perfil que melhor descreve você.</p>
                </div>
                <div className="grid gap-3">
                  {([
                    { v: "faccao", icon: Building2, label: "Sou uma facção", sub: "Quero gerenciar produção, equipe e estoque", chips: ["Pedidos em lote", "Equipe", "Marketplace"] },
                    { v: "profissional", icon: UserCircle2, label: "Sou profissional autônomo", sub: "Quero divulgar meu trabalho e receber pedidos", chips: ["Portfólio", "Pedidos", "Agenda"] },
                  ] as const).map((opt) => {
                    const active = tipo === opt.v;
                    return (
                      <button
                        type="button"
                        key={opt.v}
                        onClick={() => setTipo(opt.v)}
                        className={`group flex items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                          active ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-surface/30 hover:border-primary/40"
                        }`}
                      >
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
                          active ? "bg-gradient-warm text-primary-foreground" : "bg-background text-muted-foreground group-hover:text-primary"
                        }`}>
                          <opt.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-display text-[15px] font-bold">{opt.label}</p>
                          <p className="text-xs text-muted-foreground">{opt.sub}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {opt.chips.map((c) => (
                              <span key={c} className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{c}</span>
                            ))}
                          </div>
                        </div>
                        <div className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                          active ? "border-primary bg-primary" : "border-border"
                        }`}>
                          {active && <Check className="h-3 w-3 text-primary-foreground" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Etapa 2 — pessoais */}
            {etapa === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-[26px] font-bold tracking-tight">Dados pessoais</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Como podemos te encontrar?</p>
                </div>
                <FieldIcon label="Nome completo" icon={UserCircle2} value={nome} onChange={setNome} placeholder="Maria das Graças" />
                <FieldIcon label="E-mail" icon={Mail} type="email" value={email} onChange={setEmail} placeholder="seu@email.com" />
                <div className="grid grid-cols-2 gap-3">
                  <FieldIcon label="WhatsApp" icon={Phone} value={telefone} onChange={setTelefone} placeholder="(81) 99999-0000" />
                  <FieldIcon label="Cidade" icon={MapPin} value={cidade} onChange={setCidade} placeholder="Caruaru, PE" />
                </div>
              </div>
            )}

            {/* Etapa 3 — profissional/confecção */}
            {etapa === 3 && tipo === "faccao" && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-[26px] font-bold tracking-tight">Sobre sua confecção</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Esses dados aparecem no seu perfil.</p>
                </div>
                <FieldIcon label="Nome da confecção" icon={Building2} value={nomeConfeccao} onChange={setNomeConfeccao} placeholder="Confecção Sertão" />
                <div className="grid grid-cols-2 gap-3">
                  <FieldIcon label="CNPJ (opcional)" icon={Briefcase} value={cnpj} onChange={setCnpj} placeholder="00.000.000/0001-00" />
                  <FieldIcon label="Tamanho da equipe" icon={Users} value={tamanhoEquipe} onChange={setTamanhoEquipe} placeholder="5 a 10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Apresentação (opcional)</Label>
                  <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="O que sua confecção faz de melhor?" />
                </div>
              </div>
            )}

            {etapa === 3 && tipo === "profissional" && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-[26px] font-bold tracking-tight">Sobre seu trabalho</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Vamos montar sua vitrine no marketplace.</p>
                </div>
                <FieldIcon label="Especialidade" icon={Sparkles} value={especialidade} onChange={setEspecialidade} placeholder="Costureira, cortador, bordadeira..." />
                <FieldIcon label="Anos de experiência" icon={Briefcase} value={experienciaAnos} onChange={setExperienciaAnos} placeholder="10" />
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio (opcional)</Label>
                  <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Conte um pouco sobre você e seu trabalho." />
                </div>
              </div>
            )}

            {/* Etapa 4 — senha */}
            {etapa === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-[26px] font-bold tracking-tight">Crie sua senha</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Escolha algo seguro e fácil de lembrar.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Senha</Label>
                  <div className="relative">
                    <Input
                      type={showSenha ? "text" : "password"}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="h-12 rounded-xl pr-11"
                    />
                    <button type="button" onClick={() => setShowSenha(!showSenha)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showSenha ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                    </button>
                  </div>
                  {senha && (
                    <div className="flex items-center gap-2 pt-1">
                      <div className={`h-1 flex-1 rounded-full ${senhaForte ? "bg-green-500" : "bg-destructive/40"}`} />
                      <div className={`h-1 flex-1 rounded-full ${senha.length >= 8 ? "bg-green-500" : "bg-border"}`} />
                      <div className={`h-1 flex-1 rounded-full ${senha.length >= 10 ? "bg-green-500" : "bg-border"}`} />
                      <span className={`ml-1 text-[11px] font-medium ${senhaForte ? "text-green-600" : "text-muted-foreground"}`}>
                        {senha.length < 6 ? "Fraca" : senha.length < 8 ? "OK" : senha.length < 10 ? "Boa" : "Forte"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirmar senha</Label>
                  <Input
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Repita a senha"
                    className="h-12 rounded-xl"
                  />
                  {confirmarSenha && (
                    <p className={`text-[11px] ${senhasOk ? "text-green-600" : "text-destructive"}`}>
                      {senhasOk ? "✓ Senhas coincidem" : "As senhas não coincidem"}
                    </p>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground/70">
                  Ao criar sua conta, você concorda com os{" "}
                  <span className="cursor-pointer underline">Termos</span> e{" "}
                  <span className="cursor-pointer underline">Privacidade</span>.
                </p>
              </div>
            )}

            {/* Navegação */}
            <form onSubmit={finalizar}>
              <div className="flex gap-3 pt-2">
                {etapa > 1 && (
                  <Button type="button" variant="outline" onClick={voltar} className="h-12 rounded-xl">
                    <ArrowLeft className="h-4 w-4" /> Voltar
                  </Button>
                )}
                {etapa < totalEtapas ? (
                  <Button type="button" onClick={proximo} className="group h-12 flex-1 rounded-xl bg-foreground text-background hover:bg-foreground/90">
                    Continuar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading} className="group h-12 flex-1 rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-60">
                    {loading ? (
                      <span className="flex items-center gap-2.5">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                        Criando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2.5">
                        Criar minha conta <Check className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-muted-foreground/50">© 2026 Caruá Confex · Do sertão para o mundo</p>
        </div>
      </div>
    </div>
  );
};

const FieldIcon = ({ label, icon: Icon, value, onChange, type = "text", placeholder }: any) => (
  <div className="space-y-2">
    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl pl-10"
      />
    </div>
  </div>
);

export default Cadastro;
