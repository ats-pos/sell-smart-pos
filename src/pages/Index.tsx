
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
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header - Clean & Minimal */}
      <header className="nav-modern">
        <div className="responsive-container">
          <div className="flex justify-between items-center h-18">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-soft">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">SPM-POS</h1>
                <p className="text-xs text-gray-500 font-medium">Admin Dashboard</p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSettings}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button 
                onClick={handleNewSale}
                size="sm"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                New Sale
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:border-red-300"
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
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-gray-200 bg-white py-4 space-y-2 animate-slide-up">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Sale
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50" 
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
      <main className="responsive-container py-6 lg:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-lg">
          {/* Modern Tab Navigation */}
          <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-soft animate-slide-up">
            <TabsList className="grid w-full grid-cols-4 gap-1 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger
                value="dashboard"
                className="flex flex-col sm:flex-row items-center gap-2 text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden text-xs">Dash</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="flex flex-col sm:flex-row items-center gap-2 text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Billing</span>
                <span className="sm:hidden text-xs">Bill</span>
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="flex flex-col sm:flex-row items-center gap-2 text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Inventory</span>
                <span className="sm:hidden text-xs">Stock</span>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex flex-col sm:flex-row items-center gap-2 text-sm font-semibold px-3 py-2.5 rounded-lg transition-all duration-200"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Reports</span>
                <span className="sm:hidden text-xs">Stats</span>
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
