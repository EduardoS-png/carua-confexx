import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const onLanding = pathname === "/";

  const links = [
    { to: "/#solucao", label: "Solução" },
    { to: "/#beneficios", label: "Benefícios" },
    { to: "/#como-funciona", label: "Como funciona" },
    { to: "/marketplace", label: "Profissionais" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="font-display text-lg font-bold text-foreground">
            Caruá <span className="text-primary">Confex</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.to}
              href={l.to.startsWith("/#") && !onLanding ? `/${l.to.replace("/", "")}` : l.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/cadastro">Testar grátis</Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border md:hidden">
          <div className="container flex flex-col gap-3 py-4">
            {links.map((l) => (
              <a key={l.to} href={l.to} onClick={() => setOpen(false)} className="py-1 text-sm font-medium text-muted-foreground">
                {l.label}
              </a>
            ))}
            <Button asChild variant="ghost" className="mt-2">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild variant="hero" className="mt-2">
              <Link to="/cadastro">Testar grátis</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
