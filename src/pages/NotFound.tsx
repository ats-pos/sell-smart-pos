
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-float delay-1000"></div>
      </div>

      <div className="text-center relative z-10 max-w-md mx-auto">
        <div className="glass p-8 sm:p-12 rounded-3xl border border-white/20 animate-slide-up">
          <div className="mb-6">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-2xl shadow-lg w-fit mx-auto mb-4">
              <Search className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold text-white mb-4 gradient-text">404</h1>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-lg text-blue-200 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover-lift"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover-lift"
            >
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
