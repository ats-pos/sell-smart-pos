
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Calculator,
  CreditCard,
  Printer,
  Share,
  Banknote,
  QrCode,
  DollarSign
} from "lucide-react";

interface BillingSummaryProps {
  subtotal: number;
  billDiscount: number;
  discountType: "percentage" | "amount";
  billDiscountAmount: number;
  gst: number;
  cst: number;
  total: number;
  paymentMethod: string;
  amountPaid: string;
  balanceDue: number;
  saleLoading: boolean;
  onDiscountChange: (discount: number) => void;
  onDiscountTypeChange: (type: "percentage" | "amount") => void;
  onPaymentMethodChange: (method: string) => void;
  onAmountPaidChange: (amount: string) => void;
  onCompleteSale: () => void;
  onPrintReceipt: () => void;
  onShareInvoice: () => void;
}

export const BillingSummary = ({
  subtotal,
  billDiscount,
  discountType,
  billDiscountAmount,
  gst,
  cst,
  total,
  paymentMethod,
  amountPaid,
  balanceDue,
  saleLoading,
  onDiscountChange,
  onDiscountTypeChange,
  onPaymentMethodChange,
  onAmountPaidChange,
  onCompleteSale,
  onPrintReceipt,
  onShareInvoice
}: BillingSummaryProps) => {
  return (
    <Card className="glass border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-base flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Billing Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {/* Summary Details */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-blue-200">Subtotal</span>
            <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          
          {/* Tax Breakdown */}
          <div className="bg-white/5 p-2 rounded space-y-1">
            <div className="text-xs font-medium text-white mb-1">Tax Breakdown</div>
            <div className="flex justify-between text-xs">
              <span className="text-blue-200">GST (18%)</span>
              <span className="text-white">₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-blue-200">CST (5%)</span>
              <span className="text-white">₹{cst.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-blue-200">Rounding</span>
            <span className="text-white">₹0.50</span>
          </div>
          
          <Separator className="bg-white/20" />
          
          <div className="flex justify-between text-base font-bold">
            <span className="text-white">Total</span>
            <span className="text-white">₹{(total + 0.5).toFixed(2)}</span>
          </div>
        </div>

        {/* Global Discount - Moved up for better flow */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-blue-200 text-sm">Global Discount</span>
            <ToggleGroup 
              type="single" 
              value={discountType} 
              onValueChange={(value) => value && onDiscountTypeChange(value as "percentage" | "amount")}
              className="h-6"
            >
              <ToggleGroupItem 
                value="percentage" 
                className="h-6 px-2 text-xs bg-white/10 border-white/20 text-white data-[state=on]:bg-blue-500"
              >
                %
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="amount" 
                className="h-6 px-2 text-xs bg-white/10 border-white/20 text-white data-[state=on]:bg-blue-500"
              >
                ₹
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="0"
              value={billDiscount}
              onChange={(e) => onDiscountChange(Number(e.target.value))}
              className="flex-1 h-7 bg-white/10 border-white/20 text-white text-sm"
              min="0"
              max={discountType === "percentage" ? "100" : subtotal.toString()}
            />
            {billDiscountAmount > 0 && (
              <span className="text-green-300 text-sm">-₹{billDiscountAmount.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Payment Method with Icons */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Payment Method</label>
          <ToggleGroup 
            type="single" 
            value={paymentMethod} 
            onValueChange={(value) => value && onPaymentMethodChange(value)}
            className="grid grid-cols-2 gap-1"
          >
            <ToggleGroupItem 
              value="cash" 
              className="flex flex-col items-center gap-1 h-12 bg-white/10 border-white/20 text-white data-[state=on]:bg-green-500/30 data-[state=on]:border-green-500/50"
            >
              <Banknote className="h-4 w-4" />
              <span className="text-xs">Cash</span>
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="card" 
              className="flex flex-col items-center gap-1 h-12 bg-white/10 border-white/20 text-white data-[state=on]:bg-blue-500/30 data-[state=on]:border-blue-500/50"
            >
              <CreditCard className="h-4 w-4" />
              <span className="text-xs">Card</span>
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="upi" 
              className="flex flex-col items-center gap-1 h-12 bg-white/10 border-white/20 text-white data-[state=on]:bg-purple-500/30 data-[state=on]:border-purple-500/50"
            >
              <QrCode className="h-4 w-4" />
              <span className="text-xs">UPI</span>
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="split" 
              className="flex flex-col items-center gap-1 h-12 bg-white/10 border-white/20 text-white data-[state=on]:bg-orange-500/30 data-[state=on]:border-orange-500/50"
            >
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Split</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Amount Paid */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-white">Amount Paid</label>
          <Input
            type="number"
            placeholder="0.00"
            value={amountPaid}
            onChange={(e) => onAmountPaidChange(e.target.value)}
            className="h-8 bg-white/10 border-white/20 text-white placeholder:text-blue-200"
          />
        </div>

        {/* Balance Due */}
        <div className="flex justify-between text-base font-bold p-2 bg-white/5 rounded">
          <span className="text-white">Balance Due</span>
          <span className={`${balanceDue > 0 ? 'text-red-300' : 'text-green-300'}`}>
            ₹{Math.max(0, balanceDue + 0.5).toFixed(2)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button 
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg h-10 text-base font-semibold"
            onClick={onCompleteSale}
            disabled={saleLoading}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {saleLoading ? "Processing..." : "Complete Sale"}
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8"
              onClick={onPrintReceipt}
            >
              <Printer className="h-3 w-3 mr-1" />
              Print
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8"
              onClick={onShareInvoice}
            >
              <Share className="h-3 w-3 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
