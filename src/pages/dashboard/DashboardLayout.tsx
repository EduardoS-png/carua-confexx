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
import { LayoutDashboard, ClipboardList, Boxes, Users, Wallet, ArrowLeft, Store, BarChart3 } from "lucide-react";
import { Logo } from "@/components/site/Logo";

const items = [
  { to: "/app", label: "Visão geral", icon: LayoutDashboard, end: true },
  { to: "/app/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/app/materiais", label: "Materiais", icon: Boxes },
  { to: "/app/equipe", label: "Equipe", icon: Users },
  { to: "/app/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/app/relatorios", label: "Relatórios", icon: BarChart3 },
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-2">
          <Logo className="h-7 w-7 shrink-0" inverted />
          {!collapsed && (
            <span className="font-display text-base font-bold text-sidebar-foreground">
              Caruá Confex
            </span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestão</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((it) => {
                const active = it.end ? pathname === it.to : pathname.startsWith(it.to);
                return (
                  <SidebarMenuItem key={it.to}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink to={it.to} end={it.end} className="flex items-center gap-2">
                        <it.icon className="h-4 w-4" />
                        {!collapsed && <span>{it.label}</span>}
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

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden text-sm text-muted-foreground sm:inline">Olá, Dona Maria 👋</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-warm font-display text-sm font-bold text-primary-foreground">
                M
              </div>
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

export default DashboardLayout;
