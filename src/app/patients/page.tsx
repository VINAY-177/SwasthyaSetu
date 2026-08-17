"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { useStore } from "@/lib/store";
import { UrgencyBadge } from "@/components/urgency-badge";

export default function PatientsPage() {
  const { patients, screenings } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients
    .filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.village && p.village.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.district && p.district.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getLatestScreening = (patientId: string) => {
    const patientScreenings = screenings.filter((s) => s.patientId === patientId);
    if (!patientScreenings.length) return null;
    return patientScreenings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Registry</h1>
          <p className="text-muted-foreground">Total {patients.length} registered citizens in your health block.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search name or village..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/register">
            <Button className="flex items-center gap-1.5 whitespace-nowrap">
              <UserPlus className="h-4 w-4" /> Register
            </Button>
          </Link>
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="text-center py-20 border rounded-lg bg-card">
          <UserPlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No patients registered yet</h3>
          <p className="text-muted-foreground mb-4">Start by adding your first citizen intake.</p>
          <Link href="/register">
            <Button>Register Patient</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-md border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Age / Gender</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Latest Risk Score</TableHead>
                <TableHead>Registered Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => {
                const latestScreening = getLatestScreening(patient.id);
                return (
                  <TableRow key={patient.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <Link href={`/patients/${patient.id}`} className="hover:underline text-primary">
                        {patient.name}
                      </Link>
                    </TableCell>
                    <TableCell>{patient.age}y / {patient.gender}</TableCell>
                    <TableCell>{patient.village || "N/A"}, {patient.district}</TableCell>
                    <TableCell>{patient.bloodGroup || "Unknown"}</TableCell>
                    <TableCell>
                      {latestScreening ? (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{latestScreening.riskScore}/100</span>
                          <UrgencyBadge urgency={latestScreening.urgency} size="sm" />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not screened</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(patient.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/patients/${patient.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredPatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No patients match your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
