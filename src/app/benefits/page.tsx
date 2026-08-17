"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Baby, HeartPulse, Users, Accessibility, ArrowRight, Building } from "lucide-react";
import { SchemeResult } from "@/lib/types";

export default function BenefitsPage() {
  const [incomeCategory, setIncomeCategory] = useState<string>("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<string>("");
  const [stateName, setStateName] = useState<string>("");
  const [hasDisability, setHasDisability] = useState<boolean>(false);
  const [isPregnant, setIsPregnant] = useState<boolean>(false);
  const [results, setResults] = useState<SchemeResult[] | null>(null);

  const checkEligibility = () => {
    const newResults: SchemeResult[] = [];
    const ageNum = Number(age);

    // PM-JAY (Ayushman Bharat)
    if (incomeCategory === "BPL" || incomeCategory === "EWS") {
      newResults.push({
        schemeName: "PM-JAY (Ayushman Bharat)",
        status: "POTENTIALLY_ELIGIBLE",
        reason: "Eligible for up to ₹5 Lakhs cashless coverage based on BPL/EWS income status.",
        officialLink: "https://pmjay.gov.in"
      });
    } else {
      newResults.push({
        schemeName: "PM-JAY (Ayushman Bharat)",
        status: "NEEDS_VERIFICATION",
        reason: "APL families require SECC / Ration Card verification at the nearest CSC center.",
        officialLink: "https://pmjay.gov.in"
      });
    }

    // Janani Suraksha Yojana (Maternal Health)
    if (isPregnant || (gender === "Female" && ageNum >= 18 && ageNum <= 45)) {
      if (incomeCategory === "BPL" || incomeCategory === "EWS") {
        newResults.push({
          schemeName: "Janani Suraksha Yojana (JSY)",
          status: "POTENTIALLY_ELIGIBLE",
          reason: "Cash assistance for institutional delivery in rural/urban BPL pregnant mothers.",
          officialLink: "https://nhm.gov.in"
        });
      } else {
        newResults.push({
          schemeName: "Janani Suraksha Yojana (JSY)",
          status: "NEEDS_VERIFICATION",
          reason: "Available for institutional delivery; requires ASHA facilitation in government facilities.",
          officialLink: "https://nhm.gov.in"
        });
      }
    }

    // State-Specific Health Scheme
    if (stateName === "Rajasthan") {
      newResults.push({
        schemeName: "Mukhya Mantri Ayushman Arogya Yojana (Rajasthan)",
        status: "POTENTIALLY_ELIGIBLE",
        reason: "Universal state health coverage for Rajasthan residents with free OPD/IPD benefits.",
        officialLink: "https://health.rajasthan.gov.in"
      });
    } else if (stateName === "Uttar Pradesh") {
      newResults.push({
        schemeName: "Mukhyamantri Jan Arogya Yojana (Uttar Pradesh)",
        status: incomeCategory === "BPL" || incomeCategory === "EWS" ? "POTENTIALLY_ELIGIBLE" : "NEEDS_VERIFICATION",
        reason: "State-funded coverage complementing PM-JAY for underserved UP residents.",
        officialLink: "https://uphealth.up.nic.in"
      });
    }

    // Rashtriya Swasthya Bima Yojana
    if (incomeCategory === "BPL") {
      newResults.push({
        schemeName: "Rashtriya Swasthya Bima Yojana (RSBY)",
        status: "POTENTIALLY_ELIGIBLE",
        reason: "Unorganized sector health insurance for recognized BPL families.",
        officialLink: "https://www.india.gov.in"
      });
    }

    // NPHCE (Elderly Care)
    if (ageNum >= 60) {
      newResults.push({
        schemeName: "National Programme for Health Care of the Elderly (NPHCE)",
        status: "POTENTIALLY_ELIGIBLE",
        reason: "Dedicated geriatric clinics and free diagnostics for senior citizens (60+ years).",
        officialLink: "https://main.mohfw.gov.in"
      });
    }

    // National Disability Scheme
    if (hasDisability) {
      newResults.push({
        schemeName: "National Health Assistance for Persons with Disabilities",
        status: "POTENTIALLY_ELIGIBLE",
        reason: "Specialized assistive rehabilitation, therapy, and secondary care assistance.",
        officialLink: "https://disabilityaffairs.gov.in"
      });
    }

    setResults(newResults);
  };

  const getSchemeIcon = (name: string) => {
    if (name.includes("PM-JAY") || name.includes("Jan Arogya")) return <ShieldCheck className="h-6 w-6 text-primary" />;
    if (name.includes("Janani")) return <Baby className="h-6 w-6 text-rose-500" />;
    if (name.includes("Bima")) return <HeartPulse className="h-6 w-6 text-red-500" />;
    if (name.includes("Elderly") || name.includes("NPHCE")) return <Users className="h-6 w-6 text-blue-500" />;
    if (name.includes("Disability")) return <Accessibility className="h-6 w-6 text-purple-500" />;
    return <Building className="h-6 w-6 text-teal-600" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "POTENTIALLY_ELIGIBLE":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Potentially Eligible</Badge>;
      case "NOT_ELIGIBLE":
        return <Badge variant="destructive">Not Eligible</Badge>;
      case "NEEDS_VERIFICATION":
        return <Badge variant="secondary" className="bg-amber-500 text-white hover:bg-amber-600">Verification Required</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2.5 rounded-lg text-primary">
          <ShieldCheck size={26} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Government Health Scheme Navigator</h1>
          <p className="text-muted-foreground">
            Evaluate instant eligibility for central (PM-JAY, JSY) and state health benefit programs.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Citizen Demographic &amp; Household Profile</CardTitle>
          <CardDescription>Enter household details to run the automated scheme qualification rules.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="income">Income / Socio-Economic Category *</Label>
              <Select value={incomeCategory} onValueChange={(val) => val && setIncomeCategory(val)}>
                <SelectTrigger id="income">
                  <SelectValue placeholder="Select income category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BPL">BPL (Below Poverty Line)</SelectItem>
                  <SelectItem value="EWS">EWS (Economically Weaker Section)</SelectItem>
                  <SelectItem value="APL">APL (Above Poverty Line)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="age">Age (Years) *</Label>
              <Input
                id="age"
                type="number"
                min={0}
                max={120}
                placeholder="e.g. 45"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={(val) => val && setGender(val)}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="state">State of Residence</Label>
              <Select value={stateName} onValueChange={(val) => val && setStateName(val)}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <label className="flex items-center space-x-2 text-sm cursor-pointer">
              <Checkbox
                id="disability"
                checked={hasDisability}
                onCheckedChange={(checked) => setHasDisability(!!checked)}
              />
              <span className="font-normal">
                Citizen has a recognized disability (UDID card or medical certificate)
              </span>
            </label>
            <label className="flex items-center space-x-2 text-sm cursor-pointer">
              <Checkbox
                id="pregnancy"
                checked={isPregnant}
                onCheckedChange={(checked) => setIsPregnant(!!checked)}
              />
              <span className="font-normal">
                Citizen is currently pregnant / requiring antenatal care
              </span>
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={checkEligibility} className="w-full sm:w-auto h-10 font-semibold">
            Evaluate Scheme Eligibility
          </Button>
        </CardFooter>
      </Card>

      {results && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mt-8 mb-2">
            <h2 className="text-xl font-bold">Identified Benefit Programs ({results.length})</h2>
            <Badge variant="outline" className="text-xs">Rule Engine Evaluated</Badge>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {results.map((res, idx) => (
              <Card key={idx} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 p-2 bg-secondary/80 rounded-lg shrink-0">
                      {getSchemeIcon(res.schemeName)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-base">{res.schemeName}</h3>
                        {getStatusBadge(res.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">{res.reason}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(res.officialLink, '_blank')} 
                    className="shrink-0 group text-xs h-8"
                  >
                    Official Portal
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900 mt-6">
            <CardContent className="p-4">
              <p className="text-xs text-center text-amber-900 dark:text-amber-300">
                <strong>Disclaimer:</strong> This navigator provides informational guidance based on government rules. Final verification and e-card issuance require biometric Aadhaar KYC at your local Ayushman Arogya Mandir, CSC Kiosk, or Empanelled Hospital.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
