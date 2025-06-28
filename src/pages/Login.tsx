
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserSelector from "@/components/auth/UserSelector";
import StoreRegistration from "@/components/auth/StoreRegistration";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginTabs from "@/components/auth/LoginTabs";
import PINLoginView from "@/components/auth/PINLoginView";
import ForgotPasswordView from "@/components/auth/ForgotPasswordView";
import DemoCredentials from "@/components/auth/DemoCredentials";
import { LoginInput, OTPLoginInput, PINLoginInput, DeviceUser } from "@/lib/graphql/auth-types";

const Login = () => {
  const {
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

  // Biometric authentication check
  useEffect(() => {
    if ('credentials' in navigator) {
      console.log('WebAuthn API available');
    }
  }, []);

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

  const handleForgotSubmit = async (email: string) => {
    const success = await handleForgotPassword(email);
    if (success) {
      setCurrentView('main');
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl animate-fade-in">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
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
        onForgotPassword={() => setCurrentView('forgot')}
        onBack={() => setCurrentView('users')}
      />
    );
  }

  // Forgot Password View
  if (currentView === 'forgot') {
    return (
      <ForgotPasswordView
        forgotLoading={forgotLoading}
        onForgotSubmit={handleForgotSubmit}
        onBack={() => setCurrentView('main')}
      />
    );
  }

  // Main Login View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in shadow-medium border-0">
        <CardHeader>
          <LoginHeader isOnline={isOnline} existingStore={existingStore} />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick User Access */}
          {deviceUsers.length > 0 && (
            <Button
              variant="outline"
              className="w-full h-12 flex items-center gap-2 border-slate-200 hover:bg-slate-50 rounded-xl font-medium"
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
            onRegister={() => setCurrentView('register')}
          />
          
          <DemoCredentials />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
