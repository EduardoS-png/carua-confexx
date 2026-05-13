import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/Logo";
import { Eye, EyeOff, ArrowRight, Check, Scissors, BarChart3, Users, Building2, UserCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImg from "@/assets/hero-textile.jpg";

type Tipo = "faccao" | "profissional";

const Cadastro = () => {
  const [tipo, setTipo] = useState<Tipo>("faccao");
  const [nome, setNome] = useState("");
  const [nomeConfeccao, setNomeConfeccao] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const senhaForte = senha.length >= 6;

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    const segundoCampoOk = tipo === "faccao" ? !!nomeConfeccao : true;
    if (!nome || !email || !senha || !segundoCampoOk) {
      toast({ title: "Erro", description: "Preencha todos os campos.", variant: "destructive" });
      return;
    }
    if (!senhaForte) {
      toast({ title: "Erro", description: "A senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Conta criada! 🎉",
        description: tipo === "faccao" ? "Bem-vindo(a) ao painel da sua confecção." : "Sua área profissional está pronta.",
      });
      navigate(tipo === "faccao" ? "/app" : "/pro");
    }, 1000);
  };

  const inputClasses = (field: string) =>
    `h-12 rounded-xl border-border/80 bg-surface/30 px-4 text-[15px] shadow-none transition-all placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:bg-background focus-visible:ring-primary/20 ${
      focused === field ? "border-primary bg-background" : ""
    }`;

  const labelClasses = (field: string) =>
    `text-xs font-semibold uppercase tracking-wider transition-colors ${
      focused === field ? "text-primary" : "text-muted-foreground"
    }`;

  return (
    <div className="flex min-h-screen">
      {/* Left — Hero Panel */}
      <div className="relative hidden w-[52%] overflow-hidden lg:block">
        <img src={heroImg} alt="Produção têxtil" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[hsl(20,43%,8%)]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(20,43%,6%)] via-[hsl(20,43%,8%)/0.6] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[hsl(17,78%,18%)/0.5]" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" inverted />
            <span className="font-display text-xl font-bold text-white">Caruá Confex</span>
          </Link>

          <div className="max-w-md space-y-8">
            <div className="space-y-4">
              <h1 className="font-display text-4xl font-extrabold leading-[1.1] text-white drop-shadow-lg">
                Organize sua<br />
                <span className="text-orange-300">confecção hoje.</span>
              </h1>
              <p className="text-base leading-relaxed text-white/90 drop-shadow">
                Cadastro gratuito. Sem cartão de crédito.
                Comece a controlar sua produção em minutos.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: Scissors, title: "Gestão de Produção", desc: "Pedidos, etapas e prazos" },
                { icon: BarChart3, title: "Relatórios e Metas", desc: "Dados para decisões" },
                { icon: Users, title: "Equipe e Marketplace", desc: "Conecte profissionais" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-400/20">
                    <item.icon className="h-5 w-5 text-orange-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-white/75">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/70">Feito com 🧡 para o polo têxtil do Agreste</p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex flex-1 flex-col bg-background">
        <div className="flex items-center justify-between p-6 lg:justify-end">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <Logo className="h-7 w-7" />
            <span className="font-display text-base font-bold text-foreground">Caruá Confex</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="font-semibold text-primary hover:text-accent transition-colors">
              Entrar
            </Link>
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-[400px] space-y-7">
            <div className="space-y-2">
              <h2 className="font-display text-[28px] font-bold tracking-tight text-foreground">
                Criar conta
              </h2>
              <p className="text-[15px] text-muted-foreground">
                Gratuito · Sem cartão · Pronto em 1 minuto
              </p>
            </div>

            <form onSubmit={handleCadastro} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome" className={labelClasses("nome")}>Seu nome</Label>
                  <Input
                    id="nome"
                    placeholder="Maria das Graças"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onFocus={() => setFocused("nome")}
                    onBlur={() => setFocused(null)}
                    className={inputClasses("nome")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confeccao" className={labelClasses("confeccao")}>Confecção</Label>
                  <Input
                    id="confeccao"
                    placeholder="Confecção Sertão"
                    value={nomeConfeccao}
                    onChange={(e) => setNomeConfeccao(e.target.value)}
                    onFocus={() => setFocused("confeccao")}
                    onBlur={() => setFocused(null)}
                    className={inputClasses("confeccao")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={labelClasses("email")}>E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className={inputClasses("email")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className={labelClasses("senha")}>Senha</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showSenha ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    onFocus={() => setFocused("senha")}
                    onBlur={() => setFocused(null)}
                    className={`${inputClasses("senha")} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenha(!showSenha)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground/60 transition-colors hover:text-foreground"
                  >
                    {showSenha ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
                {senha && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className={`h-1 flex-1 rounded-full transition-all ${senhaForte ? "bg-green-500" : "bg-destructive/40"}`} />
                    <div className={`h-1 flex-1 rounded-full transition-all ${senha.length >= 8 ? "bg-green-500" : "bg-border"}`} />
                    <div className={`h-1 flex-1 rounded-full transition-all ${senha.length >= 10 ? "bg-green-500" : "bg-border"}`} />
                    <span className={`ml-1 text-[11px] font-medium ${senhaForte ? "text-green-600" : "text-muted-foreground"}`}>
                      {senha.length < 6 ? "Fraca" : senha.length < 8 ? "OK" : senha.length < 10 ? "Boa" : "Forte"}
                    </span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="group mt-2 h-12 w-full rounded-xl bg-foreground text-background text-[15px] font-semibold shadow-none transition-all hover:bg-foreground/90 hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2.5">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                    Criando conta...
                  </span>
                ) : (
                  <span className="flex items-center gap-2.5">
                    Criar minha conta
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </Button>

              <p className="text-center text-[11px] leading-relaxed text-muted-foreground/60">
                Ao criar sua conta, você concorda com os{" "}
                <span className="underline cursor-pointer">Termos de Uso</span> e{" "}
                <span className="underline cursor-pointer">Política de Privacidade</span>
              </p>
            </form>
          </div>
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-muted-foreground/50">
            © 2026 Caruá Confex · Do sertão para o mundo
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
