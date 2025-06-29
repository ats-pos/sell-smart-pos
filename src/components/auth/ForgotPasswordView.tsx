
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";

interface ForgotPasswordViewProps {
  forgotEmail: string;
  setForgotEmail: (email: string) => void;
  forgotLoading: boolean;
  onForgotSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export const ForgotPasswordView = ({
  forgotEmail,
  setForgotEmail,
  forgotLoading,
  onForgotSubmit,
  onBack
}: ForgotPasswordViewProps) => {
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
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl text-white">Reset Password</CardTitle>
          <p className="text-blue-100">Enter your email to receive reset instructions</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onForgotSubmit} className="space-y-4">
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
};
