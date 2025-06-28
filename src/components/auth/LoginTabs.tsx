
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, Phone, Eye, EyeOff } from "lucide-react";
import { LoginInput, OTPLoginInput } from "@/lib/graphql/auth-types";

interface LoginTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  emailForm: LoginInput;
  setEmailForm: (form: LoginInput) => void;
  otpForm: OTPLoginInput;
  setOtpForm: (form: OTPLoginInput) => void;
  otpSent: boolean;
  setOtpSent: (sent: boolean) => void;
  loginLoading: boolean;
  otpLoginLoading: boolean;
  sendingOTP: boolean;
  onEmailLogin: (e: React.FormEvent) => void;
  onOTPSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onRegister: () => void;
}

const LoginTabs = ({
  activeTab,
  setActiveTab,
  emailForm,
  setEmailForm,
  otpForm,
  setOtpForm,
  otpSent,
  setOtpSent,
  loginLoading,
  otpLoginLoading,
  sendingOTP,
  onEmailLogin,
  onOTPSubmit,
  onForgotPassword,
  onRegister
}: LoginTabsProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
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
        <form onSubmit={onEmailLogin} className="space-y-4">
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
              onClick={onForgotPassword}
              className="text-sm text-slate-600 hover:text-slate-800"
            >
              Forgot password?
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={onRegister}
              className="text-sm text-slate-600 hover:text-slate-800"
            >
              Setup New Store
            </Button>
          </div>
        </form>
      </TabsContent>

      {/* Phone/OTP Login */}
      <TabsContent value="phone">
        <form onSubmit={onOTPSubmit} className="space-y-4">
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
  );
};

export default LoginTabs;
