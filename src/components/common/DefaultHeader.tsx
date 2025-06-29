import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Receipt,
  Settings,
  Menu,
  Wifi,
  WifiOff,
  LogOut,
  User,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface DefaultHeaderProps {
  title?: string;
  subtitle?: string;
  showUserInfo?: boolean;
  showSettings?: boolean;
  showLogout?: boolean;
  showAdminDashboard?: boolean;
  customActions?: React.ReactNode;
}

export const DefaultHeader = ({
  title = "SPM-POS",
  subtitle = "Sell Smart. Grow Fast.",
  showUserInfo = true,
  showSettings = true,
  showLogout = true,
  showAdminDashboard = false,
  customActions
}: DefaultHeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isOnline] = useState(navigator.onLine);

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setShowMobileMenu(false);
  };

  const handleAdminDashboard = () => {
    navigate('/admin');
    setShowMobileMenu(false);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl shadow-lg">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white gradient-text">{title}</h1>
              {showUserInfo ? (
                <div className="flex items-center gap-2 text-xs text-blue-200">
                  <span>{getCurrentDate()}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">4ztain Inne</span>
                  <span className="hidden sm:inline">•</span>
                  <span>John Doe</span>
                </div>
              ) : (
                <p className="text-xs text-blue-200 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-2">
            {/* Online Status */}
            <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1 text-xs">
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isOnline ? "Online" : "Offline"}
            </Badge>

            {/* Custom Actions */}
            {customActions}

            {/* Admin Dashboard Button */}
            {showAdminDashboard && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAdminDashboard}
                className="flex items-center gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20 hover-lift h-8 px-3 text-xs"
              >
                <User className="h-3 w-3" />
                <span className="hidden md:inline">Admin</span>
              </Button>
            )}

            {/* Settings Button */}
            {showSettings && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSettings}
                className="flex items-center gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20 hover-lift h-8 px-3 text-xs"
              >
                <Settings className="h-3 w-3" />
                <span className="hidden md:inline">Settings</span>
              </Button>
            )}

            {/* Logout Button */}
            {showLogout && (
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover-lift h-8 px-3 text-xs" 
                onClick={handleLogout}
              >
                <LogOut className="h-3 w-3 mr-1" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="sm:hidden border-t border-white/10 bg-black/20 backdrop-blur-sm py-4 space-y-3 animate-slide-up">
            {/* Online Status */}
            <div className="flex justify-center">
              <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
                {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>

            {/* Admin Dashboard Button */}
            {showAdminDashboard && (
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={handleAdminDashboard}
              >
                <User className="h-4 w-4" />
                Admin Dashboard
              </Button>
            )}

            {/* Settings Button */}
            {showSettings && (
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={handleSettings}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            )}

            {/* Logout Button */}
            {showLogout && (
              <Button 
                variant="outline" 
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};