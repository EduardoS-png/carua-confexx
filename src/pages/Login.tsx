import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/Logo";
import { Eye, EyeOff, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImg from "@/assets/hero-textile.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email && senha) {
        toast({ title: "Bem-vindo(a) de volta!", description: "Login realizado com sucesso." });
        navigate("/confeccao");
      } else {
        toast({ title: "Erro", description: "Preencha todos os campos.", variant: "destructive" });
      }
    }, 800);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — Hero Panel */}
      <div className="relative hidden w-[52%] overflow-hidden lg:block">
        <img
          src={heroImg}
          alt="Produção têxtil"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Overlay escuro forte para contraste */}
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
                Sua produção,<br />
                <span className="text-orange-300">sob controle.</span>
              </h1>
              <p className="text-base leading-relaxed text-white/90 drop-shadow">
                Gerencie pedidos, equipe e materiais em um único lugar.
                Feito para quem faz acontecer no têxtil nordestino.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-md">
              {[
                { icon: Zap, text: "Controle de produção em tempo real" },
                { icon: Shield, text: "Dados seguros e organizados" },
                { icon: Sparkles, text: "Simples como deve ser" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-400/20">
                    <item.icon className="h-4 w-4 text-orange-300" />
                  </div>
                  <span className="text-sm font-medium text-white">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-black/40 px-3 py-2 backdrop-blur-md w-fit">
            <div className="flex -space-x-2">
              {["M", "J", "C"].map((l, i) => (
                <div key={l} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 text-xs font-bold text-white" style={{ zIndex: 3 - i }}>
                  {l}
                </div>
              ))}
            </div>
            <p className="text-xs text-white/85">+200 confecções já organizam sua produção aqui</p>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex flex-1 flex-col bg-background">
        {/* Top bar mobile */}
        <div className="flex items-center justify-between p-6 lg:justify-end">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <Logo className="h-7 w-7" />
            <span className="font-display text-base font-bold text-foreground">Caruá Confex</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link to="/cadastro" className="font-semibold text-primary hover:text-accent transition-colors">
              Criar conta
            </Link>
          </p>
        </div>

        {/* Form centered */}
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-[380px] space-y-8">
            <div className="space-y-2">
              <h2 className="font-display text-[28px] font-bold tracking-tight text-foreground">
                Entrar
              </h2>
              <p className="text-[15px] text-muted-foreground">
                Acesse o painel da sua confecção
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                    focused === "email" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className="h-12 rounded-xl border-border/80 bg-surface/30 px-4 text-[15px] shadow-none transition-all placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:bg-background focus-visible:ring-primary/20"
                />
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="senha"
                    className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                      focused === "senha" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Senha
                  </Label>
                  <button type="button" className="text-xs font-medium text-primary/80 transition-colors hover:text-primary">
                    Esqueceu?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showSenha ? "text" : "password"}
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    onFocus={() => setFocused("senha")}
                    onBlur={() => setFocused(null)}
                    className="h-12 rounded-xl border-border/80 bg-surface/30 px-4 pr-11 text-[15px] shadow-none transition-all placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:bg-background focus-visible:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenha(!showSenha)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground/60 transition-colors hover:text-foreground"
                  >
                    {showSenha ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="group h-12 w-full rounded-xl bg-foreground text-background text-[15px] font-semibold shadow-none transition-all hover:bg-foreground/90 hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2.5">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                    Entrando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2.5">
                    Entrar
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-xs text-muted-foreground/60">ou</span>
              </div>
            </div>

            {/* Social (visual only) */}
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border/80 bg-background text-[14px] font-medium text-foreground transition-all hover:bg-surface/50 hover:border-border active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuar com Google
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-muted-foreground/50">
            © 2026 Caruá Confex · Do sertão para o mundo
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
