
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
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Dashboard from "@/components/Dashboard";
import BillingModule from "@/components/BillingModule";
import InventoryModule from "@/components/InventoryModule";
import ReportsModule from "@/components/ReportsModule";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
                <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">SPMPOS</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Sell Smart. Grow Fast.</p>
              </div>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Sale
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="sm:hidden border-t bg-white py-2 space-y-2">
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={() => {
                  navigate('/settings');
                  setShowMobileMenu(false);
                }}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Sale
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Mobile-Optimized Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4 h-12 sm:h-10 sm:w-[600px] sm:mx-0">
            <TabsTrigger value="dashboard" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2">
              <BarChart3 className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2">
              <ShoppingCart className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2">
              <Package className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2">
              <TrendingUp className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="billing">
            <BillingModule />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryModule />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsModule />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
