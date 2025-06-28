
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Lock, Fingerprint } from "lucide-react";
import { PINLoginInput, DeviceUser } from "@/lib/graphql/auth-types";

interface PINLoginViewProps {
  selectedUser: DeviceUser;
  pinForm: PINLoginInput;
  setPinForm: (form: PINLoginInput) => void;
  pinLoginLoading: boolean;
  onPINSubmit: (e: React.FormEvent) => void;
  onBiometric: () => void;
  onForgotPassword: () => void;
  onBack: () => void;
}

const PINLoginView = ({
  selectedUser,
  pinForm,
  setPinForm,
  pinLoginLoading,
  onPINSubmit,
  onBiometric,
  onForgotPassword,
  onBack
}: PINLoginViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm animate-scale-in shadow-medium border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
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
          <form onSubmit={onPINSubmit} className="space-y-6">
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
              onClick={onBiometric}
              className="w-full h-12 rounded-xl font-medium border-slate-200 hover:bg-slate-50"
            >
              <Fingerprint className="h-4 w-4 mr-2" />
              Use Biometric
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={onForgotPassword}
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
};

export default PINLoginView;
