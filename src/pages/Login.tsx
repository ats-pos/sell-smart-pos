
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { 
  Receipt, 
  Eye, 
  EyeOff, 
  Phone, 
  Mail, 
  Lock, 
  Fingerprint,
  Users,
  Store,
  Wifi,
  WifiOff,
  Shield,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ApiStatusIndicator } from "@/components/common/MockModeIndicator";
import UserSelector from "@/components/auth/UserSelector";
import StoreRegistration from "@/components/auth/StoreRegistration";
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
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm animate-scale-in shadow-medium border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentView('users')}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full shadow-soft">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div className="w-8" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-800">Enter PIN</CardTitle>
            <p className="text-sm text-slate-600">Welcome back, {selectedUser.name}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handlePINSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">Enter your PIN</Label>
                <InputOTP
                  maxLength={6}
                  value={pinForm.pin}
                  onChange={(value) => setPinForm({ ...pinForm, pin: value })}
                >
                  <InputOTPGroup className="gap-2 justify-center">
                    <InputOTPSlot index={0} className="w-12 h-12 border border-slate-200 rounded-xl text-lg font-semibold" />
                    <InputOTPSlot index={1} className="w-12 h-12 border border-slate-200 rounded-xl text-lg font-semibold" />
                    <InputOTPSlot index={2} className="w-12 h-12 border border-slate-200 rounded-xl text-lg font-semibold" />
                    <InputOTPSlot index={3} className="w-12 h-12 border border-slate-200 rounded-xl text-lg font-semibold" />
                    <InputOTPSlot index={4} className="w-12 h-12 border border-slate-200 rounded-xl text-lg font-semibold" />
                    <InputOTPSlot index={5} className="w-12 h-12 border border-slate-200 rounded-xl text-lg font-semibold" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-soft hover:shadow-medium transition-all duration-200"
                disabled={pinForm.pin.length < 4 || pinLoginLoading}
              >
                {pinLoginLoading ? "Verifying..." : "Login"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleBiometric}
                className="w-full h-12 rounded-xl font-medium border-slate-200 hover:bg-slate-50"
              >
                <Fingerprint className="h-4 w-4 mr-2" />
                Use Biometric
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setCurrentView('forgot')}
                  className="text-sm text-slate-600 hover:text-slate-800"
                >
                  Forgot PIN?
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Forgot Password View
  if (currentView === 'forgot') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm animate-scale-in shadow-medium border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentView('main')}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full shadow-soft">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="w-8" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-800">Reset Password</CardTitle>
            <p className="text-sm text-slate-600">Enter your email to receive reset instructions</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgotEmail" className="text-sm font-medium text-slate-700">Email</Label>
                <Input
                  id="forgotEmail"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 rounded-xl border-slate-200"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-soft hover:shadow-medium transition-all duration-200"
                disabled={forgotLoading}
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Login View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in shadow-medium border-0">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-2xl shadow-soft">
              <Receipt className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800 mb-2">SPM-POS</CardTitle>
          <p className="text-sm text-slate-600 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            Sell Smart. Grow Fast.
            <Sparkles className="h-4 w-4 text-indigo-500" />
          </p>
          
          {/* Status Indicators */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <ApiStatusIndicator />
            {isOnline ? (
              <Badge variant="secondary" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 px-3 py-1">
                <Wifi className="h-3 w-3" />
                Online
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200 px-3 py-1">
                <WifiOff className="h-3 w-3" />
                Offline Mode
              </Badge>
            )}
          </div>

          {/* Store Info */}
          {existingStore && (
            <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 justify-center">
                <Store className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">{existingStore.name}</span>
              </div>
            </div>
          )}
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl">
              <TabsTrigger 
                value="email" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2 text-sm font-medium"
              >
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger 
                value="phone" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2 text-sm font-medium"
              >
                <Phone className="h-4 w-4" />
                Phone
              </TabsTrigger>
            </TabsList>

            {/* Email Login */}
            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={emailForm.email}
                    onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                    disabled={loginLoading}
                    className="h-12 rounded-xl border-slate-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={emailForm.password}
                      onChange={(e) => setEmailForm({...emailForm, password: e.target.value})}
                      disabled={loginLoading}
                      className="h-12 rounded-xl border-slate-200 pr-12"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loginLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="rememberMe"
                    checked={emailForm.rememberMe}
                    onCheckedChange={(checked) => setEmailForm({...emailForm, rememberMe: checked})}
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-slate-600">Remember me</Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-soft hover:shadow-medium transition-all duration-200"
                  disabled={loginLoading}
                >
                  {loginLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center space-y-2">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setCurrentView('forgot')}
                    className="text-sm text-slate-600 hover:text-slate-800"
                  >
                    Forgot password?
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setCurrentView('register')}
                    className="text-sm text-slate-600 hover:text-slate-800"
                  >
                    Setup New Store
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Phone/OTP Login */}
            <TabsContent value="phone">
              <form onSubmit={handleOTPSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={otpForm.phone}
                    onChange={(e) => setOtpForm({...otpForm, phone: e.target.value})}
                    disabled={otpLoginLoading || sendingOTP || otpSent}
                    maxLength={10}
                    className="h-12 rounded-xl border-slate-200"
                    required
                  />
                </div>

                {otpSent && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Enter OTP</Label>
                    <InputOTP
                      maxLength={6}
                      value={otpForm.otp}
                      onChange={(value) => setOtpForm({...otpForm, otp: value})}
                    >
                      <InputOTPGroup className="gap-2 justify-center">
                        <InputOTPSlot index={0} className="w-12 h-12 border border-slate-200 rounded-xl text-lg font-semibold" />
                        <InputOTPSlot index={1} className="w-12 h-12 border border-slate-200 rounded-xl text-lg font-semibold" />
                        <InputOTPSlot index={2} className="w-12 h-12 border border-slate-200 rounded-xl text-lg font-semibold" />
                        <InputOTPSlot index={3} className="w-12 h-12 border border-slate-200 rounded-xl text-lg font-semibold" />
                        <InputOTPSlot index={4} className="w-12 h-12 border border-slate-200 rounded-xl text-lg font-semibold" />
                        <InputOTPSlot index={5} className="w-12 h-12 border border-slate-200 rounded-xl text-lg font-semibold" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-soft hover:shadow-medium transition-all duration-200"
                  disabled={otpLoginLoading || sendingOTP}
                >
                  {sendingOTP ? "Sending OTP..." : 
                   otpLoginLoading ? "Verifying..." :
                   otpSent ? "Verify OTP" : "Send OTP"}
                </Button>

                {otpSent && (
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpForm({...otpForm, otp: ""});
                      }}
                      className="text-sm text-slate-600 hover:text-slate-800"
                    >
                      Change phone number
                    </Button>
                  </div>
                )}
              </form>
            </TabsContent>
          </Tabs>
          
          {/* Demo Credentials */}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
