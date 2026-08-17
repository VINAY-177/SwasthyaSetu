'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { FacilityType } from '@/lib/types';
import FacilityMapWrapper from '@/components/facility-map-wrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { MapPin, Phone, ShieldCheck } from 'lucide-react';

export default function FacilitiesPage() {
  const { facilities } = useStore();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [pmjayOnly, setPmjayOnly] = useState(false);
  const [hasIcuOnly, setHasIcuOnly] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | undefined>();

  const filteredFacilities = facilities.filter((f) => {
    if (selectedType !== 'All' && f.type !== selectedType) return false;
    if (pmjayOnly && !f.pmjayEmpanelled) return false;
    if (hasIcuOnly && (f.icuBeds - f.icuBedsUsed) <= 0) return false;
    return true;
  });

  const FacilityList = () => (
    <div className="flex flex-col h-full space-y-4">
      <div className="p-4 border rounded-lg bg-card space-y-3">
        <h3 className="font-semibold text-sm">Filter Network</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="space-y-1.5">
            <Label className="text-xs">Facility Type</Label>
            <Select value={selectedType} onValueChange={(val) => val && setSelectedType(val)}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value={FacilityType.AROGYA_MANDIR}>Arogya Mandir</SelectItem>
                <SelectItem value={FacilityType.PHC}>PHC</SelectItem>
                <SelectItem value={FacilityType.CHC}>CHC</SelectItem>
                <SelectItem value={FacilityType.DISTRICT_HOSPITAL}>District Hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 pb-2">
            <Checkbox 
              id="pmjay" 
              checked={pmjayOnly} 
              onCheckedChange={(checked) => setPmjayOnly(!!checked)} 
            />
            <Label htmlFor="pmjay" className="text-xs cursor-pointer">PM-JAY Empanelled</Label>
          </div>
          <div className="flex items-center space-x-2 pb-2">
            <Checkbox 
              id="icu" 
              checked={hasIcuOnly} 
              onCheckedChange={(checked) => setHasIcuOnly(!!checked)} 
            />
            <Label htmlFor="icu" className="text-xs cursor-pointer">ICU Beds Available</Label>
          </div>
        </div>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-1 max-h-[600px]">
        {filteredFacilities.length === 0 ? (
          <div className="text-muted-foreground text-center py-12 border rounded-lg bg-card">
            No facilities match your active filters.
          </div>
        ) : (
          filteredFacilities.map((f) => {
            const icuAvail = Math.max(0, f.icuBeds - f.icuBedsUsed);
            const genAvail = Math.max(0, f.generalBeds - f.generalBedsUsed);

            return (
              <Link 
                key={f.id} 
                href={`/facilities/${f.id}`} 
                onMouseEnter={() => setSelectedFacilityId(f.id)} 
                onMouseLeave={() => setSelectedFacilityId(undefined)}
              >
                <Card className={`hover:border-primary transition-all mb-3 cursor-pointer ${selectedFacilityId === f.id ? 'border-primary shadow-md ring-1 ring-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="font-bold text-base hover:text-primary">{f.name}</h4>
                      <Badge variant="outline" className="text-xs">{f.type.replace('_', ' ')}</Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mb-3 gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{f.district}, {f.state}</span>
                      <span className="mx-1">•</span>
                      <Phone className="w-3 h-3" />
                      <span>{f.phone}</span>
                    </div>
                    
                    <div className="text-xs bg-secondary/50 p-2.5 rounded mb-2.5 flex justify-between">
                      <span>
                        <strong>ICU:</strong> <span className={icuAvail > 0 ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>{icuAvail} free</span> / {f.icuBeds}
                      </span>
                      <span>
                        <strong>General:</strong> <span className="font-semibold">{genAvail} free</span> / {f.generalBeds}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {f.pmjayEmpanelled && (
                        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] gap-1">
                          <ShieldCheck className="h-3 w-3" /> PM-JAY Empanelled
                        </Badge>
                      )}
                      {f.specialists.length > 0 && (
                        <Badge variant="secondary" className="text-[11px]">{f.specialists.length} Specialists</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Healthcare Facility Network</h1>
        <p className="text-muted-foreground mt-1">Real-time bed availability and intelligence across Varanasi and Rajasthan network.</p>
      </div>

      {/* Desktop Split View */}
      <div className="hidden md:grid md:grid-cols-12 gap-6 min-h-[650px]">
        <div className="md:col-span-5 flex flex-col min-h-0">
          <FacilityList />
        </div>
        <div className="md:col-span-7 border rounded-lg overflow-hidden relative min-h-[600px]">
          <FacilityMapWrapper 
            facilities={filteredFacilities} 
            selectedFacilityId={selectedFacilityId}
          />
        </div>
      </div>

      {/* Mobile Tabbed Layout */}
      <div className="md:hidden">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="list">List View ({filteredFacilities.length})</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <FacilityList />
          </TabsContent>
          <TabsContent value="map" className="min-h-[450px] border rounded-lg overflow-hidden">
             <FacilityMapWrapper facilities={filteredFacilities} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
