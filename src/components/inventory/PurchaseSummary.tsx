
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface PurchaseSummaryProps {
  totals: {
    subtotal: number;
    gstTotal: number;
    grandTotal: number;
  };
  paymentType: string;
}

export const PurchaseSummary = ({ totals, paymentType }: PurchaseSummaryProps) => {
  return (
    <div className="space-y-4">
      {/* Totals */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">₹{totals.subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">GST Total:</span>
          <span className="font-medium">₹{totals.gstTotal.toFixed(2)}</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Grand Total:</span>
          <span>₹{totals.grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Payment Type:</Label>
          <Badge variant="outline" className="capitalize">{paymentType}</Badge>
        </div>

        {paymentType === 'credit' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="paidAmount">Paid Amount (₹)</Label>
              <Input
                id="paidAmount"
                type="number"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Due Amount:</span>
              <span className="font-medium text-red-600">₹{totals.grandTotal.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Purchase Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Total Items:</span>
            <div className="font-medium">0</div>
          </div>
          <div>
            <span className="text-blue-700">Avg. Cost:</span>
            <div className="font-medium">₹0</div>
          </div>
        </div>
      </div>
    </div>
  );
};
