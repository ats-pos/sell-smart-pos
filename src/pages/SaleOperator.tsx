
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Receipt,
  User,
  LogOut,
  Menu
} from "lucide-react";
import BillingModule from "@/components/BillingModule";
import { Link } from "react-router-dom";
import { useState } from "react";

const SaleOperator = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
                <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">SPMPOS</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Sell Smart. Grow Fast.</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              <Link to={'/admin'}>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Admin
                </Badge>
              </Link>
              <Badge variant="secondary" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Sale Operator
              </Badge>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="md:hidden border-t bg-white py-2 space-y-2">
              <Link to={'/admin'} className="block">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <User className="h-3 w-3" />
                  Admin
                </Badge>
              </Link>
              <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                <User className="h-3 w-3" />
                Sale Operator
              </Badge>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Billing & Sales</h2>
          <p className="text-sm sm:text-base text-gray-600">Create new sales and manage customer billing</p>
        </div>
        
        <BillingModule />
      </main>
    </div>
  );
};

export default SaleOperator;
