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
      case Role.CITIZEN:
        return <Users className="h-4 w-4 mr-2" />;
      case Role.ASHA_WORKER:
        return <Stethoscope className="h-4 w-4 mr-2" />;
      case Role.HOSPITAL_STAFF:
        return <Building2 className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const getRoleLabel = (r: Role) => {
    switch (r) {
      case Role.CITIZEN:
        return "Citizen";
      case Role.ASHA_WORKER:
        return "ASHA Worker";
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
          <DropdownMenuItem onClick={() => setRole(Role.CITIZEN)}>
            <Users className="h-4 w-4 mr-2" />
            Citizen
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRole(Role.ASHA_WORKER)}>
            <Stethoscope className="h-4 w-4 mr-2" />
            ASHA Worker
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
