import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TestTube, Database, Wifi } from "lucide-react";
import { isMockMode, toggleMockMode } from "@/lib/config";

export const MockModeIndicator = () => {
  const isInMockMode = isMockMode();

  if (!isInMockMode) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <Badge 
        variant="secondary" 
        className="bg-orange-500/20 text-orange-300 border-orange-500/30 animate-pulse"
      >
        <TestTube className="h-3 w-3 mr-1" />
        Mock Mode Active
      </Badge>
      
      <Button
        size="sm"
        variant="outline"
        onClick={toggleMockMode}
        className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
        title="Switch to Live API"
      >
        <Database className="h-3 w-3 mr-1" />
        Switch to Live
      </Button>
    </div>
  );
};

export const ApiStatusIndicator = () => {
  const isInMockMode = isMockMode();

  return (
    <Badge 
      variant={isInMockMode ? "secondary" : "default"}
      className={`flex items-center gap-1 ${
        isInMockMode 
          ? "bg-orange-500/20 text-orange-300 border-orange-500/30" 
          : "bg-green-500/20 text-green-300 border-green-500/30"
      }`}
    >
      {isInMockMode ? (
        <>
          <TestTube className="h-3 w-3" />
          Mock Data
        </>
      ) : (
        <>
          <Wifi className="h-3 w-3" />
          Live API
        </>
      )}
    </Badge>
  );
};