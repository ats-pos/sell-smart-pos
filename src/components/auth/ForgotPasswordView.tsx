
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";

interface ForgotPasswordViewProps {
  forgotLoading: boolean;
  onForgotSubmit: (email: string) => Promise<void>;
  onBack: () => void;
}

const ForgotPasswordView = ({
  forgotLoading,
  onForgotSubmit,
  onBack
}: ForgotPasswordViewProps) => {
  const [forgotEmail, setForgotEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onForgotSubmit(forgotEmail);
    setForgotEmail("");
  };

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
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div className="w-8" />
          </div>
          <CardTitle className="text-xl font-semibold text-slate-800">Reset Password</CardTitle>
          <p className="text-sm text-slate-600">Enter your email to receive reset instructions</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
};

export default ForgotPasswordView;
