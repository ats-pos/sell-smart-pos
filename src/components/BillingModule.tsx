import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Calculator,
  CreditCard,
  Printer,
  Share,
  Pause,
  Play,
  Percent,
  User,
  Bluetooth,
  Wifi,
  WifiOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApi, useApiMutation } from "@/hooks/useApi";
import apiClient, { Product, Sale, SaleItem, Customer } from "@/lib/api";

const BillingModule = () => {
  const { toast } = useToast();
  
  // State management
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customer, setCustomer] = useState<Partial<Customer>>({
    name: "",
    phone: "",
    email: "",
    gstin: ""
  });
  const [billDiscount, setBillDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [holdBills, setHoldBills] = useState<any[]>([]);
  const [currentBillNumber, setCurrentBillNumber] = useState("INV-2024-001");

  // API hooks
  const { data: products, loading: productsLoading } = useApi(
    () => searchTerm ? apiClient.searchProducts(searchTerm) : apiClient.getProducts(),
    [searchTerm]
  );

  const { mutate: createSaleMutation, loading: saleLoading } = useApiMutation<Sale>();
  const { mutate: createCustomerMutation } = useApiMutation<Customer>();

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateQuantity = (id: number, change: number) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const updateItemDiscount = (id: number, discount: number) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, discount: Math.max(0, Math.min(100, discount)) } : item
    ));
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      updateQuantity(existingItem.id, 1);
    } else {
      const newItem: SaleItem = {
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        discount: 0,
        total: product.price
      };
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const holdBill = () => {
    if (cart.length > 0) {
      const billData = {
        id: Date.now(),
        cart: [...cart],
        customer: { ...customer },
        timestamp: new Date().toLocaleString()
      };
      setHoldBills([...holdBills, billData]);
      setCart([]);
      setCustomer({ name: "", phone: "", email: "", gstin: "" });
      toast({
        title: "Bill Held",
        description: "Bill has been saved and can be resumed later."
      });
    }
  };

  const resumeBill = (billData: any) => {
    setCart(billData.cart);
    setCustomer(billData.customer);
    setHoldBills(holdBills.filter(bill => bill.id !== billData.id));
    toast({
      title: "Bill Resumed",
      description: "Previous bill has been restored."
    });
  };

  const calculateItemTotal = (item: SaleItem) => {
    const itemTotal = item.price * item.quantity;
    return itemTotal - (itemTotal * item.discount / 100);
  };

  const subtotal = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const billDiscountAmount = subtotal * billDiscount / 100;
  const discountedSubtotal = subtotal - billDiscountAmount;
  const gst = discountedSubtotal * 0.18;
  const total = discountedSubtotal + gst;

  const printReceipt = () => {
    toast({
      title: "Receipt Printed",
      description: `Receipt ${currentBillNumber} sent to thermal printer.`
    });
  };

  const shareReceipt = () => {
    toast({
      title: "Receipt Shared",
      description: "Receipt shared via WhatsApp/Email/SMS."
    });
  };

  const completeSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty. Add items to complete sale.",
        variant: "destructive"
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create customer if provided
      let customerId: number | undefined;
      if (customer.name || customer.phone) {
        const customerResult = await createCustomerMutation(apiClient.createCustomer)({
          name: customer.name || "",
          phone: customer.phone || "",
          email: customer.email || "",
          gstin: customer.gstin || ""
        });
        if (customerResult) {
          customerId = customerResult.id;
        }
      }

      // Create sale
      const saleData: Omit<Sale, 'id' | 'createdAt'> = {
        billNumber: currentBillNumber,
        customerId,
        customerName: customer.name,
        items: cart.map(item => ({
          ...item,
          total: calculateItemTotal(item)
        })),
        subtotal,
        discount: billDiscountAmount,
        gst,
        total,
        paymentMethod,
        status: 'completed'
      };

      const result = await createSaleMutation(apiClient.createSale)(saleData);
      
      if (result) {
        printReceipt();
        setCart([]);
        setCustomer({ name: "", phone: "", email: "", gstin: "" });
        setPaymentMethod("");
        setBillDiscount(0);
        
        // Generate next bill number
        const nextNum = parseInt(currentBillNumber.split('-')[2]) + 1;
        setCurrentBillNumber(`INV-2024-${String(nextNum).padStart(3, '0')}`);

        toast({
          title: "Sale Completed",
          description: `Bill ${currentBillNumber} processed successfully.`
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to complete sale. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete sale. Please check your connection.",
        variant: "destructive"
      });
    }
  };

  const filteredProducts = products || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product Search & Selection */}
      <div className="lg:col-span-2 space-y-6">
        {/* Status Bar */}
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
                {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {isOnline ? "Online" : "Offline"}
              </Badge>
              <Badge variant="outline">Bill: {currentBillNumber}</Badge>
            </div>
            <div className="flex items-center gap-2">
              {holdBills.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Resume ({holdBills.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Resume Held Bills</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      {holdBills.map((bill: any) => (
                        <div key={bill.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">{bill.customer.name || "Walk-in Customer"}</p>
                            <p className="text-sm text-gray-500">{bill.timestamp}</p>
                            <p className="text-sm">Items: {bill.cart.length}</p>
                          </div>
                          <Button size="sm" onClick={() => resumeBill(bill)}>
                            Resume
                          </Button>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="outline" size="sm" onClick={holdBill}>
                <Pause className="h-4 w-4 mr-2" />
                Hold
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Product Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Bluetooth className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {productsLoading ? (
                <div className="col-span-2 text-center py-8">Loading products...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500">No products found</div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">₹{product.price} • Stock: {product.stock}</p>
                      <p className="text-xs text-gray-400 font-mono">{product.barcode}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shopping Cart & Checkout */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Current Sale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="border rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.productName}</p>
                          <p className="text-xs text-gray-500">₹{item.price} each</p>
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="0"
                            value={item.discount}
                            onChange={(e) => updateItemDiscount(item.id, Number(e.target.value))}
                            className="w-16 h-8 text-xs"
                            min="0"
                            max="100"
                          />
                          <Percent className="h-3 w-3 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>₹{calculateItemTotal(item).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bill Discount:</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="0"
                        value={billDiscount}
                        onChange={(e) => setBillDiscount(Number(e.target.value))}
                        className="w-16 h-8 text-xs"
                        min="0"
                        max="100"
                      />
                      <Percent className="h-3 w-3 text-gray-400" />
                    </div>
                  </div>
                  
                  {billDiscountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount Amount:</span>
                      <span>-₹{billDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>GST (18%):</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Card Payment</SelectItem>
                      <SelectItem value="upi">UPI Payment</SelectItem>
                      <SelectItem value="cash">Cash Payment</SelectItem>
                      <SelectItem value="split">Split Payment</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    onClick={completeSale}
                    disabled={cart.length === 0 || !paymentMethod || saleLoading}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {saleLoading ? "Processing..." : "Complete Sale"}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={printReceipt}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={shareReceipt}>
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input 
              placeholder="Customer Name (Optional)" 
              value={customer.name || ""}
              onChange={(e) => setCustomer({...customer, name: e.target.value})}
            />
            <Input 
              placeholder="Phone Number (Optional)" 
              value={customer.phone || ""}
              onChange={(e) => setCustomer({...customer, phone: e.target.value})}
            />
            <Input 
              placeholder="Email (Optional)" 
              value={customer.email || ""}
              onChange={(e) => setCustomer({...customer, email: e.target.value})}
            />
            <Input 
              placeholder="GSTIN (Optional)" 
              value={customer.gstin || ""}
              onChange={(e) => setCustomer({...customer, gstin: e.target.value})}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingModule;