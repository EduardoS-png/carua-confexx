import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Logo } from "@/components/site/Logo";
import { Eye, EyeOff, UserPlus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [nomeConfeccao, setNomeConfeccao] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const senhaForte = senha.length >= 6;

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !senha || !nomeConfeccao) {
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
      toast({ title: "Conta criada! 🎉", description: "Bem-vindo(a) ao Caruá Confex." });
      navigate("/app");
    }, 1000);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 grain opacity-60" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-warm" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo className="h-10 w-10" />
            <span className="font-display text-2xl font-bold text-foreground">Caruá Confex</span>
          </Link>
          <p className="text-sm text-muted-foreground">Comece a organizar sua produção</p>
        </div>

        <Card className="shadow-warm border-border/60">
          <CardHeader className="pb-4 pt-6 text-center">
            <h1 className="font-display text-xl font-bold text-foreground">Criar conta</h1>
            <p className="text-sm text-muted-foreground">É grátis, leva menos de 1 minuto</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCadastro} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Seu nome</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Maria das Graças"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confeccao">Nome da confecção / facção</Label>
                <Input
                  id="confeccao"
                  placeholder="Ex: Confecção Sertão"
                  value={nomeConfeccao}
                  onChange={(e) => setNomeConfeccao(e.target.value)}
                  className="h-11"
                />
              </div>
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
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showSenha ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
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
                {senha && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <Check className={`h-3.5 w-3.5 ${senhaForte ? "text-green-600" : "text-muted-foreground"}`} />
                    <span className={senhaForte ? "text-green-600" : "text-muted-foreground"}>
                      {senhaForte ? "Senha válida" : "Mínimo 6 caracteres"}
                    </span>
                  </div>
                )}
              </div>
              <Button type="submit" variant="hero" className="w-full h-11" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Criando conta...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Criar minha conta
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center pb-6">
            <p className="text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Entrar
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

export default Cadastro;
