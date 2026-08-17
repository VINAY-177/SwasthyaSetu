"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { StatCard } from "@/components/stat-card";
import { UrgencyBadge } from "@/components/urgency-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Bed, Ambulance, Droplets, BedDouble } from "lucide-react";

export function StaffDashboard() {
  const { referrals, stats } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hospital Staff Operations</h2>
          <p className="text-muted-foreground">Real-time facility capacity, bed occupancy, and incoming triage.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Facilities"
          value={stats.totalFacilities}
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
          description="In regional network"
        />
        <StatCard
          title="ICU Beds Available"
          value={stats.totalICUAvailable}
          icon={<Bed className="h-4 w-4 text-emerald-500" />}
          description="Across network"
          trend="neutral"
        />
        <StatCard
          title="General Beds Available"
          value={stats.totalGeneralAvailable}
          icon={<Bed className="h-4 w-4 text-blue-500" />}
          description="Across network"
          trend="up"
        />
        <StatCard
          title="Private Rooms Available"
          value={stats.totalPrivateRoomsAvailable || 0}
          icon={<BedDouble className="h-4 w-4 text-indigo-500" />}
          description="Across network"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Link href="/facilities" className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="p-4 flex flex-row items-center gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Bed className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <CardTitle className="text-base">Manage Beds & Equipment</CardTitle>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/ambulance" className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="p-4 flex flex-row items-center gap-4">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <Ambulance className="h-6 w-6 text-red-600 dark:text-red-300" />
              </div>
              <div>
                <CardTitle className="text-base">Ambulance Dispatch</CardTitle>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/facilities" className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="p-4 flex flex-row items-center gap-4">
              <div className="p-2 bg-rose-100 dark:bg-rose-900 rounded-lg">
                <Droplets className="h-6 w-6 text-rose-600 dark:text-rose-300" />
              </div>
              <div>
                <CardTitle className="text-base">Blood Bank</CardTitle>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Incoming Referrals Table</CardTitle>
            <CardDescription>Emergency and priority triage incoming from PHCs/CHCs.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Link href="/facilities">
              <Button variant="outline" size="sm">View Facility Map</Button>
            </Link>
            <Link href="/referrals">
              <Button size="sm">Manage Referrals</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Patient Name</th>
                  <th className="px-4 py-3">Destination Facility</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Urgency</th>
                  <th className="px-4 py-3 rounded-tr-md">Status</th>
                </tr>
              </thead>
              <tbody>
                {referrals.slice(0, 5).map((ref) => (
                  <tr key={ref.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{ref.patientName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{ref.toFacilityName}</td>
                    <td className="px-4 py-3 text-xs max-w-xs truncate">{ref.reason}</td>
                    <td className="px-4 py-3">
                      <UrgencyBadge urgency={ref.urgency} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-secondary text-secondary-foreground">
                        {ref.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {referrals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No referrals currently recorded.
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
