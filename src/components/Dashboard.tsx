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
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { 
  GET_DASHBOARD_STATS, 
  GET_LOW_STOCK_ITEMS, 
  GET_RECENT_TRANSACTIONS 
} from "@/lib/graphql/queries";
import { DashboardStats, Product, Sale } from "@/lib/graphql/types";

const Dashboard = () => {
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

  if (statsError) {
    console.warn("Dashboard stats error:", statsError.message);
  }

  return (
    <div className="space-lg">
      {/* Stats Cards */}
      <div className="grid-dashboard">
        <Card className="card-dashboard bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-white">Today's Sales</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="text-heading-2 text-white">
              {statsLoading ? "Loading..." : `₹${todayStats.sales?.toLocaleString() || 0}`}
            </div>
            <p className="text-body-sm text-blue-200">+20.1% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="card-dashboard bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-white">Transactions</CardTitle>
            <Receipt className="h-5 w-5 text-green-300" />
          </CardHeader>
          <CardContent>
            <div className="text-heading-2 text-white">
              {statsLoading ? "Loading..." : (todayStats.transactions || 0)}
            </div>
            <p className="text-body-sm text-green-200">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="card-dashboard bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-white">Customers</CardTitle>
            <Users className="h-5 w-5 text-purple-300" />
          </CardHeader>
          <CardContent>
            <div className="text-heading-2 text-white">
              {statsLoading ? "Loading..." : (todayStats.customers || 0)}
            </div>
            <p className="text-body-sm text-purple-200">+5 new customers</p>
          </CardContent>
        </Card>

        <Card className="card-dashboard bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-white">Avg Order</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-300" />
          </CardHeader>
          <CardContent>
            <div className="text-heading-2 text-white">
              {statsLoading ? "Loading..." : `₹${todayStats.avgOrder || 0}`}
            </div>
            <p className="text-body-sm text-orange-200">+8.2% increase</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid-features">
        {/* Low Stock Alert */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-md">
            {lowStockLoading ? (
              <div className="text-center py-8 text-blue-200">Loading...</div>
            ) : (
              lowStockProducts.map((item, index) => (
                <div key={item.id || index} className="flex items-center justify-between p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <div>
                    <p className="font-medium text-sm text-white">{item.name}</p>
                    <p className="text-xs text-amber-200">Min stock: {item.minStock}</p>
                  </div>
                  <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/30">
                    {item.stock} left
                  </Badge>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full mt-4">
              <Package className="h-4 w-4 mr-2" />
              Manage Inventory
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-md">
            {transactionsLoading ? (
              <div className="text-center py-8 text-blue-200">Loading...</div>
            ) : (
              recentSales.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div>
                    <p className="font-medium text-sm text-white">{transaction.billNumber}</p>
                    <p className="text-xs text-blue-200">{transaction.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-400">₹{transaction.total}</p>
                    <p className="text-xs text-blue-300">{transaction.createdAt}</p>
                  </div>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full mt-4">
              <Receipt className="h-4 w-4 mr-2" />
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid-cards">
            <Button className="card-compact flex flex-col gap-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30 hover:from-blue-500/30 hover:to-blue-600/30">
              <ShoppingBag className="h-8 w-8" />
              <span className="font-semibold">New Sale</span>
            </Button>
            <Button variant="outline" className="card-compact flex flex-col gap-3">
              <Package className="h-8 w-8" />
              <span className="font-semibold">Add Product</span>
            </Button>
            <Button variant="outline" className="card-compact flex flex-col gap-3">
              <Users className="h-8 w-8" />
              <span className="font-semibold">Add Customer</span>
            </Button>
            <Link to="/sale-operator">
              <Button variant="outline" className="card-compact flex flex-col gap-3 w-full border-green-500/30 hover:bg-green-500/10">
                <UserCheck className="h-8 w-8 text-green-400" />
                <span className="font-semibold text-green-300">Sale Operator</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;