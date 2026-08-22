"use client";

import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";
import { PatientDashboard } from '@/components/dashboards/patient-dashboard';
import { DoctorDashboard } from '@/components/dashboards/doctor-dashboard';
import { StaffDashboard } from '@/components/dashboards/staff-dashboard';


export default function Dashboard() {
  const { role } = useStore();
  
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {(role === Role.CITIZEN || role === Role.PATIENT) && <PatientDashboard />}
      {role === Role.DOCTOR && <DoctorDashboard />}
      {role === Role.HOSPITAL_STAFF && <StaffDashboard />}
    </div>
  );
}
