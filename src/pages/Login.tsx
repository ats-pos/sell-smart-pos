
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import UserSelector from "@/components/auth/UserSelector";
import StoreRegistration from "@/components/auth/StoreRegistration";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginTabs } from "@/components/auth/LoginTabs";
import { PINLoginView } from "@/components/auth/PINLoginView";
import { ForgotPasswordView } from "@/components/auth/ForgotPasswordView";
import { DemoCredentials } from "@/components/auth/DemoCredentials";
import { LoginInput, OTPLoginInput, PINLoginInput, DeviceUser } from "@/lib/graphql/auth-types";
import './Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isAuthenticated,
    currentUser,
    isOnline,
    deviceUsers,
    storeExists,
    existingStore,
    loginLoading,
    otpLoginLoading,
    pinLoginLoading,
    sendingOTP,
    registerLoading,
    forgotLoading,
    usersLoading,
    storeCheckLoading,
    handleLogin,
    handleOTPLogin,
    handlePINLogin,
    handleSendOTP,
    handleStoreRegistration,
    handleForgotPassword,
    handleBiometricLogin
  } = useAuth();

  // UI State - All hooks must be declared before any conditional returns
  const [currentView, setCurrentView] = useState<'main' | 'users' | 'register' | 'pin' | 'forgot'>('main');
  const [activeTab, setActiveTab] = useState("email");
  const [selectedUser, setSelectedUser] = useState<DeviceUser | null>(null);

  // Form States
  const [emailForm, setEmailForm] = useState<LoginInput>({
    email: "",
    password: "",
    rememberMe: false
  });

  const [otpForm, setOtpForm] = useState<OTPLoginInput>({
    phone: "",
    otp: ""
  });

  const [pinForm, setPinForm] = useState<PINLoginInput>({
    userId: "",
    pin: ""
  });

  const [otpSent, setOtpSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // Handle authentication redirect
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Get the intended destination from location state or default based on role
      const from = location.state?.from?.pathname;
      let redirectPath;
      
      if (from && from !== '/login') {
        redirectPath = from;
      } else {
        redirectPath = currentUser.role === 'admin' ? '/admin' : '/';
      }
      
      // Use setTimeout to ensure the redirect happens after the current render cycle
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);
    }
  }, [isAuthenticated, currentUser, navigate, location.state]);

  // Show loading state while authenticated user exists but hasn't redirected yet
  if (isAuthenticated && currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  // Event Handlers
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(emailForm);
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpSent) {
      const success = await handleSendOTP(otpForm.phone);
      if (success) {
        setOtpSent(true);
      }
    } else {
      await handleOTPLogin(otpForm);
    }
  };

  const handlePINSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && pinForm.pin.length >= 4) {
      await handlePINLogin({
        userId: selectedUser.id,
        pin: pinForm.pin
      });
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleForgotPassword(forgotEmail);
    if (success) {
      setCurrentView('main');
      setForgotEmail("");
    }
  };

  const handleUserSelect = (user: DeviceUser) => {
    setSelectedUser(user);
    setCurrentView('pin');
    setPinForm({ userId: user.id, pin: "" });
  };

  const handleBiometric = async () => {
    if (selectedUser) {
      try {
        const biometricData = `biometric-${selectedUser.id}-${Date.now()}`;
        await handleBiometricLogin(selectedUser.id, biometricData);
      } catch (error) {
        console.error('Biometric authentication failed:', error);
      }
    }
  };

  // Store Registration View
  if (currentView === 'register') {
    return (
      <div className="login-layout">
        <div className="bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </div>
        
        <div className="login-container">
          <StoreRegistration
            onRegister={handleStoreRegistration}
            onBack={() => setCurrentView('main')}
            loading={registerLoading}
          />
        </div>
      </div>
    );
  }

  // User Selection View
  if (currentView === 'users') {
    return (
      <div className="login-layout">
        <div className="bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </div>
        
        <div className="login-container login-container-sm">
          <UserSelector
            users={deviceUsers}
            onUserSelect={handleUserSelect}
            onAddNewUser={() => setCurrentView('main')}
            onBack={() => setCurrentView('main')}
            loading={usersLoading}
          />
        </div>
      </div>
    );
  }

  // PIN Login View
  if (currentView === 'pin' && selectedUser) {
    return (
      <PINLoginView
        selectedUser={selectedUser}
        pinForm={pinForm}
        setPinForm={setPinForm}
        pinLoginLoading={pinLoginLoading}
        onPINSubmit={handlePINSubmit}
        onBiometric={handleBiometric}
        onBack={() => setCurrentView('users')}
        onForgotPIN={() => setCurrentView('forgot')}
      />
    );
  }

  // Forgot Password View
  if (currentView === 'forgot') {
    return (
      <ForgotPasswordView
        forgotEmail={forgotEmail}
        setForgotEmail={setForgotEmail}
        forgotLoading={forgotLoading}
        onForgotSubmit={handleForgotSubmit}
        onBack={() => setCurrentView('main')}
      />
    );
  }

  // Main Login View
  return (
    <div className="login-layout">
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <Card className="login-card">
        <CardHeader className="login-header">
          <LoginHeader isOnline={isOnline} existingStore={existingStore} />
        </CardHeader>

        <CardContent className="login-content">
          {/* Quick User Access */}
          {deviceUsers.length > 0 && (
            <Button
              variant="outline"
              className="quick-login-btn"
              onClick={() => setCurrentView('users')}
            >
              <Users className="h-4 w-4" />
              Quick Login ({deviceUsers.length} users)
            </Button>
          )}

          <LoginTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            emailForm={emailForm}
            setEmailForm={setEmailForm}
            otpForm={otpForm}
            setOtpForm={setOtpForm}
            otpSent={otpSent}
            setOtpSent={setOtpSent}
            loginLoading={loginLoading}
            otpLoginLoading={otpLoginLoading}
            sendingOTP={sendingOTP}
            onEmailLogin={handleEmailLogin}
            onOTPSubmit={handleOTPSubmit}
            onForgotPassword={() => setCurrentView('forgot')}
            onRegisterStore={() => setCurrentView('register')}
          />
          
          <DemoCredentials />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
