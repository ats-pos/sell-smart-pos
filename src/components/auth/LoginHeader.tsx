
import { Receipt, Sparkles, Store, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ApiStatusIndicator } from "@/components/common/MockModeIndicator";
import { Store as StoreType } from "@/lib/graphql/auth-types";

interface LoginHeaderProps {
  isOnline: boolean;
  existingStore?: StoreType;
}

const LoginHeader = ({ isOnline, existingStore }: LoginHeaderProps) => {
  return (
    <div className="text-center pb-6">
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-2xl shadow-soft">
          <Receipt className="h-8 w-8 text-white" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">SPM-POS</h1>
      <p className="text-sm text-slate-600 mb-4 flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4 text-indigo-500" />
        Sell Smart. Grow Fast.
        <Sparkles className="h-4 w-4 text-indigo-500" />
      </p>
      
      {/* Status Indicators */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <ApiStatusIndicator />
        {isOnline ? (
          <Badge variant="secondary" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 px-3 py-1">
            <Wifi className="h-3 w-3" />
            Online
          </Badge>
        ) : (
          <Badge variant="destructive" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200 px-3 py-1">
            <WifiOff className="h-3 w-3" />
            Offline Mode
          </Badge>
        )}
      </div>

      {/* Store Info */}
      {existingStore && (
        <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 justify-center">
            <Store className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">{existingStore.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginHeader;
