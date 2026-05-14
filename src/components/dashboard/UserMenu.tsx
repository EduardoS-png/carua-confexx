import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, HelpCircle, Bell, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface UserMenuProps {
  nome: string;
  papel: string;
  perfilHref: string;
  avatarUrl?: string;
  iniciais?: string;
}

export const UserMenu = ({ nome, papel, perfilHref, avatarUrl, iniciais }: UserMenuProps) => {
  const navigate = useNavigate();
  const sair = () => {
    toast.success("Sessão encerrada. Até logo! 👋");
    setTimeout(() => navigate("/"), 600);
  };
  const init = iniciais ?? nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-2 rounded-full p-0.5 transition-all hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
          {avatarUrl ? (
            <img src={avatarUrl} alt={nome} className="h-9 w-9 rounded-full object-cover ring-2 ring-border transition-all group-hover:ring-primary/40" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-warm font-display text-sm font-bold text-primary-foreground ring-2 ring-border transition-all group-hover:ring-primary/40">
              {init}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-xl">
        <div className="flex items-center gap-3 p-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt={nome} className="h-11 w-11 rounded-full object-cover" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-warm font-display text-base font-bold text-primary-foreground">
              {init}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold">{nome}</p>
            <p className="truncate text-[11px] text-muted-foreground">{papel}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={perfilHref} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" /> Ver meu perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={perfilHref + "?tab=preferencias"} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" /> Configurações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.info("Você não tem novas notificações.")}>
          <Bell className="mr-2 h-4 w-4" /> Notificações
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.info("Central de ajuda em breve.")}>
          <HelpCircle className="mr-2 h-4 w-4" /> Ajuda e suporte
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
          <Sparkles className="mr-1 inline h-3 w-3" /> Plano gratuito
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => toast.info("Upgrade em breve!")} className="text-primary">
          Conhecer plano Pro
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={sair} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" /> Sair da conta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
