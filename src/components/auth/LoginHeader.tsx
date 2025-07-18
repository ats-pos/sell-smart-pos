
import { Badge } from "@/components/ui/badge";
import { Receipt, Sparkles, Wifi, WifiOff, Store } from "lucide-react";
import { ApiStatusIndicator } from "@/components/common/MockModeIndicator";
import { Store as StoreType } from "@/lib/graphql/auth-types";

interface LoginHeaderProps {
  isOnline: boolean;
  existingStore?: StoreType | null;
}

export const LoginHeader = ({ isOnline, existingStore }: LoginHeaderProps) => {
  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl shadow-lg">
          <Receipt className="h-10 w-10 text-white" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-white mb-2 text-center">SPM-POS</h1>
      
      <p className="text-blue-100 mb-4 flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4" />
        Sell Smart. Grow Fast.
        <Sparkles className="h-4 w-4" />
      </p>
      
      {/* API Status and Online/Offline Status */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <ApiStatusIndicator />
        {isOnline ? (
          <Badge variant="default" className="flex items-center gap-1 bg-green-500/20 text-green-300 border-green-500/30">
            <Wifi className="h-3 w-3" />
            Online
          </Badge>
        ) : (
          <Badge variant="destructive" className="flex items-center gap-1 bg-red-500/20 text-red-300 border-red-500/30">
            <WifiOff className="h-3 w-3" />
            Offline Mode
          </Badge>
        )}
      </div>

      {/* Store Info */}
      {existingStore && (
        <div className="mb-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-2 justify-center">
            <Store className="h-4 w-4 text-blue-300" />
            <span className="text-sm font-medium text-white">{existingStore.name}</span>
          </div>
        </div>
      )}
    </>
  );
};
