import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { LayoutDashboard, ImagePlus, UserCircle2, Inbox, CalendarDays, ArrowLeft, Store } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { profissionais, PROFISSIONAL_LOGADO_ID, pedidosConexao } from "@/data/mock";
import { Badge } from "@/components/ui/badge";

const ProSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const me = profissionais.find((p) => p.id === PROFISSIONAL_LOGADO_ID)!;
  const novosPedidos = pedidosConexao.filter((p) => p.profissionalId === me.id && p.status === "pendente").length;

  const items = [
    { to: "/pro", label: "Visão geral", icon: LayoutDashboard, end: true, badge: 0 },
    { to: "/pro/pedidos", label: "Pedidos de conexão", icon: Inbox, badge: novosPedidos },
    { to: "/pro/portfolio", label: "Portfólio", icon: ImagePlus, badge: 0 },
    { to: "/pro/perfil", label: "Meu perfil", icon: UserCircle2, badge: 0 },
    { to: "/pro/agenda", label: "Agenda", icon: CalendarDays, badge: 0 },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-2">
          <Logo className="h-7 w-7 shrink-0" inverted />
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display text-sm font-bold text-sidebar-foreground">Caruá Confex</span>
              <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Profissional</span>
            </div>
          )}
        </Link>
        {!collapsed && (
          <div className="mx-2 mb-1 mt-2 flex items-center gap-3 rounded-xl bg-sidebar-accent/40 p-2.5">
            <img src={me.foto} alt={me.nome} className="h-10 w-10 rounded-full object-cover ring-2 ring-sidebar-border" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">{me.nome}</p>
              <p className="truncate text-[11px] text-sidebar-foreground/70">{me.especialidade}</p>
            </div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Minha área</SidebarGroupLabel>
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
          <SidebarGroupLabel>Comunidade</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/marketplace" className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    {!collapsed && <span>Marketplace</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
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

const ProLayout = () => {
  const me = profissionais.find((p) => p.id === PROFISSIONAL_LOGADO_ID)!;
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <ProSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden text-sm text-muted-foreground sm:inline">Olá, {me.nome.split(" ")[0]} 👋</span>
              <img src={me.foto} alt={me.nome} className="h-9 w-9 rounded-full object-cover ring-2 ring-border" />
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

export default ProLayout;
