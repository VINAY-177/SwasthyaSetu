"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, ShieldCheck, Search, Activity, Stethoscope, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HospitalDb {
  id: string;
  name: string;
  type: string;
  district: string;
  state: string;
  location: string;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  availableIcu: number;
  specialties: string;
}

// Helper component for progress bar
function ProgressBar({ available, total, type }: { available: number, total: number, type: 'icu' | 'general' | 'private' }) {
  const percentage = total > 0 ? (available / total) * 100 : 0;
  
  let color = "bg-rose-500";
  if (percentage > 50) color = "bg-emerald-500";
  else if (percentage > 20) color = "bg-amber-500";

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between text-sm font-medium text-slate-700">
        <span className="capitalize">{type === 'private' ? 'Private' : type.toUpperCase()} Beds</span>
        <span className={`${percentage > 50 ? 'text-emerald-700' : percentage > 20 ? 'text-amber-700' : 'text-rose-700'} font-bold`}>
          {available}<span className="text-slate-400 font-normal">/{total}</span>
        </span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default function HospitalsPage() {
  const [facilities, setFacilities] = useState<HospitalDb[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("http://localhost:5000/api/hospitals")
      .then(res => res.json())
      .then(data => {
        setFacilities(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          facility.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || facility.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-4 rounded-2xl text-white shadow-lg shrink-0">
          <Building2 size={36} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Delhi/NCR Hospitals &amp; Facilities</h1>
          <p className="text-slate-500 text-lg mt-2">Find hospitals, check doctor availability, equipment, and bed status in real-time.</p>
        </div>
      </div>

      <Card className="p-2 shadow-md rounded-2xl border-slate-100 bg-white">
        <div className="flex flex-col md:flex-row gap-3 p-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            <Input 
              placeholder="Search by hospital name or district..." 
              className="pl-12 h-12 text-base rounded-xl border-slate-200 focus-visible:ring-teal-500 bg-slate-50 focus-visible:bg-white transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-72">
            <Select value={typeFilter} onValueChange={(val) => val && setTypeFilter(val)}>
              <SelectTrigger className="h-12 text-base rounded-xl border-slate-200 focus:ring-teal-500 bg-slate-50">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Facility Types</SelectItem>
                <SelectItem value="Government">Government</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-teal-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-3 font-semibold">Loading facilities from database...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => {
            const specialists = facility.specialties ? facility.specialties.split(',') : [];
            return (
              <Card key={facility.id} className="overflow-hidden group hover:shadow-xl hover:scale-[1.01] transition-all duration-300 rounded-2xl border-slate-200 bg-white flex flex-col">
                <CardHeader className="p-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h2 className="text-xl font-bold text-slate-800 leading-tight">{facility.name}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 uppercase tracking-wider text-[10px] font-bold">
                        {facility.type}
                      </Badge>
                      {facility.type === "Government" && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 uppercase tracking-wider text-[10px] font-bold flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> PM-JAY
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                      <MapPin className="h-4 w-4 mr-1.5 text-teal-600 shrink-0" />
                      <span className="truncate">{facility.location}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0 flex-1 flex flex-col">
                  <div className="divide-y divide-slate-100 flex-1">
                    {/* Beds Section */}
                    <div className="p-6 space-y-5 bg-white">
                      <h3 className="font-bold text-sm text-slate-800 flex items-center uppercase tracking-wider">
                        <Activity className="h-4 w-4 mr-2 text-teal-500" /> Bed Availability
                      </h3>
                      <div className="space-y-4">
                        <ProgressBar 
                          available={facility.availableIcu} 
                          total={facility.icuBeds} 
                          type="icu" 
                        />
                        <ProgressBar 
                          available={facility.availableBeds} 
                          total={facility.totalBeds} 
                          type="general" 
                        />
                      </div>
                    </div>

                    {/* Doctors Summary */}
                    <div className="p-6 bg-slate-50/50 space-y-3 flex-1">
                      <h3 className="font-bold text-sm text-slate-800 flex items-center uppercase tracking-wider">
                        <Stethoscope className="h-4 w-4 mr-2 text-teal-500" /> 
                        Top Specialists
                      </h3>
                      {specialists.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {specialists.slice(0, 4).map((spec: string, i: number) => (
                            <Badge key={i} variant="secondary" className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium">
                              {spec.trim()}
                            </Badge>
                          ))}
                          {specialists.length > 4 && (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-dashed border-slate-300">
                              +{specialists.length - 4}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 italic">No specialist data available.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          
          {filteredFacilities.length === 0 && !loading && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-100 border-dashed">
              <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-semibold text-slate-900">No facilities found</h3>
              <p className="text-slate-500">Try adjusting your search criteria or type filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
