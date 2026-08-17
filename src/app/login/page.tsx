"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";
import { 
  HeartPulse, Phone, Fingerprint, Stethoscope, 
  Building2, Users, ArrowRight, Shield 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function LoginPage() {
  const router = useRouter();
  const { login, facilities } = useStore();

  // Patient form state
  const [patientPhone, setPatientPhone] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientAbha, setPatientAbha] = useState("");

  // Doctor form state
  const [doctorRegId, setDoctorRegId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("");

  // Staff form state
  const [staffId, setStaffId] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffFacilityId, setStaffFacilityId] = useState("");

  // ASHA form state
  const [ashaId, setAshaId] = useState("");
  const [ashaName, setAshaName] = useState("");
  const [ashaVillage, setAshaVillage] = useState("");

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: `usr-pat-${Date.now()}`,
      name: patientName || "Patient",
      role: Role.PATIENT,
      phone: patientPhone,
      email: "",
    });
    router.push("/");
  };
  
  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: `usr-doc-${Date.now()}`,
      name: doctorName || "Doctor",
      role: Role.DOCTOR,
      phone: "",
      email: "",
      specialty: doctorSpecialty,
    });
    router.push("/");
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: `usr-stf-${Date.now()}`,
      name: staffName || "Hospital Staff",
      role: Role.HOSPITAL_STAFF,
      phone: "",
      email: "",
      facilityId: staffFacilityId,
    });
    router.push("/");
  };

  const handleAshaLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: `usr-asha-${Date.now()}`,
      name: ashaName || "ASHA Worker",
      role: Role.ASHA_WORKER,
      phone: "",
      email: "",
    });
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
            A comprehensive unified health platform empowering citizens, ASHA workers, and hospitals with intelligent screening, referral management, and scheme benefits tracking.
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

          <Tabs defaultValue="patient" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="patient" title="Patient"><Users className="w-4 h-4 md:hidden"/><span className="hidden md:inline">Patient</span></TabsTrigger>
              <TabsTrigger value="doctor" title="Doctor"><Stethoscope className="w-4 h-4 md:hidden"/><span className="hidden md:inline">Doctor</span></TabsTrigger>
              <TabsTrigger value="staff" title="Hospital Staff"><Building2 className="w-4 h-4 md:hidden"/><span className="hidden md:inline">Staff</span></TabsTrigger>
              <TabsTrigger value="asha" title="ASHA Worker"><Shield className="w-4 h-4 md:hidden"/><span className="hidden md:inline">ASHA</span></TabsTrigger>
            </TabsList>

            {/* Patient Form */}
            <TabsContent value="patient">
              <Card className="p-6">
                <form onSubmit={handlePatientLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-name">Full Name</Label>
                    <Input id="patient-name" placeholder="Enter your full name" value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="patient-phone" placeholder="+91 98765 43210" className="pl-9" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-abha">ABHA ID (Optional)</Label>
                    <div className="relative">
                      <Fingerprint className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="patient-abha" placeholder="12-digit ABHA Number" className="pl-9" value={patientAbha} onChange={(e) => setPatientAbha(e.target.value)} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Login <ArrowRight className="ml-2 w-4 h-4"/></Button>
                </form>
              </Card>
            </TabsContent>

            {/* Doctor Form */}
            <TabsContent value="doctor">
              <Card className="p-6">
                <form onSubmit={handleDoctorLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-name">Full Name</Label>
                    <Input id="doctor-name" placeholder="Dr. Full Name" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-id">Medical Registration ID</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="doctor-id" placeholder="e.g. MCI-12345" className="pl-9" value={doctorRegId} onChange={(e) => setDoctorRegId(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Specialty</Label>
                    <Select required onValueChange={(val: string | null) => setDoctorSpecialty(val || "")}>
                      <SelectTrigger>
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
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Login <ArrowRight className="ml-2 w-4 h-4"/></Button>
                </form>
              </Card>
            </TabsContent>

            {/* Hospital Staff Form */}
            <TabsContent value="staff">
              <Card className="p-6">
                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staff-name">Full Name</Label>
                    <Input id="staff-name" placeholder="Enter your full name" value={staffName} onChange={(e) => setStaffName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff-id">Staff ID</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="staff-id" placeholder="EMP-123" className="pl-9" value={staffId} onChange={(e) => setStaffId(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Facility</Label>
                    <Select required onValueChange={(val: string | null) => setStaffFacilityId(val || "")}>
                      <SelectTrigger>
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
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Login <ArrowRight className="ml-2 w-4 h-4"/></Button>
                </form>
              </Card>
            </TabsContent>

            {/* ASHA Worker Form */}
            <TabsContent value="asha">
              <Card className="p-6">
                <form onSubmit={handleAshaLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="asha-name">Full Name</Label>
                    <Input id="asha-name" placeholder="Enter your full name" value={ashaName} onChange={(e) => setAshaName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="asha-id">ASHA Worker ID</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="asha-id" placeholder="AW-1234" className="pl-9" value={ashaId} onChange={(e) => setAshaId(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="asha-village">Village / Block</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="asha-village" placeholder="e.g. Kashi Vidyapeeth" className="pl-9" value={ashaVillage} onChange={(e) => setAshaVillage(e.target.value)} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Login <ArrowRight className="ml-2 w-4 h-4"/></Button>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
