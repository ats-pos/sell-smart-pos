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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
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

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
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

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
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

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              lowStockProducts.map((item, index) => (
                <div key={item.id || index} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">Min stock: {item.minStock}</p>
                  </div>
                  <Badge variant="destructive">{item.stock} left</Badge>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full mt-3">
              <Package className="h-4 w-4 mr-2" />
              Manage Inventory
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactionsLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              recentSales.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{transaction.billNumber}</p>
                    <p className="text-xs text-gray-500">{transaction.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">₹{transaction.total}</p>
                    <p className="text-xs text-gray-500">{transaction.createdAt}</p>
                  </div>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full mt-3">
              <Receipt className="h-4 w-4 mr-2" />
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700">
              <ShoppingBag className="h-6 w-6" />
              New Sale
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Package className="h-6 w-6" />
              Add Product
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              Add Customer
            </Button>
            <Link to="/sale-operator">
              <Button variant="outline" className="h-20 w-full flex flex-col gap-2 border-green-200 hover:bg-green-50">
                <UserCheck className="h-6 w-6 text-green-600" />
                Sale Operator
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;