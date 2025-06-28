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

  // Check if store registration is needed

  // useEffect(() => {
  //   if (!storeCheckLoading && !storeExists) {
  //     setCurrentView('register');
  //   }
  // }, [storeExists, storeCheckLoading]);

  // Biometric authentication check
  useEffect(() => {
    if ('credentials' in navigator) {
      // Check if biometric authentication is available
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
      // In a real implementation, this would use WebAuthn API
      // For demo purposes, we'll simulate biometric authentication
      try {
        // Simulate biometric data
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
        {/* Animated background elements */}
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
        {/* Animated background elements */}
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        </div>
        
        <Card className="w-full max-w-md backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl relative z-10">
          <CardHeader className="text-center">
            <div className="flex items-center gap-3 mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentView('users')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl text-white">Enter PIN</CardTitle>
            <p className="text-blue-100">Welcome back, {selectedUser.name}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePINSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">Enter your PIN</Label>
                <InputOTP
                  maxLength={6}
                  value={pinForm.pin}
                  onChange={(value) => setPinForm({ ...pinForm, pin: value })}
                >
                  <InputOTPGroup className="gap-2 justify-center">
                    <InputOTPSlot index={0} className="bg-white/10 border-white/20 text-white" />
                    <InputOTPSlot index={1} className="bg-white/10 border-white/20 text-white" />
                    <InputOTPSlot index={2} className="bg-white/10 border-white/20 text-white" />
                    <InputOTPSlot index={3} className="bg-white/10 border-white/20 text-white" />
                    <InputOTPSlot index={4} className="bg-white/10 border-white/20 text-white" />
                    <InputOTPSlot index={5} className="bg-white/10 border-white/20 text-white" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
                disabled={pinForm.pin.length < 4 || pinLoginLoading}
              >
                {pinLoginLoading ? "Verifying..." : "Login"}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBiometric}
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Use Biometric
                </Button>
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setCurrentView('forgot')}
                  className="text-sm text-blue-200 hover:text-white"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        </div>
        
        <Card className="w-full max-w-md backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl relative z-10">
          <CardHeader className="text-center">
            <div className="flex items-center gap-3 mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentView('main')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl text-white">Reset Password</CardTitle>
            <p className="text-blue-100">Enter your email to receive reset instructions</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgotEmail" className="text-white">Email</Label>
                <Input
                  id="forgotEmail"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      <Card className="w-full max-w-md backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl shadow-lg">
              <Receipt className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">SPM-POS</CardTitle>
          <p className="text-blue-100 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Sell Smart. Grow Fast.
            <Sparkles className="h-4 w-4" />
          </p>
          
          {/* Online/Offline Status */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {isOnline ? (
              <Badge variant="default" className="flex items-center gap-1 bg-green-500/20 text-green-300 border-green-500/30">
                <Wifi className="h-3 w-3" />
                Online
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center gap-1 bg-red-500/20 text-red-300 border-red-500/30">
                <WifiOff className="h-3 w-3" />
                Offline Mode
              </Badge>
            )}
          </div>

          {/* Store Info */}
          {existingStore && (
            <div className="mb-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-2 justify-center">
                <Store className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-medium text-white">{existingStore.name}</span>
              </div>
            </div>
          )}
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
              <TabsTrigger 
                value="email" 
                className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-200"
              >
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </TabsTrigger>
              <TabsTrigger 
                value="phone" 
                className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-blue-200"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Phone</span>
              </TabsTrigger>
            </TabsList>

            {/* Email Login */}
            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={emailForm.email}
                    onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                    disabled={loginLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20 transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={emailForm.password}
                      onChange={(e) => setEmailForm({...emailForm, password: e.target.value})}
                      disabled={loginLoading}
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20 transition-all duration-200 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
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
                  <Label htmlFor="rememberMe" className="text-sm text-blue-200">Remember me</Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                  disabled={loginLoading}
                >
                  {loginLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center space-y-2">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setCurrentView('forgot')}
                    className="text-sm text-blue-200 hover:text-white"
                  >
                    Forgot password?
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setCurrentView('register')}
                    className="text-sm text-blue-200 hover:text-white"
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
                  <Label htmlFor="phone" className="text-white">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={otpForm.phone}
                    onChange={(e) => setOtpForm({...otpForm, phone: e.target.value})}
                    disabled={otpLoginLoading || sendingOTP || otpSent}
                    maxLength={10}
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20 transition-all duration-200"
                    required
                  />
                </div>

                {otpSent && (
                  <div className="space-y-2">
                    <Label className="text-white">Enter OTP</Label>
                    <InputOTP
                      maxLength={6}
                      value={otpForm.otp}
                      onChange={(value) => setOtpForm({...otpForm, otp: value})}
                    >
                      <InputOTPGroup className="gap-2 justify-center">
                        <InputOTPSlot index={0} className="bg-white/10 border-white/20 text-white" />
                        <InputOTPSlot index={1} className="bg-white/10 border-white/20 text-white" />
                        <InputOTPSlot index={2} className="bg-white/10 border-white/20 text-white" />
                        <InputOTPSlot index={3} className="bg-white/10 border-white/20 text-white" />
                        <InputOTPSlot index={4} className="bg-white/10 border-white/20 text-white" />
                        <InputOTPSlot index={5} className="bg-white/10 border-white/20 text-white" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
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
                      className="text-sm text-blue-200 hover:text-white"
                    >
                      Change phone number
                    </Button>
                  </div>
                )}
              </form>
            </TabsContent>
          </Tabs>
          
          {/* Demo Credentials */}
          <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
            <p className="text-sm text-blue-200 mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Demo Credentials:
            </p>
            <div className="text-xs text-blue-300 space-y-1">
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