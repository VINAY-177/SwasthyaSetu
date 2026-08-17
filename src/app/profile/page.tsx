"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AbhaCard from "@/components/abha-card";
import { 
  Phone, 
  Mail, 
  Droplets, 
  User, 
  Calendar, 
  MapPin, 
  Wallet,
  Activity,
  Ambulance,
  ArrowRight
} from "lucide-react";

export default function ProfilePage() {
  const { currentUser, patients, screenings, referrals } = useStore();

  const patient = currentUser ? patients.find((p) => p.id === currentUser.id) : null;

  if (!currentUser || !patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Profile Not Found</h2>
        <p className="text-muted-foreground">Please log in to view your profile.</p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  const patientScreenings = screenings.filter((s) => s.patientId === currentUser.id);
  const patientReferrals = referrals.filter((r) => r.patientId === currentUser.id);

  const initials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Section 1: Profile Card */}
        <Card className="md:col-span-1 border-primary/20 bg-primary/5">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-md">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold">{currentUser.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/20 text-primary uppercase tracking-wider">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Member since 2024</p>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Personal Information Grid */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3 border-b mb-4">
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <Phone className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Phone</p>
                  <p className="font-medium text-sm">{currentUser.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <Mail className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Email</p>
                  <p className="font-medium text-sm truncate max-w-[120px]">{currentUser.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <Droplets className="h-4 w-4 text-rose-500 mt-0.5" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Blood Group</p>
                  <p className="font-medium text-sm">{patient?.bloodGroup || 'Unknown'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <User className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Gender</p>
                  <p className="font-medium text-sm capitalize">{patient?.gender || 'Unknown'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <Calendar className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Age</p>
                  <p className="font-medium text-sm">{patient ? `${patient.age} years` : 'Unknown'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <Wallet className="h-4 w-4 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Income Category</p>
                  <p className="font-medium text-sm capitalize">{patient?.incomeCategory?.replace('_', ' ').toLowerCase() || 'Unknown'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 col-span-2 sm:col-span-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Address</p>
                  <p className="font-medium text-sm">
                    {patient ? `${patient.village}, ${patient.district}` : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 3: ABHA Digital Health ID */}
      <div className="mt-8">
        <h2 className="text-xl font-bold tracking-tight mb-4">Ayushman Bharat Health Account (ABHA)</h2>
        {patient?.abhaLinked ? (
          <div className="max-w-md">
            <AbhaCard 
              patient={patient} 
            />
          </div>
        ) : (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-900">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300">Link your ABHA ID</h3>
                <p className="text-sm text-blue-800/80 dark:text-blue-400/80 mt-1">
                  Connect your Ayushman Bharat Health Account for unified digital health records across all healthcare providers.
                </p>
              </div>
              <Link href="/abha">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
                  Link ABHA Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Section 4: Health History Summary */}
      <div className="mt-8">
        <h2 className="text-xl font-bold tracking-tight mb-4">Health History Summary</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl">{patientScreenings.length}</h3>
                  <p className="text-sm text-muted-foreground">Health Screenings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                  <Ambulance className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl">{patientReferrals.length}</h3>
                  <p className="text-sm text-muted-foreground">Clinical Referrals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Link href="/abha">
            <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2">
              View Full Health Records <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
