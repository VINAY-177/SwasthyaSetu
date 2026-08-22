"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { SYMPTOM_LIST } from "@/lib/types";

interface SymptomPickerProps {
  selected: string[];
  onChange: (symptoms: string[]) => void;
}

export function SymptomPicker({ selected, onChange }: SymptomPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSymptoms = SYMPTOM_LIST?.filter((symptom) =>
    symptom.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const toggleSymptom = (symptom: string) => {
    if (selected.includes(symptom)) {
      onChange(selected.filter((s) => s !== symptom));
    } else {
      onChange([...selected, symptom]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Symptoms ({selected.length} selected)</h3>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search symptoms..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1">
        {filteredSymptoms.map((symptom) => {
          const isSelected = selected.includes(symptom);
          return (
            <Badge
              key={symptom}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-muted"
              }`}
              onClick={() => toggleSymptom(symptom)}
            >
              {symptom}
            </Badge>
          );
        })}
        {filteredSymptoms.length === 0 && (
          <p className="text-sm text-muted-foreground">No symptoms found.</p>
        )}
      </div>
    </div>
  );
}
