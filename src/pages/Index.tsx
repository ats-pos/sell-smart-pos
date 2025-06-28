import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Plus,
  Receipt,
  TrendingUp,
  Menu,
  Settings,
  Sparkles,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Dashboard from "@/components/Dashboard";
import BillingModule from "@/components/BillingModule";
import InventoryModule from "@/components/InventoryModule";
import ReportsModule from "@/components/ReportsModule";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleNewSale = () => {
    setActiveTab("billing");
  };

  const handleLogout = () => {
    logout();
  };

  const handleSettings = () => {
    navigate('/settings');
    setShowMobileMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-float delay-500"></div>
      </div>

      {/* Modern Header */}
      <header className="nav-modern">
        <div className="responsive-container">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-2xl shadow-modern-lg">
                <Receipt className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-heading-3 gradient-text">SPM-POS</h1>
                <p className="text-body-sm flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Admin Dashboard
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSettings}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button 
                onClick={handleNewSale}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Sale
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-white/10 bg-black/20 backdrop-blur-sm py-6 space-y-4 animate-slide-up">
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={handleSettings}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                onClick={() => {
                  handleNewSale();
                  setShowMobileMenu(false);
                }}
                className="w-full justify-start"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Sale
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="responsive-container py-8 lg:py-12 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-lg">
          {/* Modern Tab Navigation */}
          <div className="glass-strong p-3 rounded-2xl border border-white/20 animate-slide-up">
            <TabsList className="grid w-full grid-cols-4 gap-2">
              <TabsTrigger
                value="dashboard"
                className="flex flex-col sm:flex-row items-center gap-2 text-sm font-semibold"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="flex flex-col sm:flex-row items-center gap-2 text-sm font-semibold"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="flex flex-col sm:flex-row items-center gap-2 text-sm font-semibold"
              >
                <Package className="h-5 w-5" />
                <span className="hidden sm:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex flex-col sm:flex-row items-center gap-2 text-sm font-semibold"
              >
                <TrendingUp className="h-5 w-5" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="animate-fade-in">
            <Dashboard />
          </TabsContent>

          <TabsContent value="billing" className="animate-fade-in">
            <BillingModule />
          </TabsContent>

          <TabsContent value="inventory" className="animate-fade-in">
            <InventoryModule />
          </TabsContent>

          <TabsContent value="reports" className="animate-fade-in">
            <ReportsModule />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;