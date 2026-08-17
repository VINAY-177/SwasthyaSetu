"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { MapPin, Droplet, Activity, ActivitySquare, AlertTriangle, ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { UrgencyBadge } from "@/components/urgency-badge";

export default function PatientDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { patients, screenings, referrals } = useStore();

  const patient = patients.find((p) => p.id === id);
  const patientScreenings = screenings
    .filter((s) => s.patientId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const patientReferrals = referrals
    .filter((r) => r.patientId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!patient) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Patient not found</h2>
        <p className="text-muted-foreground">The requested patient record could not be found.</p>
        <Link href="/patients">
          <Button><ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/patients">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
            <p className="text-muted-foreground">Patient Profile &amp; Clinical History</p>
          </div>
        </div>
        <Link href="/register">
          <Button className="flex items-center gap-1.5">
            <ActivitySquare className="h-4 w-4" /> New Screening
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1 lg:col-span-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <Badge variant={patient.abhaLinked ? "default" : "secondary"} className="text-xs">
                  ABHA: {patient.abhaLinked ? "Linked" : "Not Linked"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mt-1 text-sm">
                <span>{patient.age} yrs</span> • 
                <span>{patient.gender}</span> • 
                <span className="font-semibold text-foreground">Income: {patient.incomeCategory || "APL"}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Droplet className="h-3 w-3 text-rose-500" /> Blood Group: {patient.bloodGroup || "Unknown"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  ID: {patient.id}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2 lg:col-span-2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Location / Village</h3>
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{patient.village || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">{patient.district}, {patient.state}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="screenings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="screenings">Screenings ({patientScreenings.length})</TabsTrigger>
          <TabsTrigger value="referrals">Referrals ({patientReferrals.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="screenings" className="space-y-4 mt-6">
          {patientScreenings.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-card">
              <Activity className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No screenings recorded for this patient yet.</p>
              <Link href="/register" className="mt-3 inline-block">
                <Button size="sm">Perform First Screening</Button>
              </Link>
            </div>
          ) : (
            patientScreenings.map((screening) => (
              <Card key={screening.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base">{new Date(screening.createdAt).toLocaleString()}</CardTitle>
                    <CardDescription>AI Risk Evaluation</CardDescription>
                  </div>
                  <UrgencyBadge urgency={screening.urgency} />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 flex flex-col justify-center items-center p-4 border rounded-lg bg-muted/20">
                      <div className="text-4xl font-bold mb-2">{screening.riskScore}</div>
                      <Progress value={screening.riskScore} className="h-2 w-full max-w-[150px]" />
                      <span className="text-xs text-muted-foreground mt-2">Risk Score (out of 100)</span>
                    </div>
                    
                    <div className="col-span-2 space-y-4">
                      {screening.riskSummary && (
                        <div className="p-3 bg-secondary/50 rounded text-sm text-foreground">
                          {screening.riskSummary}
                        </div>
                      )}

                      {screening.symptoms && screening.symptoms.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Reported Symptoms</h4>
                          <div className="flex flex-wrap gap-2">
                            {screening.symptoms.map((sym) => (
                              <Badge key={sym} variant="secondary" className="text-xs">{sym}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {screening.riskFactors && screening.riskFactors.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                            Primary Contributing Factors
                          </h4>
                          <ul className="space-y-1 text-xs text-muted-foreground">
                            {screening.riskFactors.map((rf, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span className="font-semibold text-foreground">• {rf.factor} (+{rf.contribution}):</span>
                                <span>{rf.detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="pt-2 border-t text-xs text-muted-foreground flex flex-wrap gap-4">
                        <span>BP: {screening.vitals.bpSystolic}/{screening.vitals.bpDiastolic} mmHg</span>
                        <span>Pulse: {screening.vitals.pulse} bpm</span>
                        <span>SpO2: {screening.vitals.spO2}%</span>
                        <span>Temp: {screening.vitals.temperature}°C</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="referrals" className="space-y-4 mt-6">
          {patientReferrals.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-card">
              <p className="text-muted-foreground">No referrals recorded for this patient.</p>
            </div>
          ) : (
            patientReferrals.map((referral) => (
              <Card key={referral.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{referral.toFacilityName}</h4>
                        <Badge variant="outline">{referral.status}</Badge>
                        <UrgencyBadge urgency={referral.urgency} size="sm" />
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(referral.createdAt).toLocaleString()}</p>
                      <p className="text-sm"><span className="font-medium">Reason:</span> {referral.reason}</p>
                    </div>
                    <Link href={`/facilities/${referral.toFacilityId}`}>
                      <Button variant="outline" size="sm">View Facility</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
