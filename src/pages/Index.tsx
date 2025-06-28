
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Package,
  BarChart3,
  Plus,
  Receipt,
  TrendingUp,
  Menu,
  Settings,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Modern Header - Beautiful gradient background */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section - Enhanced */}
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-medium">
                <Receipt className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SPM-POS
                </h1>
                <p className="text-sm text-gray-500 font-medium">Admin Dashboard</p>
              </div>
            </div>

            {/* Desktop Actions - Improved spacing and styling */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSettings}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 border-gray-200"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button 
                onClick={handleNewSale}
                size="sm"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-medium"
              >
                <Plus className="h-4 w-4" />
                New Sale
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:border-red-300 border-gray-200"
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
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu - Enhanced */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm py-6 space-y-3 animate-slide-up rounded-b-2xl shadow-medium">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                onClick={handleSettings}
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Button>
              <Button 
                onClick={() => {
                  handleNewSale();
                  setShowMobileMenu(false);
                }}
                className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl"
              >
                <Plus className="h-5 w-5 mr-3" />
                New Sale
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl" 
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content - Enhanced container and spacing */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Modern Tab Navigation - Beautiful card design */}
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-3xl border border-gray-200/50 shadow-soft animate-slide-up">
            <TabsList className="grid grid-cols-4 gap-2 bg-gray-100/80 p-2 rounded-2xl w-full">
              <TabsTrigger
                value="dashboard"
                className="flex flex-col sm:flex-row items-center gap-3 text-sm font-semibold px-6 py-4 rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-medium data-[state=active]:scale-105"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden text-xs font-medium">Dash</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="flex flex-col sm:flex-row items-center gap-3 text-sm font-semibold px-6 py-4 rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-medium data-[state=active]:scale-105"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline">Billing</span>
                <span className="sm:hidden text-xs font-medium">Bill</span>
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="flex flex-col sm:flex-row items-center gap-3 text-sm font-semibold px-6 py-4 rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-medium data-[state=active]:scale-105"
              >
                <Package className="h-5 w-5" />
                <span className="hidden sm:inline">Inventory</span>
                <span className="sm:hidden text-xs font-medium">Stock</span>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex flex-col sm:flex-row items-center gap-3 text-sm font-semibold px-6 py-4 rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-medium data-[state=active]:scale-105"
              >
                <TrendingUp className="h-5 w-5" />
                <span className="hidden sm:inline">Reports</span>
                <span className="sm:hidden text-xs font-medium">Stats</span>
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
