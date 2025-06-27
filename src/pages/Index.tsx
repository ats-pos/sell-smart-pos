
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
  Search,
  Receipt,
  TrendingUp,
  DollarSign,
  ShoppingBag,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-float delay-500"></div>
      </div>

      {/* Modern Glassmorphism Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 sm:p-3 rounded-xl shadow-lg">
                <Receipt className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white gradient-text">SPM-POS</h1>
                <p className="text-xs sm:text-sm text-blue-200 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Admin Dashboard
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover-lift"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover-lift">
                <Plus className="h-4 w-4 mr-2" />
                New Sale
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover-lift" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-white hover:bg-white/10"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="sm:hidden border-t border-white/10 bg-black/20 backdrop-blur-sm py-4 space-y-3 animate-slide-up">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => {
                  navigate('/settings');
                  setShowMobileMenu(false);
                }}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                New Sale
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          {/* Modern Tab Navigation */}
          <div className="glass p-2 rounded-2xl border border-white/20 animate-slide-up">
            <TabsList className="grid w-full grid-cols-4 h-14 sm:h-12 bg-transparent gap-2">
              <TabsTrigger
                value="dashboard"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-blue-200 hover:bg-white/10 transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden xs:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-blue-200 hover:bg-white/10 transition-all duration-200"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden xs:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-blue-200 hover:bg-white/10 transition-all duration-200"
              >
                <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden xs:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-blue-200 hover:bg-white/10 transition-all duration-200"
              >
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden xs:inline">Reports</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="animate-slide-up delay-200">
            <Dashboard />
          </TabsContent>

          <TabsContent value="billing" className="animate-slide-up delay-200">
            <BillingModule />
          </TabsContent>

          <TabsContent value="inventory" className="animate-slide-up delay-200">
            <InventoryModule />
          </TabsContent>

          <TabsContent value="reports" className="animate-slide-up delay-200">
            <ReportsModule />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
