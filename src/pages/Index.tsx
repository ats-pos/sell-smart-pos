
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
import './Index.scss';

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleNewSale = () => {
    setActiveTab("billing");
  };

  const customActions = (
    <Button 
      onClick={handleNewSale}
      className="btn primary small"
    >
      <Plus className="h-3 w-3 mr-1" />
      <span className="hidden md:inline">New Sale</span>
    </Button>
  );

  return (
    <div className="page-layout">
      {/* Animated background elements */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
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
      <main className="main-content">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="tabs-container">
          {/* Modern Tab Navigation */}
          <div className="tabs-wrapper">
            <TabsList className="tabs-list">
              <TabsTrigger
                value="dashboard"
                className="tab-trigger"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="tab-label">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="tab-trigger"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="tab-label">Billing</span>
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="tab-trigger"
              >
                <Package className="h-4 w-4" />
                <span className="tab-label">Inventory</span>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="tab-trigger"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="tab-label">Reports</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="tab-content">
            <Dashboard />
          </TabsContent>

          <TabsContent value="billing" className="tab-content">
            <BillingModule />
          </TabsContent>

          <TabsContent value="inventory" className="tab-content">
            <InventoryModule />
          </TabsContent>

          <TabsContent value="reports" className="tab-content">
            <ReportsModule />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
