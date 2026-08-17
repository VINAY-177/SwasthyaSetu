'use client';

import React from 'react';
import { Facility } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus } from 'lucide-react';

interface BedDashboardProps {
  facility: Facility;
  editable?: boolean;
  onUpdate?: (updates: Partial<Facility>) => void;
}

export function BedDashboard({ facility, editable, onUpdate }: BedDashboardProps) {
  const icuAvailable = Math.max(0, facility.icuBeds - facility.icuBedsUsed);
  const generalAvailable = Math.max(0, facility.generalBeds - facility.generalBedsUsed);

  const handleUpdate = (type: 'icu' | 'general', action: 'inc' | 'dec') => {
    if (!editable || !onUpdate) return;
    
    if (type === 'icu') {
      let newUsed = facility.icuBedsUsed;
      if (action === 'inc' && newUsed < facility.icuBeds) newUsed++;
      if (action === 'dec' && newUsed > 0) newUsed--;
      if (newUsed !== facility.icuBedsUsed) {
        onUpdate({ icuBedsUsed: newUsed });
      }
    } else {
      let newUsed = facility.generalBedsUsed;
      if (action === 'inc' && newUsed < facility.generalBeds) newUsed++;
      if (action === 'dec' && newUsed > 0) newUsed--;
      if (newUsed !== facility.generalBedsUsed) {
        onUpdate({ generalBedsUsed: newUsed });
      }
    }
  };

  const getProgressColor = (available: number, total: number) => {
    if (total === 0) return 'bg-muted';
    const percent = (available / total) * 100;
    if (percent > 50) return 'bg-emerald-500';
    if (percent > 25) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const renderBedSection = (
    title: string,
    type: 'icu' | 'general',
    total: number,
    used: number,
    available: number
  ) => {
    const usedPercent = total > 0 ? (used / total) * 100 : 0;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">
            {title}: <span className="font-semibold text-foreground">{available} available</span> / {total} total
          </span>
          {editable && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground mr-1">Occupied:</span>
              <Button 
                size="icon" 
                variant="outline" 
                className="h-6 w-6" 
                onClick={() => handleUpdate(type, 'dec')} 
                disabled={used === 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-semibold w-4 text-center">{used}</span>
              <Button 
                size="icon" 
                variant="outline" 
                className="h-6 w-6" 
                onClick={() => handleUpdate(type, 'inc')} 
                disabled={used === total}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        <div className="h-3 w-full bg-secondary overflow-hidden rounded-full">
          <div 
            className={`h-full transition-all duration-500 ease-in-out ${getProgressColor(available, total)}`} 
            style={{ width: `${100 - usedPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{used} occupied ({Math.round(usedPercent)}%)</span>
          <span>{available} free</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-card">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Bed Availability</h3>
        {editable && <Badge variant="secondary" className="bg-primary/20 text-primary">Admin Edit Mode</Badge>}
      </div>
      {renderBedSection('ICU Beds', 'icu', facility.icuBeds, facility.icuBedsUsed, icuAvailable)}
      {renderBedSection('General Beds', 'general', facility.generalBeds, facility.generalBedsUsed, generalAvailable)}
    </div>
  );
}

export default BedDashboard;
