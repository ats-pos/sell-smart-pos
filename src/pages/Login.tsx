import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import UserSelector from "@/components/auth/UserSelector";
import StoreRegistration from "@/components/auth/StoreRegistration";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginTabs } from "@/components/auth/LoginTabs";
import { PINLoginView } from "@/components/auth/PINLoginView";
import { ForgotPasswordView } from "@/components/auth/ForgotPasswordView";
import { DemoCredentials } from "@/components/auth/DemoCredentials";
import { LoginInput, OTPLoginInput, PINLoginInput, DeviceUser } from "@/lib/graphql/auth-types";

const Login = () => {
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

  // Redirect if already authenticated
  if (isAuthenticated && currentUser) {
    const redirectPath = currentUser.role === 'admin' ? '/admin' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  // UI State
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="w-full max-w-2xl relative z-10">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="w-full max-w-md relative z-10">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      <Card className="w-full max-w-md backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl relative z-10">
        <CardHeader className="text-center">
          <LoginHeader isOnline={isOnline} existingStore={existingStore} />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick User Access */}
          {deviceUsers.length > 0 && (
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
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