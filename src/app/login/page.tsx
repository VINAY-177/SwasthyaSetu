"use client";

import React from "react";
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

  const handleQuickDemo = (roleType: string) => {
    switch (roleType) {
      case "Patient":
        login({
          id: "usr-pat-001",
          name: "Ramesh Kumar",
          role: Role.PATIENT,
          phone: "+91 9876543210",
          email: "ramesh@example.com"
        });
        break;
      case "Doctor":
        login({
          id: "usr-doc-019",
          name: "Dr. Ananya Sharma",
          role: Role.DOCTOR,
          phone: "+91 9000000019",
          email: "ananya@example.com",
          specialty: "Cardiologist"
        });
        break;
      case "Hospital Staff":
        login({
          id: "usr-stf-009",
          name: "Staff - District Hospital Varanasi",
          role: Role.HOSPITAL_STAFF,
          phone: "+91 9000000109",
          email: "staff.vns@example.com",
          facilityId: "fac-009"
        });
        break;
      case "ASHA Worker":
        login({
          id: "usr-asha-001",
          name: "Meera Devi",
          role: Role.ASHA_WORKER,
          phone: "+91 9000000201",
          email: "meera@example.com",
        });
        break;
    }
    router.push("/");
  };

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuickDemo("Patient");
  };
  
  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuickDemo("Doctor");
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuickDemo("Hospital Staff");
  };

  const handleAshaLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuickDemo("ASHA Worker");
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
              <div className="text-3xl font-bold mb-1">10+</div>
              <div className="text-teal-100 text-sm">Facilities Connected</div>
            </div>
            <div className="p-4 bg-black/10 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="text-3xl font-bold mb-1">AI</div>
              <div className="text-teal-100 text-sm">Symptom Checker</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground">Select your role to access the platform</p>
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
                    <Label htmlFor="patient-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="patient-phone" placeholder="+91 98765 43210" className="pl-9" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-abha">ABHA ID (Optional)</Label>
                    <div className="relative">
                      <Fingerprint className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="patient-abha" placeholder="12-digit ABHA Number" className="pl-9" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Login <ArrowRight className="ml-2 w-4 h-4"/></Button>
                </form>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                </div>
                <Button variant="outline" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50" onClick={() => handleQuickDemo("Patient")}>
                  Quick Demo Login
                </Button>
                <div className="text-center mt-3 text-xs text-muted-foreground">Logs in as Ramesh Kumar (Patient)</div>
              </Card>
            </TabsContent>

            {/* Doctor Form */}
            <TabsContent value="doctor">
              <Card className="p-6">
                <form onSubmit={handleDoctorLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-id">Medical Registration ID</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="doctor-id" placeholder="e.g. MCI-12345" className="pl-9" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Specialty</Label>
                    <Select required>
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
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                </div>
                <Button variant="outline" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50" onClick={() => handleQuickDemo("Doctor")}>
                  Quick Demo Login
                </Button>
                <div className="text-center mt-3 text-xs text-muted-foreground">Logs in as Dr. Ananya Sharma (Cardiologist)</div>
              </Card>
            </TabsContent>

            {/* Hospital Staff Form */}
            <TabsContent value="staff">
              <Card className="p-6">
                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staff-id">Staff ID</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="staff-id" placeholder="EMP-123" className="pl-9" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Facility</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.map(f => (
                          <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Login <ArrowRight className="ml-2 w-4 h-4"/></Button>
                </form>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                </div>
                <Button variant="outline" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50" onClick={() => handleQuickDemo("Hospital Staff")}>
                  Quick Demo Login
                </Button>
                <div className="text-center mt-3 text-xs text-muted-foreground">Logs in as Staff at District Hospital Varanasi</div>
              </Card>
            </TabsContent>

            {/* ASHA Worker Form */}
            <TabsContent value="asha">
              <Card className="p-6">
                <form onSubmit={handleAshaLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="asha-id">ASHA Worker ID</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="asha-id" placeholder="AW-1234" className="pl-9" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="asha-village">Village / Block</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="asha-village" placeholder="e.g. Kashi Vidyapeeth" className="pl-9" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Login <ArrowRight className="ml-2 w-4 h-4"/></Button>
                </form>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                </div>
                <Button variant="outline" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50" onClick={() => handleQuickDemo("ASHA Worker")}>
                  Quick Demo Login
                </Button>
                <div className="text-center mt-3 text-xs text-muted-foreground">Logs in as Meera Devi (Kashi Vidyapeeth)</div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
