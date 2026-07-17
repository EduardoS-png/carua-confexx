import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { LayoutDashboard, PackageCheck, History, UserCircle2, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { FACCAO_LOGADA_ID, lotes, parceiros } from "@/data/mock";

const FaccaoSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const me = parceiros.find((p) => p.id === FACCAO_LOGADA_ID)!;
  const lotesAtivos = lotes.filter((l) => l.parceiroId === me.id && l.status !== "entregue").length;

  const items = [
    { to: "/faccao", label: "Visão geral", icon: LayoutDashboard, end: true, badge: 0 },
    { to: "/faccao/lotes", label: "Lotes recebidos", icon: PackageCheck, badge: lotesAtivos },
    { to: "/faccao/historico", label: "Histórico", icon: History, badge: 0 },
    { to: "/faccao/perfil", label: "Meu perfil", icon: UserCircle2, badge: 0 },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-2">
          <Logo className="h-7 w-7 shrink-0" inverted />
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display text-sm font-bold text-sidebar-foreground">Caruá Confex</span>
              <span className="text-[10px] uppercase tracking-wider text-accent">Facção</span>
            </div>
          )}
        </Link>
        {!collapsed && (
          <div className="mx-2 mb-1 mt-2 rounded-xl bg-sidebar-accent/40 p-2.5">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">{me.nome}</p>
            <p className="truncate text-[11px] text-sidebar-foreground/70">{me.cidade} · Cap. {me.capacidadeMes}/mês</p>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Produção</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((it) => {
                const active = it.end ? pathname === it.to : pathname.startsWith(it.to);
                return (
                  <SidebarMenuItem key={it.to}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink to={it.to} end={it.end} className="flex items-center gap-2">
                        <it.icon className="h-4 w-4" />
                        {!collapsed && (
                          <span className="flex flex-1 items-center justify-between">
                            {it.label}
                            {it.badge > 0 && (
                              <Badge className="ml-2 h-5 bg-accent px-1.5 text-[10px] text-accent-foreground hover:bg-accent">{it.badge}</Badge>
                            )}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {!collapsed && <span>Voltar ao site</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const FaccaoLayout = () => {
  const me = parceiros.find((p) => p.id === FACCAO_LOGADA_ID)!;
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <FaccaoSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden text-sm text-muted-foreground sm:inline">Olá, {me.responsavel.split(" ")[0]} 👋</span>
              <UserMenu nome={me.responsavel} papel={`${me.nome} · ${me.cidade}`} perfilHref="/faccao/perfil" iniciais={me.responsavel.split(" ").map((n) => n[0]).slice(0, 2).join("")} />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default FaccaoLayout;
