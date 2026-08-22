"use client";

import { useEffect, useState } from "react";
import { RiskFactor } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RiskFactorsProps {
  factors: RiskFactor[];
}

export function RiskFactors({ factors }: RiskFactorsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Sort descending
  const sortedFactors = [...factors].sort((a, b) => b.contribution - a.contribution);
  
  // Find max for relative width
  const maxContribution = sortedFactors.length > 0 
    ? Math.max(...sortedFactors.map(f => f.contribution)) 
    : 100;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Contributing Factors</h3>
      <div className="space-y-3">
        {sortedFactors.map((factor, idx) => {
          const percentage = Math.min(100, Math.max(0, (factor.contribution / maxContribution) * 100));
          
          let colorClass = "bg-green-500";
          if (factor.contribution >= 25) colorClass = "bg-red-500";
          else if (factor.contribution >= 15) colorClass = "bg-orange-500";
          else if (factor.contribution >= 10) colorClass = "bg-amber-500";

          return (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline text-sm">
                <span className="font-semibold">{factor.factor}</span>
                <span className="font-medium text-muted-foreground">+{factor.contribution}</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-1000 ease-out", colorClass)}
                  style={{ width: mounted ? `${percentage}%` : '0%' }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{factor.detail}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
