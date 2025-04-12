
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
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
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/cases" element={<ProtectedRoute><CasesPage /></ProtectedRoute>} />
              <Route path="/clients" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
              <Route path="/documents" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> {/* Placeholder */}
              <Route path="/calendar" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> {/* Placeholder */}
              <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
              <Route path="/staff" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> {/* Placeholder */}
              <Route path="/settings" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> {/* Placeholder */}
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
