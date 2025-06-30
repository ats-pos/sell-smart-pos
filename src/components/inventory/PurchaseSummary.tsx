
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stack, Grid } from "@/components/design-system";

interface PurchaseSummaryProps {
  totals: {
    subtotal: number;
    gstTotal: number;
    grandTotal: number;
  };
  paymentType: string;
  itemCount?: number;
  paidAmount?: number;
  onPaidAmountChange?: (amount: number) => void;
}

export const PurchaseSummary = ({ 
  totals, 
  paymentType, 
  itemCount = 0,
  paidAmount = 0,
  onPaidAmountChange 
}: PurchaseSummaryProps) => {
  const dueAmount = totals.grandTotal - paidAmount;
  const avgCost = itemCount > 0 ? totals.subtotal / itemCount : 0;

  return (
    <Stack gap={6}>
      {/* Purchase Totals */}
      <Card variant="glass">
        <CardContent className="pt-6">
          <Stack gap={4}>
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Subtotal:</span>
              <span className="font-medium text-white">₹{totals.subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-blue-200">GST Total:</span>
              <span className="font-medium text-white">₹{totals.gstTotal.toFixed(2)}</span>
            </div>
            
            <Separator className="bg-white/20" />
            
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-white">Grand Total:</span>
              <span className="text-white">₹{totals.grandTotal.toFixed(2)}</span>
            </div>
          </Stack>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card variant="glass">
        <CardContent className="pt-6">
          <Stack gap={4}>
            <div className="flex items-center justify-between">
              <Label className="text-white">Payment Type:</Label>
              <Badge variant="outline" className="capitalize">
                {paymentType}
              </Badge>
            </div>

            {paymentType === 'credit' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="paidAmount" className="text-white">
                    Paid Amount (₹)
                  </Label>
                  <Input
                    id="paidAmount"
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={paidAmount}
                    onChange={(e) => onPaidAmountChange?.(Number(e.target.value))}
                  />
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-200">Due Amount:</span>
                  <span className={`font-medium ${dueAmount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    ₹{Math.max(0, dueAmount).toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Purchase Statistics */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10">
        <CardHeader>
          <CardTitle className="text-blue-300 text-lg">Purchase Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid cols={2} gap={4}>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{itemCount}</div>
              <div className="text-sm text-blue-200">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">₹{avgCost.toFixed(0)}</div>
              <div className="text-sm text-blue-200">Avg. Cost</div>
            </div>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};
