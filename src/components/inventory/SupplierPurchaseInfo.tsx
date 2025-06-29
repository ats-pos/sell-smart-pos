
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PurchaseData } from "./PurchaseEntryScreen";

interface SupplierPurchaseInfoProps {
  data: PurchaseData;
  onChange: (updates: Partial<PurchaseData>) => void;
}

export const SupplierPurchaseInfo = ({ data, onChange }: SupplierPurchaseInfoProps) => {
  const suppliers = [
    "ABC Electronics Pvt. Ltd.",
    "XYZ Trading Company",
    "Global Suppliers Inc.",
    "Local Wholesale Market"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="supplier">Supplier Name *</Label>
        <div className="flex gap-2">
          <Select 
            value={data.supplier.name} 
            onValueChange={(value) => onChange({ supplier: { name: value } })}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map(supplier => (
                <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoiceNumber">Purchase Invoice Number *</Label>
        <Input
          id="invoiceNumber"
          value={data.invoiceNumber}
          onChange={(e) => onChange({ invoiceNumber: e.target.value })}
          placeholder="Enter invoice/bill number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="purchaseDate">Purchase Date</Label>
        <Input
          id="purchaseDate"
          type="date"
          value={data.purchaseDate}
          onChange={(e) => onChange({ purchaseDate: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentType">Payment Type</Label>
        <Select 
          value={data.paymentType} 
          onValueChange={(value: any) => onChange({ paymentType: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="bank">Bank Transfer</SelectItem>
            <SelectItem value="credit">Credit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={data.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Any additional remarks or notes"
          rows={3}
        />
      </div>
    </div>
  );
};
