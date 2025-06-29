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
            onChange={(e) => onCustomerChange({...customer, name: e.target.value})}
            className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
          />
          <Input 
            placeholder="Phone Number (Optional)" 
            value={customer.phone || ""}
            onChange={(e) => onCustomerChange({...customer, phone: e.target.value})}
            className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
          />
          <Input 
            placeholder="Email (Optional)" 
            value={customer.email || ""}
            onChange={(e) => onCustomerChange({...customer, email: e.target.value})}
            className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
          />
          <Input 
            placeholder="GSTIN (Optional)" 
            value={customer.gstin || ""}
            onChange={(e) => onCustomerChange({...customer, gstin: e.target.value})}
            className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
          />
        </div>
      </CardContent>
    </Card>
  );
};