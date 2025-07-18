
import { DefaultHeader } from "@/components/common/DefaultHeader";
import BillingModule from "@/components/BillingModule";

const SaleOperator = () => {
  return (
    <div className="page-layout">
      {/* Animated background elements */}
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
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
      <main className="main-content">
        <BillingModule />
      </main>
    </div>
  );
};

export default SaleOperator;
