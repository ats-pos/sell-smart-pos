import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  ShoppingCart,
  Users,
  Package
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import apiClient from "@/lib/api";

const ReportsModule = () => {
  // API hooks for different report data
  const { data: salesAnalytics, loading: salesLoading } = useApi(
    () => apiClient.getSalesAnalytics('month'),
    []
  );

  const { data: topProducts, loading: productsLoading } = useApi(
    () => apiClient.getTopProducts(10),
    []
  );

  const { data: gstSummary, loading: gstLoading } = useApi(
    () => apiClient.getGSTSummary(),
    []
  );

  // Fallback data for offline mode
  const salesData = salesAnalytics || {
    today: { sales: 15420, transactions: 47, customers: 32 },
    week: { sales: 89340, transactions: 234, customers: 156 },
    month: { sales: 342580, transactions: 1023, customers: 567 }
  };

  const topProductsList = topProducts || [
    { name: "Wireless Headphones", sold: 45, revenue: 134955 },
    { name: "Power Bank", sold: 38, revenue: 72162 },
    { name: "Phone Case", sold: 67, revenue: 40133 },
    { name: "Bluetooth Speaker", sold: 23, revenue: 80477 }
  ];

  const gstData = gstSummary || {
    totalSales: 342580,
    cgst: 30832,
    sgst: 30832,
    igst: 0,
    totalGst: 61664
  };

  const monthlyData = [
    { month: "Jan", sales: 245000, transactions: 892 },
    { month: "Feb", sales: 289000, transactions: 1045 },
    { month: "Mar", sales: 342580, transactions: 1234 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="products">Product Report</TabsTrigger>
          <TabsTrigger value="gst">GST Summary</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          {/* Sales Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {salesLoading ? "Loading..." : `₹${salesData.today.sales.toLocaleString()}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {salesData.today.transactions} transactions • {salesData.today.customers} customers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {salesLoading ? "Loading..." : `₹${salesData.week.sales.toLocaleString()}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {salesData.week.transactions} transactions • {salesData.week.customers} customers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {salesLoading ? "Loading..." : `₹${salesData.month.sales.toLocaleString()}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {salesData.month.transactions} transactions • {salesData.month.customers} customers
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{data.month} 2024</p>
                      <p className="text-sm text-gray-500">{data.transactions} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">₹{data.sales.toLocaleString()}</p>
                      <Badge variant="secondary">
                        {index > 0 ? `+${((data.sales / monthlyData[index-1].sales - 1) * 100).toFixed(1)}%` : 'N/A'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="text-center py-8">Loading products...</div>
              ) : (
                <div className="space-y-4">
                  {topProductsList.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sold} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{product.revenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gst" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GST Summary (This Month)</CardTitle>
            </CardHeader>
            <CardContent>
              {gstLoading ? (
                <div className="text-center py-8">Loading GST data...</div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Sales</p>
                      <p className="text-xl font-bold">₹{gstData.totalSales.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">CGST (9%)</p>
                      <p className="text-xl font-bold">₹{gstData.cgst.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-gray-600">SGST (9%)</p>
                      <p className="text-xl font-bold">₹{gstData.sgst.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total GST</p>
                      <p className="text-xl font-bold">₹{gstData.totalGst.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download GST Report
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Average Order Value</span>
                  <span className="font-bold">₹328</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Items per Transaction</span>
                  <span className="font-bold">2.3</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Customer Return Rate</span>
                  <span className="font-bold">15%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>Peak Sales Hour</span>
                  <span className="font-bold">2-4 PM</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded">
                  <Package className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium">Best Selling Category</p>
                    <p className="text-sm text-gray-600">Electronics (45% of sales)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded">
                  <Users className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium">New Customers</p>
                    <p className="text-sm text-gray-600">23 this week (+12%)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded">
                  <ShoppingCart className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="font-medium">Busiest Day</p>
                    <p className="text-sm text-gray-600">Saturday (avg 67 transactions)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsModule;