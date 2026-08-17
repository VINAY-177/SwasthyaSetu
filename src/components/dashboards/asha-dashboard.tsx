"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Urgency } from "@/lib/types";
import { StatCard } from "@/components/stat-card";
import { UrgencyBadge } from "@/components/urgency-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Activity,
  Ambulance,
  AlertTriangle,
  ChevronRight,
  Plus
} from "lucide-react";

export function AshaDashboard() {
  const { patients, screenings, stats } = useStore();

  const getLatestScreening = (patientId: string) => {
    return screenings.find((s) => s.patientId === patientId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ASHA Worker Dashboard</h2>
          <p className="text-muted-foreground">Here&apos;s an overview of your assigned community area today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/register">
            <Button className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" />
              Register Patient
            </Button>
          </Link>
          <Link href="/assess">
            <Button variant="outline">Quick Assessment</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="In your block / village"
          trend="up"
        />
        <StatCard
          title="Total Screenings"
          value={stats.totalScreenings}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          description="Assessments recorded"
          trend="neutral"
        />
        <StatCard
          title="Emergency Cases"
          value={stats.emergencyCases}
          icon={<AlertTriangle className="h-4 w-4 text-rose-500" />}
          description="Requires immediate action"
          trend="up"
        />
        <StatCard
          title="Pending Referrals"
          value={stats.pendingReferrals}
          icon={<Ambulance className="h-4 w-4 text-amber-500" />}
          description="Awaiting hospital acceptance"
          trend="neutral"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Screenings & Patients</CardTitle>
            <CardDescription>Latest patient assessments in your registry.</CardDescription>
          </div>
          <Link href="/patients">
            <Button variant="ghost" size="sm" className="text-primary text-xs">
              View All <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Patient Name</th>
                  <th className="px-4 py-3">Village</th>
                  <th className="px-4 py-3">Age / Gender</th>
                  <th className="px-4 py-3">Risk Score</th>
                  <th className="px-4 py-3 rounded-tr-md">Urgency</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.slice(0, 5).map((patient) => {
                  const latest = getLatestScreening(patient.id);
                  return (
                    <tr key={patient.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <Link href={`/patients/${patient.id}`} className="hover:underline text-primary">
                          {patient.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{patient.village}</td>
                      <td className="px-4 py-3 text-muted-foreground">{patient.age}y / {patient.gender}</td>
                      <td className="px-4 py-3 font-semibold">
                        {latest ? `${latest.riskScore}/100` : 'Not Screened'}
                      </td>
                      <td className="px-4 py-3">
                        <UrgencyBadge urgency={latest?.urgency || Urgency.LOW} size="sm" />
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/patients/${patient.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {patients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No patients registered yet. Click &quot;Register Patient&quot; to begin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
