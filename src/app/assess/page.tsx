"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, MapPin, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { calculateRiskScore, inferSpecialistNeeds } from "@/lib/risk-engine";
import { matchFacilities } from "@/lib/referral-matcher";
import { RiskScoreCard } from "@/components/risk-score-card";
import { VitalsInput } from "@/components/vitals-input";
import { SymptomPicker } from "@/components/symptom-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vitals, RiskFactor, Urgency, FacilityMatch, Comorbidities } from "@/lib/types";

// Varanasi default coords
const PATIENT_LAT = 25.3176;
const PATIENT_LNG = 82.9739;

export default function AssessPage() {
  const router = useRouter();
  const { facilities } = useStore();
  
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<string>("Male");
  
  const [vitals, setVitals] = useState<Vitals>({
    bpSystolic: 120,
    bpDiastolic: 80,
    pulse: 72,
    temperature: 36.8,
    spO2: 98,
  });
  
  const [symptoms, setSymptoms] = useState<string[]>([]);
  
  const [comorbidities, setComorbidities] = useState<Comorbidities>({
    diabetes: false,
    hypertension: false,
    heartDisease: false,
    pregnancy: false,
    asthma: false,
    kidney: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    urgency: Urgency;
    factors: RiskFactor[];
    summary: string;
    matchedFacilities: FacilityMatch[];
  } | null>(null);

  const handleComorbidityChange = (key: keyof Comorbidities) => {
    setComorbidities((prev) => ({ ...prev, [key]: !prev[key] }));
  };


  const handleAssess = () => {
    setIsLoading(true);
    
    // Simulate brief processing for clinical evaluation
    setTimeout(() => {
      const riskResult = calculateRiskScore({
        age,
        gender,
        vitals,
        symptoms,
        comorbidities,
      });

      const specialistNeeds = inferSpecialistNeeds(symptoms, comorbidities);
      
      const matches = matchFacilities(facilities, {
        urgency: riskResult.urgency,
        specialistNeeds,
        bloodGroup: null,
        patientLat: PATIENT_LAT,
        patientLng: PATIENT_LNG,
      }).slice(0, 3); // Top 3 recommended facilities

      setResult({
        score: riskResult.score,
        urgency: riskResult.urgency,
        factors: riskResult.factors,
        summary: riskResult.summary,
        matchedFacilities: matches,
      });
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Clinical Risk &amp; Triage Assessment</h1>
        <p className="text-muted-foreground mt-1">
          Instant rule-based scoring with explainable clinical factors and facility matching.
        </p>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">1. Patient Demographics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (Years)</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    min={0}
                    max={120}
                    value={age} 
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={gender} onValueChange={(val) => val && setGender(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">2. Vital Signs</CardTitle>
            </CardHeader>
            <CardContent>
              <VitalsInput vitals={vitals} onChange={setVitals} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">3. Reported Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <SymptomPicker selected={symptoms} onChange={setSymptoms} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">4. Pre-existing Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Object.keys(comorbidities) as Array<keyof Comorbidities>).map((key) => (
                  <label key={key} className="flex items-center space-x-2 text-sm cursor-pointer">
                    <Checkbox 
                      id={`cm-${key}`} 
                      checked={comorbidities[key]}
                      onCheckedChange={() => handleComorbidityChange(key)}
                    />
                    <span className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full h-11 text-base font-semibold" 
            size="lg" 
            onClick={handleAssess}
            disabled={isLoading}
          >
            <Activity className="w-5 h-5 mr-2" />
            {isLoading ? "Running AI Scoring..." : "Assess Clinical Risk"}
          </Button>
        </div>

        {/* Right Column: Results & Referral Recommendations */}
        <div className="space-y-6">
          {!result && !isLoading ? (
            <Card className="border-dashed flex items-center justify-center bg-card min-h-[400px]">
              <CardContent className="text-center p-8 text-muted-foreground flex flex-col items-center">
                <Activity className="w-12 h-12 mb-3 opacity-30 text-primary" />
                <h3 className="font-semibold text-foreground text-lg mb-1">Ready for Assessment</h3>
                <p className="text-sm max-w-sm">
                  Enter vitals and symptoms, then click &quot;Assess Clinical Risk&quot;.
                </p>
              </CardContent>
            </Card>
          ) : result ? (
            <div className="space-y-6">
              <RiskScoreCard 
                score={result.score}
                urgency={result.urgency}
                factors={result.factors}
                summary={result.summary}
                showActions={true}
                onCreateReferral={() => {
                  router.push("/referrals");
                }}
              />

              {result.matchedFacilities.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold tracking-tight">Optimal Referral Facilities</h3>
                    <Badge variant="outline" className="text-xs">Ranked by capability &amp; distance</Badge>
                  </div>
                  <div className="grid gap-3">
                    {result.matchedFacilities.map((match, idx) => {
                      const fac = match.facility;
                      const icuAvail = Math.max(0, fac.icuBeds - fac.icuBedsUsed);
                      const genAvail = Math.max(0, fac.generalBeds - fac.generalBedsUsed);

                      return (
                        <Card key={idx} className="hover:border-primary/50 transition-colors">
                          <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start gap-3">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-base">{fac.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {fac.type.replace("_", " ")}
                                </Badge>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground gap-1">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                <span>{match.distance.toFixed(1)} km away • {fac.district}, {fac.state}</span>
                              </div>
                              {match.reasons && match.reasons.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {match.reasons.map((r, rIdx) => (
                                    <span 
                                      key={rIdx} 
                                      className="inline-flex items-center text-[11px] bg-secondary px-2 py-0.5 rounded text-secondary-foreground"
                                    >
                                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                                      {r}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col sm:items-end justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                ICU: {icuAvail}/{fac.icuBeds} free
                              </div>
                              <div className="text-xs text-muted-foreground">
                                General: {genAvail}/{fac.generalBeds} free
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2 h-7 text-xs"
                                onClick={() => router.push(`/facilities/${fac.id}`)}
                              >
                                View Facility
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Card className="min-h-[400px] flex items-center justify-center bg-card">
              <CardContent className="text-center p-8 text-muted-foreground flex flex-col items-center">
                <Activity className="w-10 h-10 mb-3 animate-pulse text-primary" />
                <p className="font-semibold text-foreground">Evaluating Clinical Rules...</p>
                <p className="text-xs text-muted-foreground mt-1">Cross-referencing symptoms, vitals &amp; hospital availability</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
