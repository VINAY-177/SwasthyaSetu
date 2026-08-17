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
    if (name.includes("PM-JAY") || name.includes("Jan Arogya")) return <ShieldCheck className="h-6 w-6 text-teal-600" />;
    if (name.includes("Janani")) return <Baby className="h-6 w-6 text-rose-500" />;
    if (name.includes("Bima")) return <HeartPulse className="h-6 w-6 text-red-500" />;
    if (name.includes("Elderly") || name.includes("NPHCE")) return <Users className="h-6 w-6 text-blue-500" />;
    if (name.includes("Disability")) return <Accessibility className="h-6 w-6 text-purple-500" />;
    return <Building className="h-6 w-6 text-emerald-600" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "POTENTIALLY_ELIGIBLE":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200 shadow-sm px-3 py-1">Potentially Eligible</Badge>;
      case "NOT_ELIGIBLE":
        return <Badge variant="destructive" className="px-3 py-1 shadow-sm">Not Eligible</Badge>;
      case "NEEDS_VERIFICATION":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200 shadow-sm px-3 py-1">Verification Required</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="bg-gradient-to-br from-teal-400 to-emerald-500 p-4 rounded-full text-white shadow-md">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Government Health Scheme Navigator</h1>
          <p className="text-slate-500 mt-1 text-lg">
            Evaluate instant eligibility for central (PM-JAY, JSY) and state health benefit programs.
          </p>
        </div>
      </div>

      <Card className="shadow-lg rounded-2xl border-slate-100 overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6 pt-6">
          <CardTitle className="text-xl text-slate-800">Citizen Demographic &amp; Household Profile</CardTitle>
          <CardDescription className="text-slate-500 text-base">Enter household details to run the automated scheme qualification rules.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="income" className="text-slate-700 font-medium">Income / Socio-Economic Category *</Label>
              <Select value={incomeCategory} onValueChange={(val) => val && setIncomeCategory(val)}>
                <SelectTrigger id="income" className="h-11 rounded-lg border-slate-200 focus:ring-teal-500">
                  <SelectValue placeholder="Select income category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BPL">BPL (Below Poverty Line)</SelectItem>
                  <SelectItem value="EWS">EWS (Economically Weaker Section)</SelectItem>
                  <SelectItem value="APL">APL (Above Poverty Line)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-slate-700 font-medium">Age (Years) *</Label>
              <Input
                id="age"
                type="number"
                min={0}
                max={120}
                placeholder="e.g. 45"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                className="h-11 rounded-lg border-slate-200 focus-visible:ring-teal-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-slate-700 font-medium">Gender</Label>
              <Select value={gender} onValueChange={(val) => val && setGender(val)}>
                <SelectTrigger id="gender" className="h-11 rounded-lg border-slate-200 focus:ring-teal-500">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-slate-700 font-medium">State of Residence</Label>
              <Select value={stateName} onValueChange={(val) => val && setStateName(val)}>
                <SelectTrigger id="state" className="h-11 rounded-lg border-slate-200 focus:ring-teal-500">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
            <label className="flex items-center space-x-3 text-sm cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <Checkbox
                id="disability"
                checked={hasDisability}
                onCheckedChange={(checked) => setHasDisability(!!checked)}
                className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 w-5 h-5"
              />
              <span className="font-medium text-slate-700">
                Citizen has a recognized disability (UDID card or medical certificate)
              </span>
            </label>
            <label className="flex items-center space-x-3 text-sm cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <Checkbox
                id="pregnancy"
                checked={isPregnant}
                onCheckedChange={(checked) => setIsPregnant(!!checked)}
                className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 w-5 h-5"
              />
              <span className="font-medium text-slate-700">
                Citizen is currently pregnant / requiring antenatal care
              </span>
            </label>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 pt-6 pb-6 border-t border-slate-100">
          <Button 
            onClick={checkEligibility} 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md rounded-xl transition-all hover:shadow-lg"
          >
            <ShieldCheck className="w-5 h-5 mr-2" />
            Evaluate Scheme Eligibility
          </Button>
        </CardFooter>
      </Card>

      {results && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mt-10 mb-4 px-2">
            <h2 className="text-2xl font-bold text-slate-800">Identified Benefit Programs <span className="text-teal-600">({results.length})</span></h2>
            <Badge variant="outline" className="text-sm bg-teal-50 text-teal-700 border-teal-200 px-3 py-1">Rule Engine Evaluated</Badge>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {results.map((res, idx) => (
              <Card key={idx} className="hover:border-teal-300 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden border-slate-200">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-white">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl shrink-0 shadow-sm border border-slate-100">
                      {getSchemeIcon(res.schemeName)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-bold text-lg text-slate-900">{res.schemeName}</h3>
                        {getStatusBadge(res.status)}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{res.reason}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(res.officialLink, '_blank')} 
                    className="shrink-0 group text-sm h-10 px-4 rounded-lg border-slate-200 hover:bg-slate-50 hover:text-teal-700"
                  >
                    Official Portal
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 mt-8 rounded-xl shadow-sm">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="shrink-0 mt-0.5 text-amber-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong className="font-semibold">Disclaimer:</strong> This navigator provides informational guidance based on government rules. Final verification and e-card issuance require biometric Aadhaar KYC at your local Ayushman Arogya Mandir, CSC Kiosk, or Empanelled Hospital.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
