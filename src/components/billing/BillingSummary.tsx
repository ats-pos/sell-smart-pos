
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface BillingSummaryProps {
  subtotal: number;
  gstAmount: number;
  discount: number;
  total: number;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  onCompleteeSale: () => void;
  onPrintReceipt: () => void;
  onShareInvoice: () => void;
  loading: boolean;
}

export const BillingSummary = ({
  subtotal,
  gstAmount,
  discount,
  total,
  paymentMethod,
  onPaymentMethodChange,
  onCompleteeSale,
  onPrintReceipt,
  onShareInvoice,
  loading
}: BillingSummaryProps) => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4">
      <h3 className="font-bold text-lg mb-4">Billing Summary</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>GST 18%</span>
          <span>₹{gstAmount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>5% CST</span>
          <span>₹{(subtotal * 0.05).toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Global Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Rounding</span>
          <span>₹0.50</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Payment Method</label>
          <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Cash" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="split">Split Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Amount Paid</label>
          <Input placeholder="Enter amount" className="border-gray-300" />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Balance Due</label>
          <div className="text-right font-bold text-lg">₹{total.toFixed(2)}</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={onCompleteeSale}
          disabled={loading}
        >
          {loading ? "Processing..." : "Complete Sale"}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onPrintReceipt}
        >
          Print Receipt
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onShareInvoice}
        >
          Share Invoice
        </Button>
      </div>
    </div>
  );
};
