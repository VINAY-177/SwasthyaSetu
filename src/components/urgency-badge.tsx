import { Urgency } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UrgencyBadgeProps {
  urgency: Urgency;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UrgencyBadge({ urgency, size = 'md', className }: UrgencyBadgeProps) {
  const getUrgencyConfig = (u: Urgency) => {
    switch (u) {
      case Urgency.LOW:
        return { label: "Low Risk", classes: "bg-green-600 hover:bg-green-700 text-white" };
      case Urgency.MODERATE:
        return { label: "Moderate", classes: "bg-amber-500 hover:bg-amber-600 text-white" };
      case Urgency.HIGH:
        return { label: "High Risk", classes: "bg-orange-600 hover:bg-orange-700 text-white" };
      case Urgency.EMERGENCY:
        return { label: "Emergency", classes: "bg-red-600 hover:bg-red-700 text-white animate-pulse" };
      default:
        return { label: "Unknown", classes: "bg-gray-500 text-white" };
    }
  };

  const config = getUrgencyConfig(urgency);
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <Badge 
      className={cn(
        "font-medium border-0",
        config.classes,
        sizeClasses[size],
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
