"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";
import { 
  HeartPulse, Phone, Fingerprint, 
  ArrowRight, Shield, User, Building2,
  Users, Stethoscope, Siren, Activity, Bed
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();

  const [selectedRole, setSelectedRole] = useState<Role>(Role.PATIENT);
  
  // Shared Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  
  // Patient Fields
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAbha, setPatientAbha] = useState("");

  // Doctor Fields
  const [doctorPhone, setDoctorPhone] = useState("");
  const [doctorRegId, setDoctorRegId] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("");

  // Staff Fields
  const [staffPhone, setStaffPhone] = useState("");
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
        email: email,
      });
    } else if (selectedRole === Role.DOCTOR) {
      login({
        id: `usr-doc-${Date.now()}`,
        name: fullName || "Doctor",
        role: Role.DOCTOR,
        phone: doctorPhone,
        email: email,
        specialty: doctorSpecialty,
      });
    } else if (selectedRole === Role.HOSPITAL_STAFF) {
      login({
        id: `usr-stf-${Date.now()}`,
        name: fullName || "Hospital Staff",
        role: Role.HOSPITAL_STAFF,
        phone: staffPhone,
        email: email,
        facilityId: staffFacilityId,
      });
    }
    
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-background flex-col md:flex-row">
      {/* Left side: Hero/Brand */}
      <div className="md:w-[45%] flex flex-col justify-between p-10 md:p-16 bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        
        <div className="relative z-10 w-full max-w-lg mt-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md shadow-2xl border border-white/20">
              <HeartPulse className="w-10 h-10 text-teal-300" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              SwasthyaSetu AI
            </h1>
          </div>
          
          <h2 className="text-4xl font-semibold mb-6 leading-tight">
            Intelligent Healthcare Navigation for Rural India
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="p-5 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 flex flex-col items-start gap-3 transition-transform hover:scale-105">
              <div className="p-2.5 bg-red-500/20 rounded-xl">
                <Siren className="w-6 h-6 text-red-400" />
              </div>
              <div className="font-medium text-white">108 Emergency Network</div>
            </div>
            <div className="p-5 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 flex flex-col items-start gap-3 transition-transform hover:scale-105">
              <div className="p-2.5 bg-blue-500/20 rounded-xl">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div className="font-medium text-white">AI Clinical Triage</div>
            </div>
            <div className="p-5 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 flex flex-col items-start gap-3 transition-transform hover:scale-105">
              <div className="p-2.5 bg-emerald-500/20 rounded-xl">
                <Fingerprint className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="font-medium text-white">ABHA / ABDM Sync</div>
            </div>
            <div className="p-5 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 flex flex-col items-start gap-3 transition-transform hover:scale-105">
              <div className="p-2.5 bg-amber-500/20 rounded-xl">
                <Bed className="w-6 h-6 text-amber-400" />
              </div>
              <div className="font-medium text-white">Live Bed Tracking</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-16 mb-4 flex items-center gap-2 text-sm text-teal-200/60 font-medium">
          <Shield className="w-4 h-4" />
          <span>National Health Stack Ready &bull; 256-bit Encrypted</span>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="md:w-[55%] flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Sign in to your account</h2>
            <p className="text-muted-foreground text-base">Select your role to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-7">
            
            {/* 3-Way Visual Role Selector */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole(Role.PATIENT)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                  selectedRole === Role.PATIENT
                    ? "ring-2 ring-teal-500 bg-teal-50 border-teal-200 text-teal-800 shadow-sm"
                    : "bg-muted/30 border-transparent text-muted-foreground hover:border-muted-foreground/20 hover:bg-muted/50"
                }`}
              >
                <Users className="w-6 h-6" />
                <span className="text-sm font-semibold">Patient</span>
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedRole(Role.DOCTOR)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                  selectedRole === Role.DOCTOR
                    ? "ring-2 ring-teal-500 bg-teal-50 border-teal-200 text-teal-800 shadow-sm"
                    : "bg-muted/30 border-transparent text-muted-foreground hover:border-muted-foreground/20 hover:bg-muted/50"
                }`}
              >
                <Stethoscope className="w-6 h-6" />
                <span className="text-sm font-semibold">Doctor</span>
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedRole(Role.HOSPITAL_STAFF)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                  selectedRole === Role.HOSPITAL_STAFF
                    ? "ring-2 ring-teal-500 bg-teal-50 border-teal-200 text-teal-800 shadow-sm"
                    : "bg-muted/30 border-transparent text-muted-foreground hover:border-muted-foreground/20 hover:bg-muted/50"
                }`}
              >
                <Building2 className="w-6 h-6" />
                <span className="text-sm font-semibold">Staff</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="full-name" 
                    placeholder="Enter your full name" 
                    className="pl-9 h-11 bg-background" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email ID (Optional)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="name@example.com" 
                    className="pl-9 h-11 bg-background" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>

              {/* Patient Specific Fields */}
              {selectedRole === Role.PATIENT && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="patient-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="patient-phone" 
                        placeholder="+91 98765 43210" 
                        className="pl-9 h-11 bg-background" 
                        value={patientPhone} 
                        onChange={(e) => setPatientPhone(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-abha">ABHA ID (Optional)</Label>
                    <div className="relative">
                      <Fingerprint className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="patient-abha" 
                        placeholder="12-digit ABHA Number" 
                        className="pl-9 h-11 bg-background" 
                        value={patientAbha} 
                        onChange={(e) => setPatientAbha(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Doctor Specific Fields */}
              {selectedRole === Role.DOCTOR && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="doctor-phone" 
                        placeholder="+91 98765 43210" 
                        className="pl-9 h-11 bg-background" 
                        value={doctorPhone} 
                        onChange={(e) => setDoctorPhone(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-id">Medical Registration ID</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="doctor-id" 
                        placeholder="e.g. MCI-12345" 
                        className="pl-9 h-11 bg-background" 
                        value={doctorRegId} 
                        onChange={(e) => setDoctorRegId(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Specialty</Label>
                    <Select required value={doctorSpecialty} onValueChange={(val: string | null) => setDoctorSpecialty(val || "")}>
                      <SelectTrigger className="h-11 bg-background">
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
                </div>
              )}

              {/* Staff Specific Fields */}
              {selectedRole === Role.HOSPITAL_STAFF && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="staff-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="staff-phone" 
                        placeholder="+91 98765 43210" 
                        className="pl-9 h-11 bg-background" 
                        value={staffPhone} 
                        onChange={(e) => setStaffPhone(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff-id">Staff ID</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="staff-id" 
                        placeholder="EMP-123" 
                        className="pl-9 h-11 bg-background" 
                        value={staffId} 
                        onChange={(e) => setStaffId(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facility-name">Facility Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground z-10" />
                      <Input 
                        id="facility-name" 
                        placeholder="Enter your facility name" 
                        className="pl-9 h-11 bg-background" 
                        value={staffFacilityId} 
                        onChange={(e) => setStaffFacilityId(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 h-12 text-base font-semibold shadow-md transition-all">
                Sign In <ArrowRight className="ml-2 w-4 h-4"/>
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-4 font-medium flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Protected by ABDM compliance standards
              </p>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
