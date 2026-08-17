"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, ShieldCheck, Search, Activity, Stethoscope } from "lucide-react";
import { FacilityType, Doctor, Equipment } from "@/lib/types";

// Helper component for progress bar
function ProgressBar({ available, total, type }: { available: number, total: number, type: 'icu' | 'general' | 'private' }) {
  const percentage = total > 0 ? (available / total) * 100 : 0;
  
  let color = "bg-red-500";
  if (percentage > 50) color = "bg-green-500";
  else if (percentage > 20) color = "bg-amber-500";

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between text-xs font-medium">
        <span className="capitalize">{type === 'private' ? 'Private' : type.toUpperCase()}</span>
        <span>{available}/{total}</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default function HospitalsPage() {
  const { facilities } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          facility.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || facility.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Nearby Hospitals & Health Centres</h1>
        <p className="text-muted-foreground text-lg">Find hospitals, check doctor availability, equipment, and bed status.</p>
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by hospital name or district..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={typeFilter} onValueChange={(val) => val && setTypeFilter(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Facility Types</SelectItem>
              <SelectItem value={FacilityType.AROGYA_MANDIR}>Arogya Mandir</SelectItem>
              <SelectItem value={FacilityType.PHC}>PHC</SelectItem>
              <SelectItem value={FacilityType.CHC}>CHC</SelectItem>
              <SelectItem value={FacilityType.DISTRICT_HOSPITAL}>District Hospital</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-6">
        {filteredFacilities.map((facility) => {
          
          return (
            <Card key={facility.id} className="overflow-hidden group hover:shadow-md transition-shadow">
              <CardHeader className="p-5 bg-muted/30 border-b">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold">{facility.name}</h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        {facility.type.replace('_', ' ')}
                      </span>
                      {facility.pmjayEmpanelled && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <ShieldCheck className="h-3 w-3" /> PM-JAY Empanelled
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1.5" />
                      {facility.district}, {facility.state}
                    </div>
                    {facility.specialists && facility.specialists.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {facility.specialists.map((spec: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-secondary text-secondary-foreground">
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none">
                      <MapPin className="h-4 w-4 mr-2" /> Directions
                    </Button>
                    <a href={`tel:${facility.phone || '104'}`} className="flex-1 md:flex-none">
                      <Button className="w-full">
                        <Phone className="h-4 w-4 mr-2" /> Call
                      </Button>
                    </a>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                  {/* Beds Section */}
                  <div className="p-5 space-y-4">
                    <h3 className="font-semibold text-sm flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-primary" /> Bed Availability
                    </h3>
                    <div className="space-y-4">
                      <ProgressBar 
                        available={facility.icuBeds - facility.icuBedsUsed} 
                        total={facility.icuBeds} 
                        type="icu" 
                      />
                      <ProgressBar 
                        available={facility.generalBeds - facility.generalBedsUsed} 
                        total={facility.generalBeds} 
                        type="general" 
                      />
                      {(facility.privateRooms !== undefined) && (
                        <ProgressBar 
                          available={facility.privateRooms - (facility.privateRoomsUsed || 0)} 
                          total={facility.privateRooms} 
                          type="private" 
                        />
                      )}
                    </div>
                  </div>

                  {/* Doctors Section */}
                  <div className="p-5 space-y-4">
                    <h3 className="font-semibold text-sm flex items-center">
                      <Stethoscope className="h-4 w-4 mr-2 text-primary" /> 
                      Doctors & Specialists ({facility.doctors?.length || 0})
                    </h3>
                    {facility.doctors && facility.doctors.length > 0 ? (
                      <div className="space-y-3">
                        {facility.doctors.slice(0, 4).map((doc: Doctor, i: number) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${doc.available ? 'bg-green-500' : 'bg-gray-400'}`} />
                              <div className="font-medium">{doc.name}</div>
                            </div>
                            <div className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{doc.specialty}</div>
                          </div>
                        ))}
                        {facility.doctors.length > 4 && (
                          <div className="text-xs text-center text-muted-foreground pt-1">
                            +{facility.doctors.length - 4} more doctors
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic text-center py-4">
                        Doctor information not available
                      </div>
                    )}
                  </div>

                  {/* Equipment Section */}
                  <div className="p-5 space-y-4">
                    <h3 className="font-semibold text-sm flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-primary" /> 
                      Equipment & Facilities
                    </h3>
                    {facility.equipment && facility.equipment.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {facility.equipment.map((eq: Equipment, i: number) => (
                          <div key={i} className="bg-muted/50 rounded-md p-2 flex flex-col justify-between">
                            <div className="font-medium text-xs mb-1 truncate">{eq.name}</div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-muted-foreground">Qty: {eq.count}</span>
                              <span className={`text-[8px] font-bold px-1 py-0.5 rounded-sm uppercase ${
                                eq.status === 'AVAILABLE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                eq.status === 'IN_USE' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {eq.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic text-center py-4">
                        Equipment information not available
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filteredFacilities.length === 0 && (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="text-lg font-medium">No facilities found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
