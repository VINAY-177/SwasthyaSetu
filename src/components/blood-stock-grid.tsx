'use client';

import React from 'react';
import { BloodStock } from '@/lib/types';
import { AlertTriangle, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BloodStockGridProps {
  bloodStock: BloodStock;
  editable?: boolean;
  onUpdate?: (bloodStock: BloodStock) => void;
}

export function BloodStockGrid({ bloodStock, editable, onUpdate }: BloodStockGridProps) {
  const bloodGroups: Array<keyof BloodStock> = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

  const handleUpdate = (group: keyof BloodStock, action: 'inc' | 'dec') => {
    if (!editable || !onUpdate) return;
    
    const current = bloodStock[group] || 0;
    let newValue = current;
    
    if (action === 'inc') newValue++;
    if (action === 'dec' && current > 0) newValue--;
    
    if (newValue !== current) {
      onUpdate({
        ...bloodStock,
        [group]: newValue
      });
    }
  };

  const getColorClass = (units: number) => {
    if (units === 0) return 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200';
    if (units <= 2) return 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200';
    if (units <= 5) return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200';
    return 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200';
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Blood Bank Inventory</h3>
        <span className="text-xs text-muted-foreground">Updated in real-time across regional banks</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {bloodGroups.map((group) => {
          const units = bloodStock[group] || 0;
          return (
            <div 
              key={group} 
              className={`flex flex-col items-center justify-center p-3.5 border rounded-lg relative transition-all ${getColorClass(units)}`}
            >
              {units <= 2 && (
                <span title="Low stock warning" className="absolute top-2 right-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                </span>
              )}
              <span className="text-lg font-bold">{group}</span>
              <div className="flex items-center space-x-2 my-1">
                {editable && (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6 hover:bg-black/10 rounded-full" 
                    onClick={() => handleUpdate(group, 'dec')} 
                    disabled={units === 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                )}
                <span className="text-2xl font-extrabold">{units}</span>
                {editable && (
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6 hover:bg-black/10 rounded-full" 
                    onClick={() => handleUpdate(group, 'inc')}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider opacity-75">Units in Stock</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BloodStockGrid;
