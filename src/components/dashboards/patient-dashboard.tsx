"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UrgencyBadge } from "@/components/urgency-badge";
import {
  Phone,
  Building2,
  Ambulance,
  Activity,
  UserCircle,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Users
} from "lucide-react";

export function PatientDashboard() {
  const { currentUser, facilities, patients, screenings } = useStore();

  const patient = currentUser ? patients.find(p => p.id === currentUser.id) : null;
  const latestScreening = patient ? screenings.filter(s => s.patientId === patient.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] : null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-8">
      {/* Section 1: Welcome Hero */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mt-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Namaste, {currentUser?.name || 'Citizen'}!</h1>
          <p className="text-muted-foreground text-lg">Your health companion is ready to help.</p>
        </div>
        <a href="tel:108" className="inline-block">
          <Button variant="destructive" size="lg" className="rounded-full font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all flex items-center gap-2 text-base px-6">
            <Phone className="h-5 w-5" />
            Call 108 Emergency
          </Button>
        </a>
      </div>

      <Card className="bg-primary/5 border-primary/10">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Health tip of the day</p>
            <p className="text-xs text-muted-foreground">Stay hydrated. Drink at least 8 glasses of water daily.</p>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Quick Action Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/hospitals" className="block group">
          <Card className="h-full transition-all hover:shadow-md cursor-pointer border-transparent bg-teal-50 dark:bg-teal-950/30 hover:border-teal-200">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-teal-100 dark:bg-teal-900 rounded-full group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="font-semibold text-teal-900 dark:text-teal-100 text-sm">Find Hospitals</h3>
            </CardContent>
          </Card>
        </Link>
        <Link href="/ambulance" className="block group">
          <Card className="h-full transition-all hover:shadow-md cursor-pointer border-transparent bg-red-50 dark:bg-red-950/30 hover:border-red-200">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full group-hover:scale-110 transition-transform">
                <Ambulance className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold text-red-900 dark:text-red-100 text-sm">Call Ambulance</h3>
            </CardContent>
          </Card>
        </Link>
        <Link href="/assess" className="block group">
          <Card className="h-full transition-all hover:shadow-md cursor-pointer border-transparent bg-blue-50 dark:bg-blue-950/30 hover:border-blue-200">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full group-hover:scale-110 transition-transform">
                <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Check Symptoms</h3>
            </CardContent>
          </Card>
        </Link>
        <Link href="/profile" className="block group">
          <Card className="h-full transition-all hover:shadow-md cursor-pointer border-transparent bg-emerald-50 dark:bg-emerald-950/30 hover:border-emerald-200">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full group-hover:scale-110 transition-transform">
                <UserCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm">My Profile</h3>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Section 3: Nearby Hospitals Preview */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold tracking-tight">Nearby Hospitals</h2>
          <Link href="/hospitals">
            <Button variant="ghost" size="sm" className="text-primary text-xs">
              View All <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {facilities.slice(0, 3).map((facility) => (
            <Card key={facility.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-base leading-tight line-clamp-2">{facility.name}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground whitespace-nowrap">
                    {facility.type}
                  </span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" /> {facility.district}, {facility.state}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="h-3 w-3 mr-1" /> {facility.doctors?.length || 0} Specialists
                </div>
                <div className="text-xs bg-muted/50 p-2 rounded-md">
                  <span className="font-semibold">Beds:</span> {(facility.generalBeds - facility.generalBedsUsed) + (facility.icuBeds - facility.icuBedsUsed)} Available
                </div>
                <Link href="/hospitals" className="block mt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section 4: PM-JAY Ayushman Bharat Info Card */}
      <Card className="bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full flex-shrink-0">
            <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-400 mb-1">Up to ₹5 Lakhs cashless coverage</h3>
            <p className="text-sm text-emerald-800/90 dark:text-emerald-300 mb-4">
              Under Ayushman Bharat PM-JAY. Find empanelled hospitals and get free treatment.
            </p>
            <Link href="/benefits">
              <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white dark:bg-black/20 dark:hover:bg-black/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300">
                Check Eligibility
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Recent Health Records */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Recent Health Records</h2>
        {latestScreening ? (
          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">Latest Health Screening</h3>
                <p className="text-sm text-muted-foreground">{new Date(latestScreening.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground uppercase">Risk Score</div>
                  <div className="font-bold text-lg">{latestScreening.riskScore}/100</div>
                </div>
                <UrgencyBadge urgency={latestScreening.urgency} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-3 opacity-20" />
              <p>No health records yet. Visit your nearest Arogya Mandir for a health screening.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
