
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";

// Pages
import Dashboard from "./pages/Dashboard";
import CasesPage from "./pages/CasesPage";
import ClientsPage from "./pages/ClientsPage";
import BillingPage from "./pages/BillingPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/documents" element={<Dashboard />} /> {/* Placeholder */}
            <Route path="/calendar" element={<Dashboard />} /> {/* Placeholder */}
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/staff" element={<Dashboard />} /> {/* Placeholder */}
            <Route path="/settings" element={<Dashboard />} /> {/* Placeholder */}
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
