
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Receipt,
  User,
  LogOut,
  Menu,
  Store,
  Sparkles
} from "lucide-react";
import BillingModule from "@/components/BillingModule";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const SaleOperator = () => {
  const { logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-float delay-1000"></div>
      </div>

      {/* Modern Glassmorphism Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 sm:p-3 rounded-xl shadow-lg">
                <Receipt className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white gradient-text">SPM-POS</h1>
                <p className="text-xs sm:text-sm text-blue-200 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Sell Smart. Grow Fast.
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Link to={'/admin'}>
                <Badge variant="secondary" className="flex items-center gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-200">
                  <User className="h-4 w-4" />
                  Admin Dashboard
                </Badge>
              </Link>
              <Badge className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30">
                <Store className="h-4 w-4" />
                Sales Terminal
              </Badge>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover-lift" onClick={logout}>
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
                className="text-white hover:bg-white/10"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-white/10 bg-black/20 backdrop-blur-sm py-4 space-y-3 animate-slide-up">
              <Link to={'/admin'} className="block">
                <Badge variant="secondary" className="flex items-center gap-2 w-fit bg-white/10 text-white border-white/20">
                  <User className="h-4 w-4" />
                  Admin Dashboard
                </Badge>
              </Link>
              <Badge className="flex items-center gap-2 w-fit bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30">
                <Store className="h-4 w-4" />
                Sales Terminal
              </Badge>
              <Button variant="outline" size="sm" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <div className="mb-6 sm:mb-8">
          <div className="glass p-6 rounded-2xl border border-white/20 animate-slide-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Billing & Sales</h2>
            <p className="text-base sm:text-lg text-blue-200">Create new sales and manage customer billing</p>
          </div>
        </div>
        
        <div className="animate-slide-up delay-200">
          <BillingModule />
        </div>
      </main>
    </div>
  );
};

export default SaleOperator;
