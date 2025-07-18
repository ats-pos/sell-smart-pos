
import { Shield } from "lucide-react";

export const DemoCredentials = () => {
  return (
    <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
      <p className="text-sm text-blue-200 mb-2 flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Demo Credentials:
      </p>
      <div className="text-xs text-blue-300 space-y-1">
        <div>Admin: admin@spmpos.com / admin123</div>
        <div>Manager: manager@spmpos.com / manager123</div>
        <div>Cashier: cashier@spmpos.com / cashier123</div>
        <div>Phone: 9876543210 (OTP: 123456)</div>
      </div>
    </div>
  );
};
