import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  ShoppingCart
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
  const [paymentMethod, setPaymentMethod] = useState("");
  const [holdBills, setHoldBills] = useState<any[]>([]);
  const [currentBillNumber, setCurrentBillNumber] = useState("INV-2024-001");
  const [amountPaid, setAmountPaid] = useState("");

  // GraphQL hooks
  const { data: productsData, loading: productsLoading } = useGraphQLQuery<{
    products: Product[];
  }>(GET_PRODUCTS, {
    variables: { limit: 50 },
    skip: !searchTerm || searchTerm.length < 2
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
      setCart([]);
      setCustomer({ name: "", phone: "", email: "", gstin: "" });
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
  const billDiscountAmount = subtotal * billDiscount / 100;
  const discountedSubtotal = subtotal - billDiscountAmount;
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

  const products = searchTerm.length >= 2 
    ? (searchData?.searchProducts || [])
    : (productsData?.products || []);

  const loading = searchTerm.length >= 2 ? searchLoading : productsLoading;

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-140px)]">
        {/* Left Panel - Product Search & Cart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <Card className="glass border-white/20">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Enter product name or scan barcode"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                  />
                </div>
                <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white">
                  <Bluetooth className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
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
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card className="glass border-white/20 flex-1">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Cart Items</CardTitle>
                <div className="text-sm text-blue-200">
                  Total: ₹{cart.reduce((sum, item) => sum + calculateItemTotal(item), 0).toFixed(2)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-blue-200">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-blue-300" />
                  <p>No items in cart</p>
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
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center py-2 border-b border-white/10">
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
                            className="h-6 w-6 p-0 bg-white/10 border-white/20 text-white"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-white text-sm">{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-6 w-6 p-0 bg-white/10 border-white/20 text-white"
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
                          <Input
                            type="number"
                            placeholder="0"
                            value={item.discount}
                            onChange={(e) => updateItemDiscount(item.id, Number(e.target.value))}
                            className="h-6 w-12 text-xs bg-white/10 border-white/20 text-white"
                            min="0"
                            max="100"
                          />
                          <Percent className="h-3 w-3 text-gray-400" />
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="h-6 w-6 p-0"
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
          <Card className="glass border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Billing Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary Details */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Subtotal</span>
                  <span className="text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">GST 18%</span>
                  <span className="text-white">₹{gst.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">5% CST</span>
                  <span className="text-white">₹{cst.toFixed(2)}</span>
                </div>
                
                {billDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-300">Global Discount</span>
                    <span className="text-green-300">-₹{billDiscountAmount.toFixed(2)}</span>
                  </div>
                )}
                
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

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Cash" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card Payment</SelectItem>
                    <SelectItem value="upi">UPI Payment</SelectItem>
                    <SelectItem value="split">Split Payment</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">Balance Due</span>
                <span className="text-white">₹{Math.max(0, balanceDue + 0.5).toFixed(2)}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg h-12"
                  onClick={completeSale}
                  disabled={cart.length === 0 || !paymentMethod || saleLoading}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {saleLoading ? "Processing..." : "Complete Sale"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={printReceipt}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={shareInvoice}
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Search Results (if searching) */}
      {searchTerm.length >= 2 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-96 glass border-white/20">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Search Results</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSearchTerm("")}
                  className="text-white hover:bg-white/10"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-blue-200">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-8 text-blue-200">No products found</div>
              ) : (
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                      onClick={() => {
                        addToCart(product);
                        setSearchTerm("");
                      }}
                    >
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-sm text-blue-200">₹{product.price} • Stock: {product.stock}</p>
                      </div>
                      <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white">
                        <Plus className="h-4 w-4" />
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