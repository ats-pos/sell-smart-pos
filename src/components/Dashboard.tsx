
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
  BarChart3
} from "lucide-react";

const Dashboard = () => {
  const todayStats = {
    sales: 15420,
    transactions: 47,
    customers: 32,
    avgOrder: 328
  };

  const lowStockItems = [
    { name: "Wireless Headphones", stock: 3, minStock: 10 },
    { name: "Phone Case", stock: 1, minStock: 5 },
    { name: "Power Bank", stock: 2, minStock: 8 }
  ];

  const recentTransactions = [
    { id: "TXN001", amount: 1250, customer: "John Doe", time: "2 min ago" },
    { id: "TXN002", amount: 890, customer: "Sarah Smith", time: "15 min ago" },
    { id: "TXN003", amount: 2340, customer: "Mike Johnson", time: "32 min ago" }
  ];

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
            <div className="text-2xl font-bold">₹{todayStats.sales.toLocaleString()}</div>
            <p className="text-xs text-blue-100">+20.1% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.transactions}</div>
            <p className="text-xs text-green-100">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.customers}</div>
            <p className="text-xs text-purple-100">+5 new customers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{todayStats.avgOrder}</div>
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
            {lowStockItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">Min stock: {item.minStock}</p>
                </div>
                <Badge variant="destructive">{item.stock} left</Badge>
              </div>
            ))}
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
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{transaction.id}</p>
                  <p className="text-xs text-gray-500">{transaction.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">₹{transaction.amount}</p>
                  <p className="text-xs text-gray-500">{transaction.time}</p>
                </div>
              </div>
            ))}
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
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
