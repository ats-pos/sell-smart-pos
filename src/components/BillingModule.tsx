
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGraphQLQuery, useGraphQLMutation } from "@/hooks/useGraphQL";
import { GET_PRODUCTS, SEARCH_PRODUCTS } from "@/lib/graphql/queries";
import { CREATE_SALE, CREATE_CUSTOMER } from "@/lib/graphql/mutations";
import { Product, Sale, SaleInput, SaleItem, Customer, CustomerInput } from "@/lib/graphql/types";

import { BillingHeader } from "./billing/BillingHeader";
import { ProductSearch } from "./billing/ProductSearch";
import { CartSection } from "./billing/CartSection";
import { BillingSummary } from "./billing/BillingSummary";

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
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isOnline, setIsOnline] = useState(true);
  const [currentBillNumber, setCurrentBillNumber] = useState("INV-2024-001");

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
    setSearchTerm(""); // Clear search after adding
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const addManualItem = () => {
    const itemName = prompt("Enter item name:");
    const itemPrice = prompt("Enter item price:");
    
    if (itemName && itemPrice) {
      const newItem: SaleItem = {
        id: Date.now().toString(),
        productId: "manual-" + Date.now(),
        productName: itemName,
        price: parseFloat(itemPrice),
        quantity: 1,
        discount: 0,
        total: parseFloat(itemPrice)
      };
      setCart([...cart, newItem]);
    }
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

  const shareInvoice = () => {
    toast({
      title: "Invoice Shared",
      description: "Invoice shared successfully."
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
        setCart([]);
        setCustomer({ name: "", phone: "", email: "", gstin: "" });
        setPaymentMethod("cash");
        setBillDiscount(0);
        
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
    <div className="h-screen flex flex-col bg-gray-50">
      <BillingHeader 
        isOnline={isOnline}
        billNumber={currentBillNumber}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <ProductSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            products={products}
            loading={loading}
            onAddToCart={addToCart}
            onAddManualItem={addManualItem}
          />
          
          <CartSection
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onUpdateDiscount={updateItemDiscount}
            onRemoveItem={removeFromCart}
            calculateItemTotal={calculateItemTotal}
          />
        </div>
        
        <BillingSummary
          subtotal={subtotal}
          gstAmount={gst}
          discount={billDiscountAmount}
          total={total}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          onCompleteeSale={completeSale}
          onPrintReceipt={printReceipt}
          onShareInvoice={shareInvoice}
          loading={saleLoading}
        />
      </div>
    </div>
  );
};

export default BillingModule;
