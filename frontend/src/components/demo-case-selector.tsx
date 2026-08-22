"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Zap, HeartPulse, Baby, Activity, ShieldAlert } from "lucide-react";
import { PatientRegistrationInput } from "@/lib/types";

export interface DemoScenario {
  id: string;
  name: string;
  tag: string;
  badgeColor: string;
  icon: React.ElementType;
  data: PatientRegistrationInput;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "cardiac-emergency",
    name: "Acute Cardiac Distress",
    tag: "Emergency (Score ~85)",
    badgeColor: "bg-rose-500 text-white",
    icon: HeartPulse,
    data: {
      name: "Rameshwar Prasad",
      age: 58,
      gender: "Male",
      bloodGroup: "O+",
      village: "Kashi Vidyapeeth",
      district: "Varanasi",
      state: "Uttar Pradesh",
      incomeCategory: "BPL",
      vitals: {
        bpSystolic: 175,
        bpDiastolic: 105,
        pulse: 115,
        temperature: 37.1,
        spO2: 89,
      },
      symptoms: ["Chest pain", "Breathlessness", "Dizziness"],
      comorbidities: {
        diabetes: true,
        hypertension: true,
        heartDisease: true,
        pregnancy: false,
        asthma: false,
        kidney: false,
      },
    },
  },
  {
    id: "maternal-high-risk",
    name: "High-Risk Pregnancy",
    tag: "High Urgency (Score ~75)",
    badgeColor: "bg-amber-500 text-white",
    icon: Baby,
    data: {
      name: "Sunita Devi",
      age: 26,
      gender: "Female",
      bloodGroup: "B+",
      village: "Chandpur",
      district: "Chandauli",
      state: "Uttar Pradesh",
      incomeCategory: "BPL",
      vitals: {
        bpSystolic: 155,
        bpDiastolic: 95,
        pulse: 98,
        temperature: 38.6,
        spO2: 95,
      },
      symptoms: ["Severe headache", "Abdominal pain", "Blurred vision", "High fever (>39°C)"],
      comorbidities: {
        diabetes: false,
        hypertension: true,
        heartDisease: false,
        pregnancy: true,
        asthma: false,
        kidney: false,
      },
    },
  },
  {
    id: "pediatric-pneumonia",
    name: "Pediatric Acute Respiratory",
    tag: "Emergency (Score ~80)",
    badgeColor: "bg-rose-500 text-white",
    icon: ShieldAlert,
    data: {
      name: "Aarav Kumar (Child)",
      age: 3,
      gender: "Male",
      bloodGroup: "A+",
      village: "Sarnath",
      district: "Varanasi",
      state: "Uttar Pradesh",
      incomeCategory: "EWS",
      vitals: {
        bpSystolic: 95,
        bpDiastolic: 60,
        pulse: 135,
        temperature: 39.8,
        spO2: 90,
      },
      symptoms: ["Breathlessness", "High fever (>39°C)", "Persistent cough"],
      comorbidities: {
        diabetes: false,
        hypertension: false,
        heartDisease: false,
        pregnancy: false,
        asthma: true,
        kidney: false,
      },
    },
  },
  {
    id: "routine-followup",
    name: "Routine Primary Care",
    tag: "Low Risk (Score ~18)",
    badgeColor: "bg-emerald-500 text-white",
    icon: Activity,
    data: {
      name: "Gita Devi",
      age: 42,
      gender: "Female",
      bloodGroup: "O+",
      village: "Ramnagar",
      district: "Varanasi",
      state: "Uttar Pradesh",
      incomeCategory: "APL",
      vitals: {
        bpSystolic: 122,
        bpDiastolic: 78,
        pulse: 72,
        temperature: 36.6,
        spO2: 99,
      },
      symptoms: ["Joint pain", "Weakness / fatigue"],
      comorbidities: {
        diabetes: false,
        hypertension: false,
        heartDisease: false,
        pregnancy: false,
        asthma: false,
        kidney: false,
      },
    },
  },
];

interface DemoCaseSelectorProps {
  onSelectScenario: (scenario: DemoScenario) => void;
}

export function DemoCaseSelector({ onSelectScenario }: DemoCaseSelectorProps) {
  return (
    <div className="p-3.5 border rounded-lg bg-gradient-to-r from-primary/5 via-secondary/20 to-primary/5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 fill-primary" />
          Judge / Presentation Quick-Load Scenarios
        </span>
        <span className="text-[11px] text-muted-foreground hidden sm:inline">
          1-Click autofill realistic clinical profiles
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {DEMO_SCENARIOS.map((sc) => {
          const Icon = sc.icon;
          return (
            <Button
              key={sc.id}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSelectScenario(sc)}
              className="h-auto py-2 px-2.5 flex flex-col items-start text-left justify-center bg-card hover:border-primary transition-all text-xs"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-semibold text-foreground flex items-center gap-1 truncate">
                  <Icon className="h-3 w-3 text-primary shrink-0" />
                  {sc.name}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground truncate">
                {sc.tag}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
