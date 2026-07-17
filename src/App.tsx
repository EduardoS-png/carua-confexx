import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Cadastro from "./pages/Cadastro.tsx";
import DashboardLayout from "./pages/dashboard/DashboardLayout.tsx";
import DashboardHome from "./pages/dashboard/DashboardHome.tsx";
import Pedidos from "./pages/dashboard/Pedidos.tsx";
import Materiais from "./pages/dashboard/Materiais.tsx";
import Equipe from "./pages/dashboard/Equipe.tsx";
import Financeiro from "./pages/dashboard/Financeiro.tsx";
import Relatorios from "./pages/dashboard/Relatorios.tsx";
import Marketplace from "./pages/Marketplace.tsx";
import ProfissionalDetalhe from "./pages/ProfissionalDetalhe.tsx";
import Alertas from "./pages/dashboard/Alertas.tsx";
import Perfil from "./pages/dashboard/Perfil.tsx";
import Parceiros from "./pages/confeccao/Parceiros.tsx";
import Lotes from "./pages/confeccao/Lotes.tsx";
import ProLayout from "./pages/pro/ProLayout.tsx";
import ProHome from "./pages/pro/ProHome.tsx";
import ProPedidos from "./pages/pro/ProPedidos.tsx";
import ProPortfolio from "./pages/pro/ProPortfolio.tsx";
import ProPerfil from "./pages/pro/ProPerfil.tsx";
import ProAgenda from "./pages/pro/ProAgenda.tsx";
import FaccaoLayout from "./pages/faccao/FaccaoLayout.tsx";
import FaccaoHome from "./pages/faccao/FaccaoHome.tsx";
import FaccaoLotes from "./pages/faccao/FaccaoLotes.tsx";
import FaccaoLoteDetalhe from "./pages/faccao/FaccaoLoteDetalhe.tsx";
import FaccaoHistorico from "./pages/faccao/FaccaoHistorico.tsx";
import FaccaoPerfil from "./pages/faccao/FaccaoPerfil.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<ProfissionalDetalhe />} />

          {/* Confecção — núcleo coordenador */}
          <Route path="/confeccao" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="lotes" element={<Lotes />} />
            <Route path="parceiros" element={<Parceiros />} />
            <Route path="materiais" element={<Materiais />} />
            <Route path="equipe" element={<Equipe />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="alertas" element={<Alertas />} />
            <Route path="perfil" element={<Perfil />} />
          </Route>
          {/* Compat: /app redireciona para /confeccao */}
          <Route path="/app/*" element={<Navigate to="/confeccao" replace />} />

          {/* Facção — execução produtiva */}
          <Route path="/faccao" element={<FaccaoLayout />}>
            <Route index element={<FaccaoHome />} />
            <Route path="lotes" element={<FaccaoLotes />} />
            <Route path="lotes/:id" element={<FaccaoLoteDetalhe />} />
            <Route path="historico" element={<FaccaoHistorico />} />
            <Route path="perfil" element={<FaccaoPerfil />} />
          </Route>

          {/* Profissional autônomo */}
          <Route path="/pro" element={<ProLayout />}>
            <Route index element={<ProHome />} />
            <Route path="pedidos" element={<ProPedidos />} />
            <Route path="portfolio" element={<ProPortfolio />} />
            <Route path="perfil" element={<ProPerfil />} />
            <Route path="agenda" element={<ProAgenda />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
