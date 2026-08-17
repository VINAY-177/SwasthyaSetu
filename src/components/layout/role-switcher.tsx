"use client";

import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";
import { Users, Stethoscope, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function RoleSwitcher() {
  const { role, setRole } = useStore();

  const getRoleIcon = (r: Role) => {
    switch (r) {
      case Role.PATIENT:
        return <Users className="h-4 w-4 mr-2" />;
      case Role.DOCTOR:
        return <Stethoscope className="h-4 w-4 mr-2" />;
      case Role.HOSPITAL_STAFF:
        return <Building2 className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const getRoleLabel = (r: Role) => {
    switch (r) {
      case Role.PATIENT:
        return "Patient";
      case Role.DOCTOR:
        return "Doctor";
      case Role.HOSPITAL_STAFF:
        return "Hospital Staff";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground hidden sm:inline-block">Role:</span>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer">
          {getRoleIcon(role)}
          {getRoleLabel(role)}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setRole(Role.PATIENT)}>
            <Users className="h-4 w-4 mr-2" />
            Patient
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRole(Role.DOCTOR)}>
            <Stethoscope className="h-4 w-4 mr-2" />
            Doctor
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRole(Role.HOSPITAL_STAFF)}>
            <Building2 className="h-4 w-4 mr-2" />
            Hospital Staff
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
