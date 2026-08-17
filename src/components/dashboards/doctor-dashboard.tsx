"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Urgency } from "@/lib/types";
import { StatCard } from "@/components/stat-card";
import { UrgencyBadge } from "@/components/urgency-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, Ambulance, Bed, ChevronRight } from "lucide-react";

export function DoctorDashboard() {
  const { patients, screenings, referrals, stats } = useStore();

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clinical Dashboard</h2>
          <p className="text-muted-foreground">Monitor triage queues and incoming emergency referrals.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Patients"
          value={patients.length}
          icon={<Users className="h-4 w-4 text-blue-500" />}
          description="Currently registered"
        />
        <StatCard
          title="Emergency Cases"
          value={emergencyScreenings.length}
          icon={<AlertTriangle className="h-4 w-4 text-rose-500" />}
          description="In triage queue"
        />
        <StatCard
          title="Pending Referrals"
          value={pendingReferrals.length}
          icon={<Ambulance className="h-4 w-4 text-amber-500" />}
          description="Awaiting action"
        />
        <StatCard
          title="ICU Beds (Network)"
          value={stats.totalICUAvailable}
          icon={<Bed className="h-4 w-4 text-emerald-500" />}
          description="Available in network"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Triage Queue</CardTitle>
              <CardDescription>Patients needing clinical review, sorted by urgency.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-md">Patient</th>
                      <th className="px-4 py-3">Risk Score</th>
                      <th className="px-4 py-3">Urgency</th>
                      <th className="px-4 py-3">Symptoms</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 rounded-tr-md">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedScreenings.slice(0, 5).map((screening) => {
                      const patient = patients.find((p) => p.id === screening.patientId);
                      return (
                        <tr key={screening.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 font-medium">
                            <Link href={`/patients/${screening.patientId}`} className="hover:underline text-primary">
                              {patient?.name || "Unknown"}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-bold ${
                              screening.urgency === Urgency.EMERGENCY ? "text-rose-600" :
                              screening.urgency === Urgency.HIGH ? "text-amber-600" : "text-emerald-600"
                            }`}>
                              {screening.riskScore}/100
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <UrgencyBadge urgency={screening.urgency} size="sm" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 flex-wrap">
                              {screening.symptoms.slice(0, 2).map((sym, i) => (
                                <span key={i} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                                  {sym}
                                </span>
                              ))}
                              {screening.symptoms.length > 2 && <span className="text-xs text-muted-foreground">+{screening.symptoms.length - 2}</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {new Date(screening.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm" className="h-7 text-xs">Review</Button>
                          </td>
                        </tr>
                      );
                    })}
                    {sortedScreenings.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                          No active triage cases.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Recent Referrals</CardTitle>
              <Link href="/referrals">
                <Button variant="ghost" size="sm" className="text-primary text-xs px-2">
                  All <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                {referrals.slice(0, 5).map((ref) => (
                  <div key={ref.id} className="flex flex-col gap-1.5 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm">{ref.patientName}</span>
                      <UrgencyBadge urgency={ref.urgency} size="sm" />
                    </div>
                    <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <Ambulance className="h-3 w-3" /> {ref.toFacilityName}
                    </div>
                    <div>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-secondary text-secondary-foreground">
                        {ref.status}
                      </span>
                    </div>
                  </div>
                ))}
                {referrals.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent referrals.</p>
                )}
                <Link href="/referrals" className="block mt-4">
                  <Button className="w-full" size="sm">Manage Referrals</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
