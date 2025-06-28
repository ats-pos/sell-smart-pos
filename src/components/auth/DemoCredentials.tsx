
import { Shield } from "lucide-react";

const DemoCredentials = () => {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
      <p className="text-sm text-slate-700 mb-2 flex items-center gap-2 font-medium">
        <Shield className="h-4 w-4" />
        Demo Credentials:
      </p>
      <div className="text-xs text-slate-600 space-y-1 leading-relaxed">
        <div>Admin: admin@spmpos.com / admin123</div>
        <div>Manager: manager@spmpos.com / manager123</div>
        <div>Cashier: cashier@spmpos.com / cashier123</div>
        <div>Phone: 9876543210 (OTP: 123456)</div>
      </div>
    </div>
  );
};

export default DemoCredentials;
