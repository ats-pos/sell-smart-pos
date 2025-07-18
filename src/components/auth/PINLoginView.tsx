
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Lock, Fingerprint } from "lucide-react";
import { DeviceUser, PINLoginInput } from "@/lib/graphql/auth-types";

interface PINLoginViewProps {
  selectedUser: DeviceUser;
  pinForm: PINLoginInput;
  setPinForm: (form: PINLoginInput) => void;
  pinLoginLoading: boolean;
  onPINSubmit: (e: React.FormEvent) => void;
  onBiometric: () => void;
  onBack: () => void;
  onForgotPIN: () => void;
}

export const PINLoginView = ({
  selectedUser,
  pinForm,
  setPinForm,
  pinLoginLoading,
  onPINSubmit,
  onBiometric,
  onBack,
  onForgotPIN
}: PINLoginViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
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
              onClick={onBack}
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
          <form onSubmit={onPINSubmit} className="space-y-6">
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
                onClick={onBiometric}
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
                onClick={onForgotPIN}
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
};
