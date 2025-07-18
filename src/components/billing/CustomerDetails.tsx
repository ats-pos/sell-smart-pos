
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { CustomerInput } from "@/lib/graphql/types";

interface CustomerDetailsProps {
  customer: Partial<CustomerInput>;
  onCustomerChange: (customer: Partial<CustomerInput>) => void;
}

export const CustomerDetails = ({ customer, onCustomerChange }: CustomerDetailsProps) => {
  return (
    <Card className="glass border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-base flex items-center gap-2">
          <User className="h-4 w-4" />
          Customer Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        <div className="space-y-2">
          <Input 
            placeholder="Customer Name (Optional)" 
            value={customer.name || ""}
            onChange={(e) => onCustomerChange({...customer, name: e.target.value})}
            className="h-8 bg-white/10 border-white/20 text-white placeholder:text-blue-200 text-sm"
          />
          <Input 
            placeholder="Phone Number (Optional)" 
            value={customer.phone || ""}
            onChange={(e) => onCustomerChange({...customer, phone: e.target.value})}
            className="h-8 bg-white/10 border-white/20 text-white placeholder:text-blue-200 text-sm"
          />
          <Input 
            placeholder="Email (Optional)" 
            value={customer.email || ""}
            onChange={(e) => onCustomerChange({...customer, email: e.target.value})}
            className="h-8 bg-white/10 border-white/20 text-white placeholder:text-blue-200 text-sm"
          />
          <Input 
            placeholder="GSTIN (Optional)" 
            value={customer.gstin || ""}
            onChange={(e) => onCustomerChange({...customer, gstin: e.target.value})}
            className="h-8 bg-white/10 border-white/20 text-white placeholder:text-blue-200 text-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
};
