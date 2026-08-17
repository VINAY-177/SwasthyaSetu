import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({ title, value, icon, description, trend, className }: StatCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
    if (trend === 'neutral') return <MinusIcon className="h-4 w-4 text-gray-400" />;
    return null;
  };

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
            {title}
          </h3>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {trend && getTrendIcon()}
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
