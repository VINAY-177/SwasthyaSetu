"use client";

import { useState } from "react";
import { Ambulance, AmbulanceStatus, Role } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AmbulanceMapWrapper from "@/components/ambulance-map-wrapper";
import { Siren } from "lucide-react";
import { toast } from "sonner";

// Seed ambulances
const initialAmbulances: Ambulance[] = [
  { id: "amb-1", vehicleNo: "UP-65-AM-1001", lat: 25.32, lng: 82.98, status: AmbulanceStatus.AVAILABLE },
  { id: "amb-2", vehicleNo: "UP-65-AM-1002", lat: 25.30, lng: 83.00, status: AmbulanceStatus.DISPATCHED },
  { id: "amb-3", vehicleNo: "UP-65-AM-1003", lat: 25.35, lng: 82.95, status: AmbulanceStatus.EN_ROUTE },
  { id: "amb-4", vehicleNo: "UP-65-AM-1004", lat: 25.28, lng: 82.90, status: AmbulanceStatus.AVAILABLE },
];

export default function AmbulancePage() {
  const { role } = useStore();
  const [ambulances, setAmbulances] = useState<Ambulance[]>(initialAmbulances);

  const handleDispatch = (id: string) => {
    setAmbulances(prev => prev.map(amb => 
      amb.id === id ? { ...amb, status: AmbulanceStatus.DISPATCHED } : amb
    ));
    toast("Ambulance Dispatched", {
      description: "Ambulance status updated successfully.",
    });
  };

  const getStatusBadge = (status: AmbulanceStatus) => {
    switch (status) {
      case AmbulanceStatus.AVAILABLE:
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Available</Badge>;
      case AmbulanceStatus.DISPATCHED:
        return <Badge variant="secondary" className="bg-orange-500 text-white hover:bg-orange-600">Dispatched</Badge>;
      case AmbulanceStatus.EN_ROUTE:
        return <Badge variant="destructive">En Route</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
          <Siren size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Ambulance Dispatch</h1>
          <p className="text-muted-foreground">Integrated with 108 Emergency Response Service</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ambulances.map(amb => (
          <Card key={amb.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{amb.vehicleNo}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-col gap-2">
                <div>{getStatusBadge(amb.status)}</div>
                <div className="text-sm text-muted-foreground">
                  Location: {amb.lat.toFixed(4)}, {amb.lng.toFixed(4)}
                </div>
              </div>
            </CardContent>
            {role === Role.HOSPITAL_STAFF && amb.status === AmbulanceStatus.AVAILABLE && (
              <CardFooter>
                <Button className="w-full" onClick={() => handleDispatch(amb.id)}>
                  Dispatch
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Tracking</CardTitle>
          <CardDescription>Real-time locations of ambulance fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <AmbulanceMapWrapper ambulances={ambulances} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dispatch Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative border-l-2 border-muted ml-3 space-y-6">
            {[
              "14:32 — AMB-UP-001 dispatched to Chandauli CHC",
              "14:15 — AMB-UP-002 arrived at District Hospital",
              "13:50 — AMB-UP-003 dispatched to Ramnagar PHC",
              "13:20 — AMB-UP-001 available at Base",
              "12:45 — AMB-UP-004 dispatched for emergency trauma case"
            ].map((log, idx) => (
              <div key={idx} className="relative pl-6">
                <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                <p className="text-sm font-medium">{log}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-center text-muted-foreground">
            This module integrates with the 108 Emergency Response Service. In production, GPS feeds from ambulance OBUs would provide real-time tracking.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
