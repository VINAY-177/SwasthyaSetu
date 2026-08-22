"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Users, ChevronRight, Activity } from "lucide-react";
import { useStore } from "@/lib/store";
import { UrgencyBadge } from "@/components/urgency-badge";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-100/50 text-teal-600 rounded-xl shadow-sm">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patient Records</h1>
            <p className="text-slate-500 mt-1">Manage and monitor {patients.length} registered citizens.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search by name or location..."
              className="pl-9 h-11 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-teal-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/register" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-11 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> 
              <span>Register Patient</span>
            </Button>
          </Link>
        </div>
      </div>

      {patients.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 shadow-sm bg-slate-50/50 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <UserPlus className="h-8 w-8 text-teal-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No patients registered yet</h3>
            <p className="text-slate-500 max-w-sm mb-6">Start by adding your first citizen intake to build your patient registry.</p>
            <Link href="/register">
              <Button className="h-11 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 shadow-sm">
                Register New Patient
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.map((patient) => {
            const latestScreening = getLatestScreening(patient.id);
            return (
              <Link key={patient.id} href={`/patients/${patient.id}`}>
                <Card className="group h-full shadow-sm hover:shadow-md transition-all duration-200 border-slate-200/60 rounded-2xl overflow-hidden hover:border-teal-200 bg-white">
                  <CardContent className="p-0">
                    <div className="p-5 border-b border-slate-50 flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                          {patient.name}
                        </h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5">
                          <span>{patient.age} yrs</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span className="capitalize">{patient.gender}</span>
                          {patient.bloodGroup && (
                            <>
                              <span className="w-1 h-1 bg-slate-300 rounded-full" />
                              <span className="text-rose-600 font-medium">{patient.bloodGroup}</span>
                            </>
                          )}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="px-5 py-4 bg-slate-50/50 flex flex-col gap-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Location</span>
                        <span className="font-medium text-slate-800 text-right line-clamp-1 max-w-[60%]">
                          {patient.village || "N/A"}, {patient.district}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Status</span>
                        {latestScreening ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-semibold bg-white border-slate-200 text-slate-700 gap-1.5">
                              <Activity className="h-3 w-3 text-teal-500" />
                              Score: {latestScreening.riskScore}
                            </Badge>
                            <UrgencyBadge urgency={latestScreening.urgency} size="sm" />
                          </div>
                        ) : (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-normal">Not screened</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center bg-white group-hover:bg-teal-50/30 transition-colors">
                      <span className="text-xs text-slate-400">
                        Registered: {new Date(patient.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center text-teal-600 text-sm font-medium">
                        View Profile <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
          
          {filteredPatients.length === 0 && (
            <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-500 text-lg">No patients match your search criteria.</p>
              <Button variant="link" onClick={() => setSearchQuery("")} className="text-teal-600 mt-2">
                Clear search
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
