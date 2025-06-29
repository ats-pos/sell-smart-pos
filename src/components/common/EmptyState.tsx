
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      <div className="bg-white/10 p-4 rounded-2xl mb-4">
        <Icon className="h-12 w-12 text-blue-300" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-blue-200 mb-6 max-w-sm">{description}</p>
      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-gradient-to-r from-blue-500 to-purple-500"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
