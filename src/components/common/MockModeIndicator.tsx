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
    <div className="mock-indicator">
      <TestTube className="h-3 w-3" />
      Mock Mode Active
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