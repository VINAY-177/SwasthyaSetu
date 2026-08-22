"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Urgency } from "@/lib/types";
import { StatCard } from "@/components/stat-card";
import { UrgencyBadge } from "@/components/urgency-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, Ambulance, Bed, Activity, ArrowRight } from "lucide-react";

export function DoctorDashboard() {
  const { patients, screenings, referrals, stats, currentUser } = useStore();

  const emergencyScreenings = screenings.filter((s) => s.urgency === Urgency.EMERGENCY);
  const pendingReferrals = referrals.filter((r) => r.status === "PENDING");

  const sortedScreenings = [...screenings].sort((a, b) => {
    const urgencyWeight: Record<string, number> = {
      [Urgency.EMERGENCY]: 3,
      [Urgency.HIGH]: 2,
      "MEDIUM": 1,
      [Urgency.LOW]: 0,
    };
    return (urgencyWeight[b.urgency] || 0) - (urgencyWeight[a.urgency] || 0);
  });

  return (
    <div className="space-y-6">
      {/* Clinical Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-lg border shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Clinical Dashboard</h2>
          <p className="text-muted-foreground mt-1">Monitor triage queues and manage referrals.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg border">
          <div className="flex flex-col items-end">
            <span className="font-semibold text-sm">{currentUser?.name || "Dr. Sarah Chen"}</span>
            <span className="text-xs text-muted-foreground">{currentUser?.specialty || "Emergency Medicine"}</span>
          </div>
          <Badge variant="outline" className="bg-emerald-50/50 text-emerald-700 border-emerald-200 gap-1.5 pl-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            On Duty
          </Badge>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Patients"
          value={patients.length}
          icon={<Users className="h-4 w-4 text-blue-500" />}
          description="Currently registered"
        />
        <StatCard
          title="Emergency Red-Alerts"
          value={emergencyScreenings.length}
          icon={<AlertTriangle className="h-4 w-4 text-rose-500" />}
          description="Requires immediate action"
          className={emergencyScreenings.length > 0 ? "border-rose-200 bg-rose-50/30" : ""}
        />
        <StatCard
          title="Pending Referrals"
          value={pendingReferrals.length}
          icon={<Ambulance className="h-4 w-4 text-amber-500" />}
          description="Awaiting coordination"
        />
        <StatCard
          title="ICU Beds Available"
          value={stats.totalICUAvailable}
          icon={<Bed className="h-4 w-4 text-emerald-500" />}
          description="Available in network"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Emergency Triage Queue */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-border/50 overflow-hidden">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle>Priority Triage Queue</CardTitle>
              <CardDescription>Patients needing clinical review, sorted by urgency.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/40">
                    <tr>
                      <th className="px-6 py-4 font-medium">Patient</th>
                      <th className="px-4 py-4 font-medium">Risk Score</th>
                      <th className="px-4 py-4 font-medium">Urgency</th>
                      <th className="px-4 py-4 font-medium">Key Symptoms</th>
                      <th className="px-4 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {sortedScreenings.map((screening) => {
                      const patient = patients.find((p) => p.id === screening.patientId);
                      return (
                        <tr key={screening.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">
                            {patient?.name || "Unknown"}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center justify-center font-bold text-sm ${
                              screening.urgency === Urgency.EMERGENCY ? "text-rose-600" :
                              screening.urgency === Urgency.HIGH ? "text-amber-600" : "text-emerald-600"
                            }`}>
                              {screening.riskScore}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <UrgencyBadge urgency={screening.urgency} size="sm" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-1.5 flex-wrap">
                              {screening.symptoms.slice(0, 2).map((sym, i) => (
                                <Badge key={i} variant="secondary" className="font-normal text-[11px] px-1.5 py-0 h-5">
                                  {sym}
                                </Badge>
                              ))}
                              {screening.symptoms.length > 2 && (
                                <Badge variant="outline" className="font-normal text-[11px] px-1.5 py-0 h-5 text-muted-foreground">
                                  +{screening.symptoms.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(screening.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link href={`/patients/${screening.patientId}`}>
                              <Button size="sm" className="h-8 shadow-none" variant={screening.urgency === Urgency.EMERGENCY ? "default" : "outline"}>
                                Review
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                    {sortedScreenings.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground bg-muted/10">
                          <div className="flex flex-col items-center gap-2">
                            <Activity className="h-8 w-8 text-muted-foreground/40" />
                            <p>No patients in triage queue.</p>
                            <p className="text-xs">Cases will appear here as screenings are submitted.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="bg-muted/20 border-b pb-4">
              <CardTitle className="text-base">Quick Clinical Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Link href="/assess" className="block">
                <Button className="w-full justify-start gap-2 h-10" variant="default">
                  <Activity className="h-4 w-4" />
                  New AI Assessment
                </Button>
              </Link>
              <Link href="/patients" className="block">
                <Button className="w-full justify-start gap-2 h-10" variant="outline">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Patient Records
                </Button>
              </Link>
              <Link href="/referrals" className="block">
                <Button className="w-full justify-start gap-2 h-10" variant="outline">
                  <Ambulance className="h-4 w-4 text-muted-foreground" />
                  Create Referral
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/20 border-b">
              <CardTitle className="text-base">Recent Referrals</CardTitle>
              <Link href="/referrals">
                <Button variant="ghost" size="sm" className="text-primary text-xs px-2 h-7 gap-1">
                  All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {referrals.slice(0, 3).map((ref) => (
                  <div key={ref.id} className="flex flex-col gap-2 p-3 rounded-md border border-border/50 bg-muted/10">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-medium text-sm text-foreground truncate">{ref.patientName}</span>
                      <UrgencyBadge urgency={ref.urgency} size="sm" />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5 truncate max-w-[140px]">
                        <Ambulance className="h-3 w-3 shrink-0" /> 
                        <span className="truncate">{ref.toFacilityName}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-background border shadow-sm font-medium">
                        {ref.status}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground/70 mt-1">
                      {new Date(ref.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                {referrals.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No referrals yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
