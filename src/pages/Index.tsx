import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Package,
  BarChart3,
  TrendingUp,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Dashboard from "@/components/Dashboard";
import BillingModule from "@/components/BillingModule";
import InventoryModule from "@/components/InventoryModule";
import ReportsModule from "@/components/ReportsModule";
import { DefaultHeader } from "@/components/common/DefaultHeader";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleNewSale = () => {
    setActiveTab("billing");
  };

  const customActions = (
    <Button 
      onClick={handleNewSale}
      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover-lift"
    >
      <Plus className="h-4 w-4 mr-2" />
      New Sale
    </Button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-float delay-500"></div>
      </div>

      {/* Default Header */}
      <DefaultHeader 
        title="SPM-POS"
        subtitle="Admin Dashboard"
        showUserInfo={true}
        showSettings={true}
        showLogout={true}
        customActions={customActions}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          {/* Modern Tab Navigation */}
          <div className="glass p-2 rounded-2xl border border-white/20 animate-slide-up">
            <TabsList className="grid w-full grid-cols-4 h-14 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 gap-2">
              <TabsTrigger
                value="dashboard"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 rounded-xl text-white font-semibold hover:text-white hover:bg-white/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden xs:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 rounded-xl text-white font-semibold hover:text-white hover:bg-white/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-200"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden xs:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 rounded-xl text-white font-semibold hover:text-white hover:bg-white/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-200"
              >
                <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden xs:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-3 rounded-xl text-white font-semibold hover:text-white hover:bg-white/20 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-200"
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