import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import apolloClient from "@/lib/graphql/client";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ROUTES } from "@/lib/utils/constants";
import Index from "./pages/Index";
import SaleOperator from "./pages/SaleOperator";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import PrivateRoutes from "./components/auth/PrivateRoutes";
import PurchaseEntryScreen from "./components/inventory/PurchaseEntryScreen";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./lib/context/AuthContext";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  console.log("App - isAuthenticated:", isAuthenticated);
  return (
    <Routes>
      <Route path={ROUTES.login} element={<Login />} />
      <Route element={<PrivateRoutes />}>
        <Route path={ROUTES.admin} element={<Index />} />
        <Route path={ROUTES.purchase} element={<PurchaseEntryScreen />} />
        <Route path={ROUTES.settings} element={<Settings />} />
        <Route path={ROUTES.saleOperator} element={<SaleOperator />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => {
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}

export default App;