"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartPulse,
  LayoutDashboard,
  UserPlus,
  Users,
  Activity,
  Hospital,
  Ambulance,
  Siren,
  ShieldCheck,
  Fingerprint,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";

const getNavItems = (role: Role) => {
  const common = [{ href: '/', label: 'Dashboard', icon: LayoutDashboard }];
  
  switch (role) {
    case Role.CITIZEN:
    case Role.PATIENT:
      return [
        ...common,
        { href: '/hospitals', label: 'Nearby Hospitals', icon: Hospital },
        { href: '/ambulance', label: 'Ambulance 108', icon: Siren },
        { href: '/assess', label: 'Symptom Checker', icon: Activity },
        { href: '/benefits', label: 'Scheme Benefits', icon: ShieldCheck },
        { href: '/profile', label: 'My Profile', icon: UserCircle },
        { href: '/abha', label: 'ABHA Health ID', icon: Fingerprint },
      ];
    case Role.DOCTOR:
      return [
        ...common,
        { href: '/patients', label: 'Patient Records', icon: Users },
        { href: '/assess', label: 'Risk Assessment', icon: Activity },
        { href: '/referrals', label: 'Referrals', icon: Ambulance },
        { href: '/facilities', label: 'Facilities & Beds', icon: Hospital },
      ];
    case Role.HOSPITAL_STAFF:
      return [
        ...common,
        { href: '/facilities', label: 'Facilities & Beds', icon: Hospital },
        { href: '/referrals', label: 'Referral Mgmt', icon: Ambulance },
        { href: '/ambulance', label: 'Ambulance Fleet', icon: Siren },
        { href: '/patients', label: 'Patient Records', icon: Users },
        { href: '/register', label: 'Register Patient', icon: UserPlus },
      ];

    default:
      return common;
  }
};

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useStore();
  const navItems = getNavItems(role);

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground w-64 border-r">
      <div className="p-4 flex items-center gap-2 border-b">
        <HeartPulse className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">SwasthyaSetu AI</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                  : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground text-center">SwasthyaSetu AI v1.0</p>
      </div>
    </div>
  );
}
