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
    <div 
      className="flex min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Green overlay to match the 'whole green' requirement */}
      <div className="absolute inset-0 bg-teal-950/70 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-transparent" />

      {/* Foreground Content */}
      <div className="relative z-10 w-full flex flex-col md:flex-row min-h-screen">
        
        {/* Left side / Background Branding */}
        <div className="md:w-1/2 flex flex-col justify-center p-10 md:p-16 text-white h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-lg border border-white/30">
              <HeartPulse className="w-10 h-10 text-emerald-300" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
              SwasthyaSetu AI
            </h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 leading-tight drop-shadow-md max-w-lg">
            Intelligent Healthcare Navigation for Rural India
          </h2>
          
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 flex flex-col items-start gap-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Siren className="w-5 h-5 text-white" />
              </div>
              <div className="font-medium text-sm text-white">108 Emergency Network</div>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 flex flex-col items-start gap-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="font-medium text-sm text-white">AI Clinical Triage</div>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 flex flex-col items-start gap-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Fingerprint className="w-5 h-5 text-white" />
              </div>
              <div className="font-medium text-sm text-white">ABHA / ABDM Sync</div>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 flex flex-col items-start gap-2">
              <div className="p-2 bg-white/20 rounded-xl">
                <Bed className="w-5 h-5 text-white" />
              </div>
              <div className="font-medium text-sm text-white">Live Bed Tracking</div>
            </div>
          </div>
        </div>

        {/* Right side: Login Form */}
        <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-[440px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-slate-800">Sign In</h2>
              <p className="text-slate-500 text-sm">Select your role to continue securely</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* 3-Way Visual Role Selector */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole(Role.PATIENT)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                    selectedRole === Role.PATIENT
                      ? "ring-2 ring-emerald-500 bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="text-xs font-semibold">Patient</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setSelectedRole(Role.DOCTOR)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                    selectedRole === Role.DOCTOR
                      ? "ring-2 ring-emerald-500 bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <Stethoscope className="w-5 h-5" />
                  <span className="text-xs font-semibold">Doctor</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setSelectedRole(Role.HOSPITAL_STAFF)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                    selectedRole === Role.HOSPITAL_STAFF
                      ? "ring-2 ring-emerald-500 bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs font-semibold">Staff</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="full-name" className="text-slate-700">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="full-name" 
                      placeholder="Enter your full name" 
                      className="pl-9 h-10 bg-white" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-slate-700">Email ID (Optional)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="name@example.com" 
                      className="pl-9 h-10 bg-white" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Patient Specific Fields */}
                {selectedRole === Role.PATIENT && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1.5">
                      <Label htmlFor="patient-phone" className="text-slate-700">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          id="patient-phone" 
                          placeholder="+91 98765 43210" 
                          className="pl-9 h-10 bg-white" 
                          value={patientPhone} 
                          onChange={(e) => setPatientPhone(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="patient-abha" className="text-slate-700">ABHA ID (Optional)</Label>
                      <div className="relative">
                        <Fingerprint className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          id="patient-abha" 
                          placeholder="12-digit ABHA Number" 
                          className="pl-9 h-10 bg-white" 
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
                    <div className="space-y-1.5">
                      <Label htmlFor="doctor-phone" className="text-slate-700">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          id="doctor-phone" 
                          placeholder="+91 98765 43210" 
                          className="pl-9 h-10 bg-white" 
                          value={doctorPhone} 
                          onChange={(e) => setDoctorPhone(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="doctor-id" className="text-slate-700">Medical Registration ID</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          id="doctor-id" 
                          placeholder="e.g. MCI-12345" 
                          className="pl-9 h-10 bg-white" 
                          value={doctorRegId} 
                          onChange={(e) => setDoctorRegId(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-slate-700">Specialty</Label>
                      <Select value={doctorSpecialty} onValueChange={(val) => setDoctorSpecialty(val ?? "")}>
                        <SelectTrigger className="h-10 bg-white">
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
                    <div className="space-y-1.5">
                      <Label htmlFor="staff-phone" className="text-slate-700">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          id="staff-phone" 
                          placeholder="+91 98765 43210" 
                          className="pl-9 h-10 bg-white" 
                          value={staffPhone} 
                          onChange={(e) => setStaffPhone(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="staff-id" className="text-slate-700">Staff ID</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input 
                          id="staff-id" 
                          placeholder="EMP-123" 
                          className="pl-9 h-10 bg-white" 
                          value={staffId} 
                          onChange={(e) => setStaffId(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="facility-name" className="text-slate-700">Facility Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                        <Input 
                          id="facility-name" 
                          placeholder="Enter your facility name" 
                          className="pl-9 h-10 bg-white" 
                          value={staffFacilityId} 
                          onChange={(e) => setStaffFacilityId(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 space-y-4">
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base font-semibold shadow-md transition-all text-white">
                  Sign In <ArrowRight className="ml-2 w-4 h-4"/>
                </Button>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  Protected by ABDM compliance standards
                </div>
              </div>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
}
