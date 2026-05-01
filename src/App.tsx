import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardLayout from "./pages/dashboard/DashboardLayout.tsx";
import DashboardHome from "./pages/dashboard/DashboardHome.tsx";
import Pedidos from "./pages/dashboard/Pedidos.tsx";
import Materiais from "./pages/dashboard/Materiais.tsx";
import Equipe from "./pages/dashboard/Equipe.tsx";
import Financeiro from "./pages/dashboard/Financeiro.tsx";
import Relatorios from "./pages/dashboard/Relatorios.tsx";
import Marketplace from "./pages/Marketplace.tsx";
import ProfissionalDetalhe from "./pages/ProfissionalDetalhe.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<ProfissionalDetalhe />} />
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="materiais" element={<Materiais />} />
            <Route path="equipe" element={<Equipe />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="relatorios" element={<Relatorios />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
