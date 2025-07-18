import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  AlertTriangle,
  Package,
  Receipt,
  BarChart3,
  UserCheck,
  Plus,
  Eye,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { 
  GET_DASHBOARD_STATS, 
  GET_LOW_STOCK_ITEMS, 
  GET_RECENT_TRANSACTIONS 
} from "@/lib/graphql/queries";
import { DashboardStats, Product, Sale } from "@/lib/graphql/types";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: dashboardStats, loading: statsLoading, error: statsError } = useGraphQLQuery<{
    dashboardStats: DashboardStats;
  }>(GET_DASHBOARD_STATS);

  const { data: lowStockData, loading: lowStockLoading } = useGraphQLQuery<{
    lowStockItems: Product[];
  }>(GET_LOW_STOCK_ITEMS);

  const { data: recentTransactionsData, loading: transactionsLoading } = useGraphQLQuery<{
    recentTransactions: Sale[];
  }>(GET_RECENT_TRANSACTIONS, {
    variables: { limit: 5 }
  });

  // Fallback data for offline mode or errors
  const todayStats = dashboardStats?.dashboardStats || {
    sales: 15420,
    transactions: 47,
    customers: 32,
    avgOrder: 328
  };

  const lowStockProducts = lowStockData?.lowStockItems || [
    { id: "1", name: "Wireless Headphones", stock: 3, minStock: 10, category: "Electronics", brand: "Sony" },
    { id: "2", name: "Phone Case", stock: 1, minStock: 5, category: "Accessories", brand: "Generic" },
    { id: "3", name: "Power Bank", stock: 2, minStock: 8, category: "Electronics", brand: "Anker" }
  ];

  const recentSales = recentTransactionsData?.recentTransactions || [
    { id: "1", billNumber: "TXN001", total: 1250, customerName: "John Doe", createdAt: "2 min ago" },
    { id: "2", billNumber: "TXN002", total: 890, customerName: "Sarah Smith", createdAt: "15 min ago" },
    { id: "3", billNumber: "TXN003", total: 2340, customerName: "Mike Johnson", createdAt: "32 min ago" }
  ];

  // Quick action handlers
  const handleNewSale = () => {
    navigate('/');
  };

  const handleAddProduct = () => {
    // This would typically open a product creation modal or navigate to inventory
    console.log("Add product clicked");
  };

  const handleAddCustomer = () => {
    // This would typically open a customer creation modal
    console.log("Add customer clicked");
  };

  const handleViewInventory = () => {
    // Switch to inventory tab - this would be handled by parent component
    console.log("View inventory clicked");
  };

  const handleViewTransactions = () => {
    // Switch to reports tab - this would be handled by parent component
    console.log("View transactions clicked");
  };

  const handleViewReports = () => {
    // Switch to reports tab - this would be handled by parent component
    console.log("View reports clicked");
  };

  if (statsError) {
    console.warn("Dashboard stats error:", statsError.message);
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "Loading..." : `₹${todayStats.sales?.toLocaleString() || 0}`}
            </div>
            <p className="text-xs text-blue-100">+20.1% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "Loading..." : (todayStats.transactions || 0)}
            </div>
            <p className="text-xs text-green-100">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "Loading..." : (todayStats.customers || 0)}
            </div>
            <p className="text-xs text-purple-100">+5 new customers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "Loading..." : `₹${todayStats.avgOrder || 0}`}
            </div>
            <p className="text-xs text-orange-100">+8.2% increase</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockLoading ? (
              <div className="text-center py-4 text-blue-200">Loading...</div>
            ) : (
              lowStockProducts.map((item, index) => (
                <div key={item.id || index} className="flex items-center justify-between p-3 bg-amber-50/10 rounded-lg border border-amber-500/20">
                  <div>
                    <p className="font-medium text-sm text-white">{item.name}</p>
                    <p className="text-xs text-blue-200">Min stock: {item.minStock}</p>
                  </div>
                  <Badge variant="destructive">{item.stock} left</Badge>
                </div>
              ))
            )}
            <Button 
              variant="outline" 
              className="w-full mt-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={handleViewInventory}
            >
              <Package className="h-4 w-4 mr-2" />
              Manage Inventory
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactionsLoading ? (
              <div className="text-center py-4 text-blue-200">Loading...</div>
            ) : (
              recentSales.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <p className="font-medium text-sm text-white">{transaction.billNumber}</p>
                    <p className="text-xs text-blue-200">{transaction.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-400">₹{transaction.total}</p>
                    <p className="text-xs text-blue-200">{transaction.createdAt}</p>
                  </div>
                </div>
              ))
            )}
            <Button 
              variant="outline" 
              className="w-full mt-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={handleViewTransactions}
            >
              <Receipt className="h-4 w-4 mr-2" />
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              className="h-20 flex flex-col gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleNewSale}
            >
              <ShoppingBag className="h-6 w-6" />
              <span className="text-sm font-medium">New Sale</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              onClick={handleAddProduct}
            >
              <Package className="h-6 w-6" />
              <span className="text-sm font-medium">Add Product</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              onClick={handleAddCustomer}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm font-medium">Add Customer</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              onClick={handleViewReports}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm font-medium">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;