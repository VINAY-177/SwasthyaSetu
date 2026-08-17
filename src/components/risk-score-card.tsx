"use client";

import { useEffect, useState } from "react";
import { Urgency, RiskFactor } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UrgencyBadge } from "@/components/urgency-badge";
import { RiskFactors } from "@/components/risk-factors";
import { cn } from "@/lib/utils";

interface RiskScoreCardProps {
  score: number;
  urgency: Urgency;
  factors: RiskFactor[];
  summary: string;
  showActions?: boolean;
  onCreateReferral?: () => void;
}

export function RiskScoreCard({
  score,
  urgency,
  factors,
  summary,
  showActions = false,
  onCreateReferral,
}: RiskScoreCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getUrgencyColor = (u: Urgency) => {
    switch (u) {
      case "LOW": return "text-green-500";
      case "MODERATE": return "text-amber-500";
      case "HIGH": return "text-orange-500";
      case "EMERGENCY": return "text-red-600";
      default: return "text-primary";
    }
  };
  
  const strokeColorClass = getUrgencyColor(urgency).replace("text-", "stroke-");

  // SVG Gauge calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Risk Assessment Result</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center justify-center space-y-4 shrink-0">
          <div className="relative flex items-center justify-center w-[140px] h-[140px]">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-secondary"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className={cn("transition-all duration-1000 ease-out", strokeColorClass)}
                strokeWidth="12"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={mounted ? strokeDashoffset : circumference}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{Math.round(score)}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
          <UrgencyBadge urgency={urgency} className="text-lg px-4 py-1" />
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <h3 className="font-semibold text-sm mb-2">Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
          </div>
          
          <RiskFactors factors={factors} />
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="bg-muted/50 pt-6">
          <div className="w-full flex justify-end">
            {(urgency === "HIGH" || urgency === "EMERGENCY") && (
              <Button onClick={onCreateReferral} className="w-full sm:w-auto">
                Create Referral
              </Button>
            )}
            {urgency === "MODERATE" && (
              <Button variant="outline" className="w-full sm:w-auto">
                Schedule Follow-up
              </Button>
            )}
            {urgency === "LOW" && (
              <span className="text-sm font-medium text-muted-foreground">
                Routine Follow-up Recommended
              </span>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
