
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGraphQLMutation } from "@/hooks/useGraphQL";
import { CREATE_SALE, CREATE_CUSTOMER } from "@/lib/graphql/mutations";
import { Product, Sale, SaleInput, SaleItem, Customer, CustomerInput } from "@/lib/graphql/types";
import { ProductSearch } from "./billing/ProductSearch";
import { CartItems } from "./billing/CartItems";
import { BillingSummary } from "./billing/BillingSummary";
import { CustomerDetails } from "./billing/CustomerDetails";
import { ManualItemDialog } from "./billing/ManualItemDialog";

const BillingModule = () => {
  const { toast } = useToast();
  
  // State management
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [customer, setCustomer] = useState<Partial<CustomerInput>>({
    name: "",
    phone: "",
    email: "",
    gstin: ""
  });
  const [billDiscount, setBillDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "amount">("percentage");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [currentBillNumber, setCurrentBillNumber] = useState("INV-2024-001");
  const [amountPaid, setAmountPaid] = useState("");
  const [showManualItemDialog, setShowManualItemDialog] = useState(false);

  // GraphQL mutations
  const { mutate: createSale, loading: saleLoading } = useGraphQLMutation<{
    createSale: Sale;
  }, { input: SaleInput }>(CREATE_SALE, {
    onCompleted: () => {
      toast({
        title: "Sale Completed",
        description: `Bill ${currentBillNumber} processed successfully.`,
      });
    }
  });

  const { mutate: createCustomer } = useGraphQLMutation<{
    createCustomer: Customer;
  }, { input: CustomerInput }>(CREATE_CUSTOMER);

  // Cart operations
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

  const addManualItem = (item: SaleItem) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const holdBill = () => {
    if (cart.length > 0) {
      toast({
        title: "Bill Held",
        description: "Bill has been saved and can be resumed later.",
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

  // Calculations
  const calculateItemTotal = (item: SaleItem) => {
    const itemTotal = item.price * item.quantity;
    return itemTotal - (itemTotal * item.discount / 100);
  };

  const subtotal = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  
  const billDiscountAmount = discountType === "percentage" 
    ? subtotal * billDiscount / 100 
    : Math.min(billDiscount, subtotal);
  
  const discountedSubtotal = subtotal - billDiscountAmount;
  const gst = discountedSubtotal * 0.18;
  const cst = discountedSubtotal * 0.05;
  const total = discountedSubtotal + gst + cst;
  const balanceDue = total - (parseFloat(amountPaid) || 0);

  // Actions
  const printReceipt = () => {
    toast({
      title: "Receipt Printed",
      description: `Receipt ${currentBillNumber} sent to thermal printer.`,
    });
  };

  const shareInvoice = () => {
    toast({
      title: "Invoice Shared",
      description: "Invoice shared via WhatsApp/Email/SMS.",
    });
  };

  const completeSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty. Add items to complete sale.",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }

    try {
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
        
        const nextNum = parseInt(currentBillNumber.split('-')[2]) + 1;
        setCurrentBillNumber(`INV-2024-${String(nextNum).padStart(3, '0')}`);
      }
    } catch (error) {
      console.error("Sale completion error:", error);
    }
  };

  return (
    <div className="p-3 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[calc(100vh-120px)]">
        {/* Left Panel - Product Search & Cart */}
        <div className="lg:col-span-2 space-y-4">
          <ProductSearch 
            onProductSelect={addToCart}
            onAddManualItem={() => setShowManualItemDialog(true)}
          />
          
          <CartItems
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onUpdateDiscount={updateItemDiscount}
            onRemoveItem={removeFromCart}
            onHoldBill={holdBill}
            onClearCart={clearCart}
          />
        </div>

        {/* Right Panel - Billing Summary & Customer */}
        <div className="space-y-4">
          <BillingSummary
            subtotal={subtotal}
            billDiscount={billDiscount}
            discountType={discountType}
            billDiscountAmount={billDiscountAmount}
            gst={gst}
            cst={cst}
            total={total}
            paymentMethod={paymentMethod}
            amountPaid={amountPaid}
            balanceDue={balanceDue}
            saleLoading={saleLoading}
            onDiscountChange={setBillDiscount}
            onDiscountTypeChange={setDiscountType}
            onPaymentMethodChange={setPaymentMethod}
            onAmountPaidChange={setAmountPaid}
            onCompleteSale={completeSale}
            onPrintReceipt={printReceipt}
            onShareInvoice={shareInvoice}
          />
          
          <CustomerDetails
            customer={customer}
            onCustomerChange={setCustomer}
          />
        </div>
      </div>

      <ManualItemDialog
        open={showManualItemDialog}
        onOpenChange={setShowManualItemDialog}
        onAddItem={addManualItem}
      />
    </div>
  );
};

export default BillingModule;
