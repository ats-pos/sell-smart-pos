import { DefaultHeader } from "@/components/common/DefaultHeader";
import BillingModule from "@/components/BillingModule";

const SaleOperator = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-float delay-1000"></div>
      </div>

      {/* Default Header */}
      <DefaultHeader 
        title="SPM-POS"
        subtitle="Sales Terminal"
        showUserInfo={true}
        showSettings={true}
        showLogout={true}
        showAdminDashboard={true}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto relative z-10">
        <BillingModule />
      </main>
    </div>
  );
};

export default SaleOperator;