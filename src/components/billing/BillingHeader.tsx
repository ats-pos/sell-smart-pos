
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Settings, User } from "lucide-react";

interface BillingHeaderProps {
  isOnline: boolean;
  billNumber: string;
  storeName?: string;
  cashierName?: string;
}

export const BillingHeader = ({ 
  isOnline, 
  billNumber, 
  storeName = "Store Name",
  cashierName = "John Doe" 
}: BillingHeaderProps) => {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white rounded-lg p-2 text-sm font-bold">
            SPMPOS
          </div>
          <div className="text-sm text-gray-600">
            {currentDate}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <select className="text-sm border border-gray-300 rounded px-2 py-1">
            <option>4ztain Inhe</option>
          </select>
          <span className="text-sm font-medium">{cashierName}</span>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <Badge variant={isOnline ? "default" : "destructive"} className="text-xs">
          {isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
          {isOnline ? "Online" : "Offline"}
        </Badge>
        <div className="text-xs text-gray-500">
          Bill: {billNumber}
        </div>
      </div>
    </div>
  );
};
