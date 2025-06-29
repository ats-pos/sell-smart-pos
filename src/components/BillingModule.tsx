import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  Printer,
  Share,
  Percent,
  Bluetooth,
  ShoppingCart,
  Smartphone,
  Banknote,
  QrCode,
  ScanLine,
  DollarSign,
  Calculator,
  User,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGraphQLQuery, useGraphQLMutation } from "@/hooks/useGraphQL";
import { 
  GET_PRODUCTS, 
  SEARCH_PRODUCTS 
} from "@/lib/graphql/queries";
import { 
  CREATE_SALE, 
  CREATE_CUSTOMER 
} from "@/lib/graphql/mutations";
import { 
  Product, 
  Sale, 
  SaleInput, 
  SaleItem, 
  Customer, 
  CustomerInput 
} from "@/lib/graphql/types";

const BillingModule = () => {
  const { toast } = useToast();
  
  // State management
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customer, setCustomer] = useState<Partial<CustomerInput>>({
    name: "",
    phone: "",
    email: "",
    gstin: ""
  });
  const [billDiscount, setBillDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "amount">("percentage");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [holdBills, setHoldBills] = useState<any[]>([]);
  const [currentBillNumber, setCurrentBillNumber] = useState("INV-2024-001");
  const [amountPaid, setAmountPaid] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // GraphQL hooks
  const { data: productsData, loading: productsLoading } = useGraphQLQuery<{
    products: Product[];
  }>(GET_PRODUCTS, {
    variables: { limit: 50 }
  });

  const { data: searchData, loading: searchLoading } = useGraphQLQuery<{
    searchProducts: Product[];
  }>(SEARCH_PRODUCTS, {
    variables: { query: searchTerm },
    skip: !searchTerm || searchTerm.length < 2
  });

  const { mutate: createSale, loading: saleLoading } = useGraphQLMutation<{
    createSale: Sale;
  }, { input: SaleInput }>(CREATE_SALE, {
    onCompleted: () => {
      toast({
        title: "Sale Completed",
        description: `Bill ${currentBillNumber} processed successfully.`
      });
    }
  });

  const { mutate: createCustomer } = useGraphQLMutation<{
    createCustomer: Customer;
  }, { input: CustomerInput }>(CREATE_CUSTOMER);

  // Auto-show search results when typing
  useEffect(() => {
    if (searchTerm.length >= 2) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searchTerm]);

  const updateQuantity = (id: string, change: number) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const updateItemDiscount = (id: string, discount: number) => {
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
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        discount: 0,
        total: product.price
      };
      setCart([...cart, newItem]);
    }
    setSearchTerm("");
    setShowSearchResults(false);
  };

  const removeFromCart = (id: string) => {
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
      clearCart();
      toast({
        title: "Bill Held",
        description: "Bill has been saved and can be resumed later."
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    setCustomer({ name: "", phone: "", email: "", gstin: "" });
    setPaymentMethod("");
    setBillDiscount(0);
    setAmountPaid("");
  };

  const calculateItemTotal = (item: SaleItem) => {
    const itemTotal = item.price * item.quantity;
    return itemTotal - (itemTotal * item.discount / 100);
  };

  const subtotal = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  
  // Calculate discount amount based on type
  const billDiscountAmount = discountType === "percentage" 
    ? subtotal * billDiscount / 100 
    : Math.min(billDiscount, subtotal);
  
  const discountedSubtotal = subtotal - billDiscountAmount;
  
  // Tax calculations
  const gst = discountedSubtotal * 0.18;
  const cst = discountedSubtotal * 0.05;
  const total = discountedSubtotal + gst + cst;
  const balanceDue = total - (parseFloat(amountPaid) || 0);

  const printReceipt = () => {
    toast({
      title: "Receipt Printed",
      description: `Receipt ${currentBillNumber} sent to thermal printer.`
    });
  };

  const shareInvoice = () => {
    toast({
      title: "Invoice Shared",
      description: "Invoice shared via WhatsApp/Email/SMS."
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
      let customerId: string | undefined;
      if (customer.name || customer.phone) {
        const customerResult = await createCustomer({
          input: {
            name: customer.name || "",
            phone: customer.phone || "",
            email: customer.email || "",
            gstin: customer.gstin || ""
          }
        });
        if (customerResult?.data?.createCustomer) {
          customerId = customerResult.data.createCustomer.id;
        }
      }

      // Create sale
      const saleData: SaleInput = {
        billNumber: currentBillNumber,
        customerId,
        customerName: customer.name,
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          total: calculateItemTotal(item)
        })),
        subtotal,
        discount: billDiscountAmount,
        gst,
        total,
        paymentMethod,
        status: 'completed'
      };

      const result = await createSale({ input: saleData });
      
      if (result?.data?.createSale) {
        printReceipt();
        clearCart();
        
        // Generate next bill number
        const nextNum = parseInt(currentBillNumber.split('-')[2]) + 1;
        setCurrentBillNumber(`INV-2024-${String(nextNum).padStart(3, '0')}`);
      }
    } catch (error) {
      console.error("Sale completion error:", error);
    }
  };

  // Enhanced search functionality
  const getFilteredProducts = () => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const searchResults = searchData?.searchProducts || [];
    const allProducts = productsData?.products || [];
    
    // Use search results if available, otherwise filter all products
    const products = searchResults.length > 0 ? searchResults : allProducts;
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10); // Limit to 10 results for performance
  };

  const filteredProducts = getFilteredProducts();
  const loading = searchTerm.length >= 2 ? searchLoading : productsLoading;

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-140px)]">
        {/* Left Panel - Product Search & Cart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enhanced Search Bar */}
          <Card className="glass border-white/20">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, barcode, brand, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute right-2 top-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <ScanLine className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => {
                      toast({
                        title: "Add Manual Item",
                        description: "Manual item entry feature coming soon."
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Manual Item
                  </Button>
                  <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white">
                    <Bluetooth className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card className="glass border-white/20 flex-1">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart Items ({cart.length})
                </CardTitle>
                <div className="text-sm text-blue-200">
                  Total: ₹{cart.reduce((sum, item) => sum + calculateItemTotal(item), 0).toFixed(2)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-blue-200">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-blue-300 opacity-50" />
                  <p className="text-lg font-medium mb-2">No items in cart</p>
                  <p className="text-sm">Search and add products to get started</p>
                </div>
              ) : (
                <>
                  {/* Cart Header */}
                  <div className="grid grid-cols-12 gap-2 text-sm font-medium text-blue-200 pb-2 border-b border-white/20">
                    <div className="col-span-4">Item</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Total</div>
                    <div className="col-span-2 text-center">Actions</div>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center py-3 px-2 bg-white/5 rounded-lg border border-white/10">
                        <div className="col-span-4">
                          <div className="text-white font-medium text-sm">{item.productName}</div>
                          <div className="text-xs text-blue-200">₹{item.price} each</div>
                          {item.discount > 0 && (
                            <div className="text-xs text-green-300">{item.discount}% off</div>
                          )}
                        </div>
                        
                        <div className="col-span-2 flex items-center justify-center gap-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 w-7 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-white text-sm font-medium">{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 w-7 p-0 bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="col-span-2 text-center text-white text-sm">
                          ₹{item.price}
                        </div>
                        
                        <div className="col-span-2 text-center text-white text-sm font-medium">
                          ₹{calculateItemTotal(item).toFixed(2)}
                        </div>
                        
                        <div className="col-span-2 flex items-center justify-center gap-1">
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              placeholder="0"
                              value={item.discount}
                              onChange={(e) => updateItemDiscount(item.id, Number(e.target.value))}
                              className="h-7 w-12 text-xs bg-white/10 border-white/20 text-white"
                              min="0"
                              max="100"
                            />
                            <Percent className="h-3 w-3 text-gray-400" />
                          </div>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="h-7 w-7 p-0"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Actions */}
                  <div className="flex gap-2 pt-4 border-t border-white/20">
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={holdBill}
                    >
                      Hold Bill
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Billing Summary */}
        <div className="space-y-6">
          {/* Customer Details */}
          <Card className="glass border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <Input 
                  placeholder="Customer Name (Optional)" 
                  value={customer.name || ""}
                  onChange={(e) => setCustomer({...customer, name: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
                <Input 
                  placeholder="Phone Number (Optional)" 
                  value={customer.phone || ""}
                  onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
                <Input 
                  placeholder="Email (Optional)" 
                  value={customer.email || ""}
                  onChange={(e) => setCustomer({...customer, email: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
                <Input 
                  placeholder="GSTIN (Optional)" 
                  value={customer.gstin || ""}
                  onChange={(e) => setCustomer({...customer, gstin: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Billing Summary */}
          <Card className="glass border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Billing Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary Details */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Subtotal</span>
                  <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                
                {/* Global Discount */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200 text-sm">Global Discount</span>
                    <div className="flex items-center gap-2">
                      <ToggleGroup 
                        type="single" 
                        value={discountType} 
                        onValueChange={(value) => value && setDiscountType(value as "percentage" | "amount")}
                        className="h-8"
                      >
                        <ToggleGroupItem 
                          value="percentage" 
                          className="h-8 px-2 text-xs bg-white/10 border-white/20 text-white data-[state=on]:bg-blue-500"
                        >
                          %
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                          value="amount" 
                          className="h-8 px-2 text-xs bg-white/10 border-white/20 text-white data-[state=on]:bg-blue-500"
                        >
                          ₹
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="0"
                      value={billDiscount}
                      onChange={(e) => setBillDiscount(Number(e.target.value))}
                      className="flex-1 h-8 bg-white/10 border-white/20 text-white"
                      min="0"
                      max={discountType === "percentage" ? "100" : subtotal.toString()}
                    />
                    {billDiscountAmount > 0 && (
                      <span className="text-green-300 text-sm">-₹{billDiscountAmount.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                
                {/* Tax Breakdown */}
                <div className="bg-white/5 p-3 rounded-lg space-y-2">
                  <div className="text-sm font-medium text-white mb-2">Tax Breakdown</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">GST (18%)</span>
                    <span className="text-white">₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">CST (5%)</span>
                    <span className="text-white">₹{cst.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Rounding</span>
                  <span className="text-white">₹0.50</span>
                </div>
                
                <Separator className="bg-white/20" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white">₹{(total + 0.5).toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method with Icons */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Payment Method</label>
                <ToggleGroup 
                  type="single" 
                  value={paymentMethod} 
                  onValueChange={(value) => value && setPaymentMethod(value)}
                  className="grid grid-cols-2 gap-2"
                >
                  <ToggleGroupItem 
                    value="cash" 
                    className="flex flex-col items-center gap-2 h-16 bg-white/10 border-white/20 text-white data-[state=on]:bg-green-500/30 data-[state=on]:border-green-500/50"
                  >
                    <Banknote className="h-5 w-5" />
                    <span className="text-xs">Cash</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="card" 
                    className="flex flex-col items-center gap-2 h-16 bg-white/10 border-white/20 text-white data-[state=on]:bg-blue-500/30 data-[state=on]:border-blue-500/50"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="text-xs">Card</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="upi" 
                    className="flex flex-col items-center gap-2 h-16 bg-white/10 border-white/20 text-white data-[state=on]:bg-purple-500/30 data-[state=on]:border-purple-500/50"
                  >
                    <QrCode className="h-5 w-5" />
                    <span className="text-xs">UPI</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="split" 
                    className="flex flex-col items-center gap-2 h-16 bg-white/10 border-white/20 text-white data-[state=on]:bg-orange-500/30 data-[state=on]:border-orange-500/50"
                  >
                    <DollarSign className="h-5 w-5" />
                    <span className="text-xs">Split</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Amount Paid */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Amount Paid</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
              </div>

              {/* Balance Due */}
              <div className="flex justify-between text-lg font-bold p-3 bg-white/5 rounded-lg">
                <span className="text-white">Balance Due</span>
                <span className={`${balanceDue > 0 ? 'text-red-300' : 'text-green-300'}`}>
                  ₹{Math.max(0, balanceDue + 0.5).toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg h-12 text-lg font-semibold"
                  onClick={completeSale}
                  disabled={cart.length === 0 || !paymentMethod || saleLoading}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  {saleLoading ? "Processing..." : "Complete Sale"}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={printReceipt}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Receipt
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={shareInvoice}
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share Invoice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Search Results Overlay */}
      {showSearchResults && searchTerm.length >= 2 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
          <Card className="w-full max-w-3xl max-h-[70vh] glass border-white/20">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Results for "{searchTerm}"
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSearchTerm("");
                    setShowSearchResults(false);
                  }}
                  className="text-white hover:bg-white/10"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-blue-200">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p>Searching products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-blue-200">
                  <Search className="h-12 w-12 mx-auto mb-4 text-blue-300 opacity-50" />
                  <p className="text-lg font-medium mb-2">No products found</p>
                  <p className="text-sm">Try searching with different keywords</p>
                </div>
              ) : (
                <div className="grid gap-3 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-200 border border-white/10 hover:border-white/20"
                      onClick={() => addToCart(product)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-white">{product.name}</h3>
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                            {product.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-blue-200">
                          <span>₹{product.price}</span>
                          <span>Stock: {product.stock}</span>
                          <span>Brand: {product.brand}</span>
                          <span className="font-mono text-xs">{product.barcode}</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BillingModule;