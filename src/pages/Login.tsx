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
  ArrowLeft
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center gap-3 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('users')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="bg-blue-600 p-3 rounded-lg">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl">Enter PIN</CardTitle>
            <p className="text-gray-600">Welcome back, {selectedUser.name}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePINSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Enter your PIN</Label>
                <InputOTP
                  maxLength={6}
                  value={pinForm.pin}
                  onChange={(value) => setPinForm({ ...pinForm, pin: value })}
                >
                  <InputOTPGroup className="gap-2 justify-center">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={pinForm.pin.length < 4 || pinLoginLoading}
              >
                {pinLoginLoading ? "Verifying..." : "Login"}
              </Button>

              {/* Biometric Option */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBiometric}
                  className="w-full"
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
                  className="text-sm"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center gap-3 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="bg-blue-600 p-3 rounded-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <p className="text-gray-600">Enter your email to receive reset instructions</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgotEmail">Email</Label>
                <Input
                  id="forgotEmail"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Receipt className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">SPMPOS</CardTitle>
          <p className="text-gray-600">Sell Smart. Grow Fast.</p>
          
          {/* Online/Offline Status */}
          <div className="flex items-center justify-center gap-2 mt-2">
            {isOnline ? (
              <Badge variant="default" className="flex items-center gap-1">
                <Wifi className="h-3 w-3" />
                Online
              </Badge>
            ) : (
              <Badge variant="destructive" className="flex items-center gap-1">
                <WifiOff className="h-3 w-3" />
                Offline Mode
              </Badge>
            )}
          </div>

          {/* Store Info */}
          {existingStore && (
            <div className="mt-3 p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 justify-center">
                <Store className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{existingStore.name}</span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Quick User Access */}
          {deviceUsers.length > 0 && (
            <div className="mb-6">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => setCurrentView('users')}
              >
                <Users className="h-4 w-4" />
                Quick Login ({deviceUsers.length} users)
              </Button>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </TabsTrigger>
            </TabsList>

            {/* Email Login */}
            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={emailForm.email}
                    onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                    disabled={loginLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={emailForm.password}
                      onChange={(e) => setEmailForm({...emailForm, password: e.target.value})}
                      disabled={loginLoading}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                  <Label htmlFor="rememberMe" className="text-sm">Remember me</Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loginLoading}
                >
                  {loginLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setCurrentView('forgot')}
                    className="text-sm"
                  >
                    Forgot password?
                  </Button>
                </div>
                  <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setCurrentView('register')}
                    className="text-sm"
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
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={otpForm.phone}
                    onChange={(e) => setOtpForm({...otpForm, phone: e.target.value})}
                    disabled={otpLoginLoading || sendingOTP || otpSent}
                    maxLength={10}
                    required
                  />
                </div>

                {otpSent && (
                  <div className="space-y-2">
                    <Label>Enter OTP</Label>
                    <InputOTP
                      maxLength={6}
                      value={otpForm.otp}
                      onChange={(value) => setOtpForm({...otpForm, otp: value})}
                    >
                      <InputOTPGroup className="gap-2 justify-center">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
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
                      className="text-sm"
                    >
                      Change phone number
                    </Button>
                  </div>
                )}
              </form>
            </TabsContent>
          </Tabs>
          
          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Demo Credentials:
            </p>
            <div className="text-xs text-gray-500 space-y-1">
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