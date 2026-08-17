"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";
import { 
  HeartPulse, Phone, Fingerprint, 
  ArrowRight, Shield, User, Building2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function LoginPage() {
  const router = useRouter();
  const { login, facilities } = useStore();

  const [selectedRole, setSelectedRole] = useState<Role>(Role.PATIENT);
  
  // Shared Form State
  const [fullName, setFullName] = useState("");
  
  // Patient Fields
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAbha, setPatientAbha] = useState("");

  // Doctor Fields
  const [doctorRegId, setDoctorRegId] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("");

  // Staff Fields
  const [staffId, setStaffId] = useState("");
  const [staffFacilityId, setStaffFacilityId] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRole === Role.PATIENT) {
      login({
        id: `usr-pat-${Date.now()}`,
        name: fullName || "Patient",
        role: Role.PATIENT,
        phone: patientPhone,
        email: "",
      });
    } else if (selectedRole === Role.DOCTOR) {
      login({
        id: `usr-doc-${Date.now()}`,
        name: fullName || "Doctor",
        role: Role.DOCTOR,
        phone: "",
        email: "",
        specialty: doctorSpecialty,
      });
    } else if (selectedRole === Role.HOSPITAL_STAFF) {
      login({
        id: `usr-stf-${Date.now()}`,
        name: fullName || "Hospital Staff",
        role: Role.HOSPITAL_STAFF,
        phone: "",
        email: "",
        facilityId: staffFacilityId,
      });
    }
    
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-background flex-col md:flex-row">
      {/* Left side: Hero/Brand */}
      <div className="md:w-1/2 flex flex-col justify-center items-start p-10 md:p-16 bg-gradient-to-br from-teal-500 to-emerald-700 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="relative z-10 w-full max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <HeartPulse className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">SwasthyaSetu AI</h1>
          </div>
          
          <h2 className="text-3xl font-semibold mb-6">
            Bridging the gap in rural healthcare through AI
          </h2>
          
          <p className="text-teal-100 text-lg mb-10 leading-relaxed">
            A comprehensive unified health platform empowering citizens and hospitals with intelligent screening, referral management, and scheme benefits tracking.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-black/10 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold mb-1">AI</div>
              <div className="text-teal-100 text-sm">Symptom Checker</div>
            </div>
            <div className="p-4 bg-black/10 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold mb-1">108</div>
              <div className="text-teal-100 text-sm">Ambulance Network</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome</h2>
            <p className="text-muted-foreground">Select your role and sign in to access the platform</p>
          </div>

          <Card className="p-8 shadow-lg border-muted/60">
            <form onSubmit={handleLogin} className="space-y-5">
              
              <div className="space-y-2">
                <Label>Account Role</Label>
                <Select required value={selectedRole} onValueChange={(val) => setSelectedRole(val as Role)}>
                  <SelectTrigger className="h-12 bg-muted/20">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Role.PATIENT}>Patient / Citizen</SelectItem>
                    <SelectItem value={Role.DOCTOR}>Medical Doctor</SelectItem>
                    <SelectItem value={Role.HOSPITAL_STAFF}>Hospital Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="full-name" 
                    placeholder="Enter your full name" 
                    className="pl-9 h-11" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              {/* Patient Specific Fields */}
              {selectedRole === Role.PATIENT && (
                <>
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="patient-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="patient-phone" 
                        placeholder="+91 98765 43210" 
                        className="pl-9 h-11" 
                        value={patientPhone} 
                        onChange={(e) => setPatientPhone(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="patient-abha">ABHA ID (Optional)</Label>
                    <div className="relative">
                      <Fingerprint className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="patient-abha" 
                        placeholder="12-digit ABHA Number" 
                        className="pl-9 h-11" 
                        value={patientAbha} 
                        onChange={(e) => setPatientAbha(e.target.value)} 
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Doctor Specific Fields */}
              {selectedRole === Role.DOCTOR && (
                <>
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="doctor-id">Medical Registration ID</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="doctor-id" 
                        placeholder="e.g. MCI-12345" 
                        className="pl-9 h-11" 
                        value={doctorRegId} 
                        onChange={(e) => setDoctorRegId(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label>Specialty</Label>
                    <Select required value={doctorSpecialty} onValueChange={(val: string | null) => setDoctorSpecialty(val || "")}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                        <SelectItem value="Surgeon">Surgeon</SelectItem>
                        <SelectItem value="General Physician">General Physician</SelectItem>
                        <SelectItem value="Paediatrician">Paediatrician</SelectItem>
                        <SelectItem value="OB-GYN">OB-GYN</SelectItem>
                        <SelectItem value="Orthopaedics">Orthopaedics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Staff Specific Fields */}
              {selectedRole === Role.HOSPITAL_STAFF && (
                <>
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="staff-id">Staff ID</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="staff-id" 
                        placeholder="EMP-123" 
                        className="pl-9 h-11" 
                        value={staffId} 
                        onChange={(e) => setStaffId(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label>Facility</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground z-10" />
                      <Select required value={staffFacilityId} onValueChange={(val: string | null) => setStaffFacilityId(val || "")}>
                        <SelectTrigger className="h-11 pl-9">
                          <SelectValue placeholder="Select facility" />
                        </SelectTrigger>
                        <SelectContent>
                          {facilities.length > 0 ? (
                            facilities.map(f => (
                              <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No facilities registered yet</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 h-11 mt-6 text-base font-medium">
                Sign In <ArrowRight className="ml-2 w-4 h-4"/>
              </Button>
            </form>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
