"use client";

import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Fingerprint, CheckCircle2, Clock } from "lucide-react";
import AbhaCard from "@/components/abha-card";
import { Urgency } from "@/lib/types";
import { toast } from "sonner";

export default function AbhaPage() {
  const { patients, getScreeningsForPatient, currentUser } = useStore();
  
  // Look up the logged-in user's patient record, if available
  const patient = patients.find(p => p.name === currentUser?.name) || (patients.length > 0 ? patients[0] : null);
  const screenings = patient ? getScreeningsForPatient(patient.id) : [];

  const handleLinkAbha = () => {
    toast("ABHA Linking Initiated", {
      description: "In production, this would initiate the ABHA linking process via ABDM APIs.",
    });
  };

  const getUrgencyBadge = (urgency: Urgency) => {
    switch (urgency) {
      case Urgency.EMERGENCY: return <Badge variant="destructive">Emergency</Badge>;
      case Urgency.HIGH: return <Badge variant="destructive" className="bg-orange-500">High</Badge>;
      case Urgency.MODERATE: return <Badge variant="secondary" className="bg-amber-500 text-white">Moderate</Badge>;
      case Urgency.LOW: return <Badge variant="default" className="bg-green-500">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
          <Fingerprint size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ABHA Digital Health ID</h1>
          <p className="text-muted-foreground">Ayushman Bharat Health Account Management</p>
        </div>
      </div>

      {!patient ? (
        <Card>
          <CardContent className="p-10 text-center space-y-4">
            <Fingerprint className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">No Patient Selected</h3>
            <p className="text-muted-foreground">Please register or select a patient to view their ABHA details.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Digital Health Card</CardTitle>
                <CardDescription>Official ABHA ID Card for {patient.name}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-6 bg-slate-50 rounded-b-xl border-t">
                <AbhaCard patient={patient} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Link New Records</CardTitle>
                <CardDescription>Follow these steps to link physical records to ABHA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {[
                    "Visit nearest Arogya Mandir or PHC",
                    "Carry Aadhaar card and existing health documents",
                    "Health worker will create/link your ABHA ID",
                    "All future records will be linked digitally"
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                        {idx + 1}
                      </div>
                      <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-card border rounded-lg shadow-sm p-3">
                        <span className="text-sm font-medium">{step}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <Button className="w-full" onClick={handleLinkAbha}>
                    <Fingerprint className="mr-2 h-4 w-4" />
                    Link ABHA ID
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Health Record Timeline</CardTitle>
                <CardDescription>Digitally linked encounters and screenings</CardDescription>
              </CardHeader>
              <CardContent>
                {screenings.length === 0 ? (
                  <div className="text-center p-6 text-muted-foreground">
                    No linked health records found for this patient.
                  </div>
                ) : (
                  <div className="space-y-6 relative border-l-2 border-muted ml-3">
                    {screenings.map((screening) => (
                      <div key={screening.id} className="relative pl-6">
                        <div className="absolute -left-[9px] top-1.5 bg-background">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-card border rounded-lg p-4 shadow-sm space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-muted-foreground gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(screening.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', month: 'short', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </div>
                            {getUrgencyBadge(screening.urgency)}
                          </div>
                          
                          <div>
                            <div className="text-sm font-semibold mb-1">Risk Score: {screening.riskScore}/100</div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {screening.symptoms.map(sym => (
                                <Badge key={sym} variant="outline" className="text-xs bg-slate-50">
                                  {sym}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
