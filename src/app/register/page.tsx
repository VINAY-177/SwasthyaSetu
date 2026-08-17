"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { calculateRiskScore } from "@/lib/risk-engine";
import { PatientForm } from "@/components/patient-form";
import { PatientRegistrationInput, RiskResult } from "@/lib/types";
import { RiskScoreCard } from "@/components/risk-score-card";

export default function RegisterPage() {
  const router = useRouter();
  const { addPatient, addScreening } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [resultDialog, setResultDialog] = useState<{
    isOpen: boolean;
    patientId?: string;
    riskResult?: RiskResult;
  }>({ isOpen: false });

  const handleSubmit = async (data: PatientRegistrationInput) => {
    setIsLoading(true);
    try {
      // 1. Add Patient to Store
      const patient = addPatient({
        name: data.name,
        age: data.age,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        village: data.village,
        district: data.district,
        state: data.state,
        incomeCategory: data.incomeCategory,
        abhaLinked: false,
        registeredById: "current-user",
      });

      // 2. Calculate AI Risk Score
      const riskResult = calculateRiskScore({
        symptoms: data.symptoms,
        vitals: data.vitals,
        age: data.age,
        gender: data.gender,
        comorbidities: data.comorbidities,
      });

      // 3. Save Screening to Store
      addScreening({
        patientId: patient.id,
        symptoms: data.symptoms,
        vitals: data.vitals,
        comorbidities: data.comorbidities,
        riskScore: riskResult.score,
        urgency: riskResult.urgency,
        riskFactors: riskResult.factors,
        riskSummary: riskResult.summary,
      });

      // 4. Cleanup local draft
      if (typeof window !== "undefined") {
        localStorage.removeItem("swasthyasetu-draft");
      }

      toast.success("Patient registered and risk evaluated successfully!");
      setResultDialog({
        isOpen: true,
        patientId: patient.id,
        riskResult,
      });
    } catch (error) {
      toast.error("Error registering patient. Please check form inputs.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Register New Citizen / Patient</CardTitle>
          <CardDescription>
            ASHA / Arogya Mandir clinical intake form with instant AI risk triage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PatientForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>

      <Dialog 
        open={resultDialog.isOpen} 
        onOpenChange={(open) => {
          if (!open && resultDialog.patientId) {
            router.push(`/patients/${resultDialog.patientId}`);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Risk &amp; Triage Assessment</DialogTitle>
            <DialogDescription>
              Patient intake successfully recorded. Review the automated risk analysis below.
            </DialogDescription>
          </DialogHeader>
          
          {resultDialog.riskResult && (
            <div className="py-2">
              <RiskScoreCard
                score={resultDialog.riskResult.score}
                urgency={resultDialog.riskResult.urgency}
                factors={resultDialog.riskResult.factors}
                summary={resultDialog.riskResult.summary}
                showActions={true}
                onCreateReferral={() => {
                  router.push(`/referrals?patientId=${resultDialog.patientId}`);
                }}
              />
            </div>
          )}
          
          <DialogFooter className="flex gap-2 sm:justify-between">
            <Button variant="outline" onClick={() => setResultDialog({ isOpen: false })}>
              Close
            </Button>
            {resultDialog.patientId && (
              <Button onClick={() => router.push(`/patients/${resultDialog.patientId}`)}>
                View Patient Record
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
