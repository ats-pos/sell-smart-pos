
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Eye, EyeOff, Mail, Phone } from "lucide-react";
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
  onRegisterStore: () => void;
}

export const LoginTabs = ({
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
  onRegisterStore
}: LoginTabsProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
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
        <form onSubmit={onEmailLogin} className="space-y-4">
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
              onClick={onForgotPassword}
              className="text-sm text-blue-200 hover:text-white"
            >
              Forgot password?
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={onRegisterStore}
              className="text-sm text-blue-200 hover:text-white"
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
  );
};
