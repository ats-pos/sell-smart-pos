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
import { MockModeIndicator } from "./MockModeIndicator";

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
    <header className="header">
      <div className="header__container">
        <div className="flex-responsive--between">
          <div className="header__brand">
            <div className="header__logo">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="header__title">{title}</h1>
              {showUserInfo ? (
                <div className="header__subtitle">
                  <span>{getCurrentDate()}</span>
                  {/* <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">4ztain Inne</span> */}
                  <span className="hidden sm:inline">•</span>
                  <span>John Doe</span>
                </div>
                              ) : (
                <p className="header__subtitle">
                  <Sparkles className="h-3 w-3" />
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="header__actions">
            {/* Online Status */}
            <div className={`status-badge ${isOnline ? 'status-badge--online' : 'status-badge--offline'}`}>
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isOnline ? "Online" : "Offline"}
            </div>

            <MockModeIndicator />

            {/* Custom Actions */}
            {customActions}

            {/* Admin Dashboard Button */}
            {showAdminDashboard && (
              <button
                onClick={handleAdminDashboard}
                className="header-btn"
              >
                <User className="h-3 w-3" />
                <span className="hidden md:inline">Admin</span>
              </button>
            )}

            {/* Settings Button */}
            {showSettings && (
              <button
                onClick={handleSettings}
                className="header-btn"
              >
                <Settings className="h-3 w-3" />
                <span className="hidden md:inline">Settings</span>
              </button>
            )}

            {/* Logout Button */}
            {showLogout && (
              <button
                onClick={handleLogout}
                className="header-btn"
              >
                <LogOut className="h-3 w-3 mr-1" />
                <span className="hidden md:inline">Logout</span>
              </button>
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