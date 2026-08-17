'use client';
// Note: This component should ONLY be imported via dynamic(() => import('./facility-map'), { ssr: false }) in parent components.

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { Facility } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FacilityMapProps {
  facilities: Facility[];
  onFacilityClick?: (id: string) => void;
  selectedFacilityId?: string;
  className?: string;
}

export default function FacilityMap({ facilities, onFacilityClick, selectedFacilityId, className }: FacilityMapProps) {
  // Compute center from facilities or default to Varanasi
  const defaultCenter: [number, number] = [25.3176, 82.9739];
  const center = facilities.length > 0 && selectedFacilityId
    ? (() => {
        const found = facilities.find(f => f.id === selectedFacilityId);
        return found ? [found.lat, found.lng] as [number, number] : defaultCenter;
      })()
    : defaultCenter;

  return (
    <div className={`w-full h-full min-h-[400px] z-0 rounded-lg overflow-hidden border ${className || ''}`}>
      <MapContainer center={center} zoom={9} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {facilities.map(facility => {
          const icuAvail = Math.max(0, facility.icuBeds - facility.icuBedsUsed);
          const genAvail = Math.max(0, facility.generalBeds - facility.generalBedsUsed);

          return (
            <Marker 
              key={facility.id} 
              position={[facility.lat, facility.lng]}
              eventHandlers={{
                click: () => onFacilityClick?.(facility.id)
              }}
            >
              <Popup>
                <div className="flex flex-col gap-2 p-1 min-w-[200px]">
                  <span className="font-bold text-sm">{facility.name}</span>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">{facility.type.replace('_', ' ')}</Badge>
                    {facility.pmjayEmpanelled && (
                      <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0">PM-JAY</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div>{facility.district}, {facility.state}</div>
                    <div className="mt-1 font-medium text-foreground">
                      ICU: {icuAvail}/{facility.icuBeds} free | Gen: {genAvail}/{facility.generalBeds} free
                    </div>
                  </div>
                  <Link href={`/facilities/${facility.id}`}>
                    <Button size="sm" className="w-full mt-2 h-7 text-xs">View Facility</Button>
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
