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

// Ambulance fleet - populated from live data in production
const initialAmbulances: Ambulance[] = [];

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
            {ambulances.length === 0 ? (
              <div className="pl-6">
                <p className="text-sm text-muted-foreground">No dispatch activity yet.</p>
              </div>
            ) : (
              ambulances.map((amb, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                  <p className="text-sm font-medium">{amb.vehicleNo} — {amb.status}</p>
                </div>
              ))
            )}
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
