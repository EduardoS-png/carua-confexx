import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/site/Logo";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simula login
    setTimeout(() => {
      setLoading(false);
      if (email && senha) {
        toast({ title: "Bem-vindo(a) de volta!", description: "Login realizado com sucesso." });
        navigate("/app");
      } else {
        toast({ title: "Erro", description: "Preencha todos os campos.", variant: "destructive" });
      }
    }, 800);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 grain opacity-60" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-warm" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo className="h-10 w-10" />
            <span className="font-display text-2xl font-bold text-foreground">Caruá Confex</span>
          </Link>
          <p className="text-sm text-muted-foreground">Gestão têxtil inteligente</p>
        </div>

        <Card className="shadow-warm border-border/60">
          <CardHeader className="pb-4 pt-6 text-center">
            <h1 className="font-display text-xl font-bold text-foreground">Entrar na sua conta</h1>
            <p className="text-sm text-muted-foreground">Acesse o painel da sua confecção</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="senha">Senha</Label>
                  <button type="button" className="text-xs text-primary hover:underline">
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showSenha ? "text" : "password"}
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenha(!showSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" variant="hero" className="w-full h-11" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Entrando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center pb-6">
            <p className="text-sm text-muted-foreground">
              Não tem conta?{" "}
              <Link to="/cadastro" className="font-semibold text-primary hover:underline">
                Criar conta grátis
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          © 2026 Caruá Confex · Do sertão para o mundo
        </p>
      </div>
    </div>
  );
};

export default Login;
