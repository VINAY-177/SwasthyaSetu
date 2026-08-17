'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Role, ReferralStatus, Urgency, Referral } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Plus, FileText } from 'lucide-react';
import Link from 'next/link';
import { UrgencyBadge } from '@/components/urgency-badge';
import { ClinicalReferralSlipModal } from '@/components/clinical-referral-slip';
import { toast } from 'sonner';

export default function ReferralsPage() {
  const { referrals, updateReferralStatus, patients, facilities, role, addReferral } = useStore();
  const isStaff = role === Role.HOSPITAL_STAFF;

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [urgency, setUrgency] = useState<Urgency>(Urgency.HIGH);
  const [reason, setReason] = useState<string>('');
  
  // Slip Modal state
  const [selectedReferralForSlip, setSelectedReferralForSlip] = useState<Referral | null>(null);

  const activeReferrals = referrals.filter(r => 
    [ReferralStatus.PENDING, ReferralStatus.ACCEPTED, ReferralStatus.EN_ROUTE].includes(r.status)
  );
  const completedReferrals = referrals.filter(r => r.status === ReferralStatus.ARRIVED);

  const getStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case ReferralStatus.PENDING: 
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">Pending</Badge>;
      case ReferralStatus.ACCEPTED: 
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">Accepted</Badge>;
      case ReferralStatus.EN_ROUTE: 
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-800 border-indigo-300">En Route</Badge>;
      case ReferralStatus.ARRIVED: 
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300">Arrived</Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCreateReferral = () => {
    if (!selectedPatientId || !selectedFacilityId || !reason.trim()) {
      toast.error('Please select patient, destination facility, and state referral reason.');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);
    const toFac = facilities.find(f => f.id === selectedFacilityId);

    const newRef = addReferral({
      patientId: selectedPatientId,
      patientName: patient?.name || 'Unknown Patient',
      fromFacilityId: null,
      toFacilityId: selectedFacilityId,
      toFacilityName: toFac?.name || 'Unknown Facility',
      status: ReferralStatus.PENDING,
      urgency,
      ambulanceId: null,
      reason,
    });

    toast.success('Referral created and sent to destination facility!');
    setCreateDialogOpen(false);
    setSelectedPatientId('');
    setSelectedFacilityId('');
    setReason('');
    
    // Automatically preview slip
    setSelectedReferralForSlip(newRef);
  };

  const renderActionButtons = (referralId: string, currentStatus: ReferralStatus) => {
    if (!isStaff) return null;

    if (currentStatus === ReferralStatus.PENDING) {
      return (
        <Button size="sm" onClick={() => updateReferralStatus(referralId, ReferralStatus.ACCEPTED)}>
          Accept Referral
        </Button>
      );
    }
    if (currentStatus === ReferralStatus.ACCEPTED) {
      return (
        <Button size="sm" variant="secondary" onClick={() => updateReferralStatus(referralId, ReferralStatus.EN_ROUTE)}>
          Mark En Route
        </Button>
      );
    }
    if (currentStatus === ReferralStatus.EN_ROUTE) {
      return (
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => updateReferralStatus(referralId, ReferralStatus.ARRIVED)}>
          Mark Arrived
        </Button>
      );
    }
    return null;
  };

  const ReferralList = ({ items, emptyMsg }: { items: typeof referrals, emptyMsg: string }) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed bg-card">
          {emptyMsg}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map(ref => {
          const patient = patients.find(p => p.id === ref.patientId);
          const fromFacility = facilities.find(f => f.id === ref.fromFacilityId);
          const toFacility = facilities.find(f => f.id === ref.toFacilityId);

          return (
            <Card key={ref.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/patients/${ref.patientId}`} className="text-lg font-bold hover:underline text-primary">
                        {patient?.name || ref.patientName}
                      </Link>
                      <UrgencyBadge urgency={ref.urgency} size="sm" />
                      {getStatusBadge(ref.status)}
                    </div>
                    
                    <div className="flex items-center flex-wrap gap-2 text-sm">
                      <span className="text-xs text-muted-foreground">From:</span>
                      <span className="font-medium text-xs">
                        {fromFacility ? (
                          <Link href={`/facilities/${fromFacility.id}`} className="hover:underline">
                            {fromFacility.name}
                          </Link>
                        ) : 'Community Intake / Home'}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground mx-1" />
                      <span className="text-xs text-muted-foreground">To:</span>
                      <Link href={`/facilities/${ref.toFacilityId}`} className="hover:underline font-semibold text-xs text-primary">
                        {toFacility?.name || ref.toFacilityName}
                      </Link>
                    </div>

                    <div className="text-xs bg-muted/30 p-2.5 rounded text-foreground">
                      <span className="font-semibold text-muted-foreground">Clinical Reason: </span>
                      {ref.reason}
                    </div>
                    
                    <div className="text-[11px] text-muted-foreground">
                      Created: {new Date(ref.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2 shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedReferralForSlip(ref)}
                      className="text-xs h-8 flex items-center gap-1"
                    >
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      Clinical Slip
                    </Button>
                    {renderActionButtons(ref.id, ref.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const activeSlipPatient = selectedReferralForSlip ? patients.find(p => p.id === selectedReferralForSlip.patientId) : undefined;
  const activeSlipFacility = selectedReferralForSlip ? facilities.find(f => f.id === selectedReferralForSlip.toFacilityId) : undefined;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referral Management</h1>
          <p className="text-muted-foreground mt-1">Track and coordinate inter-facility patient transfers and triage status.</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Create Referral
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full sm:w-auto grid-cols-2 max-w-md">
          <TabsTrigger value="active">Active Referrals ({activeReferrals.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedReferrals.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <ReferralList items={activeReferrals} emptyMsg="No active referrals currently in progress." />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <ReferralList items={completedReferrals} emptyMsg="No completed referrals recorded yet." />
        </TabsContent>
      </Tabs>

      {/* Create Referral Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Initiate Patient Referral</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Select Patient</Label>
              <Select value={selectedPatientId} onValueChange={(val) => val && setSelectedPatientId(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a registered patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.age}y, {p.village})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Destination Facility</Label>
              <Select value={selectedFacilityId} onValueChange={(val) => val && setSelectedFacilityId(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose hospital or CHC" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map(f => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name} ({f.district})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Triage Urgency</Label>
              <Select value={urgency} onValueChange={(val) => setUrgency(val as Urgency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Urgency.EMERGENCY}>Emergency</SelectItem>
                  <SelectItem value={Urgency.HIGH}>High Urgency</SelectItem>
                  <SelectItem value={Urgency.MODERATE}>Moderate</SelectItem>
                  <SelectItem value={Urgency.LOW}>Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Clinical Transfer Reason</Label>
              <Textarea 
                placeholder="E.g. Acute chest pain, SpO2 88%, requiring immediate ICU admission and cardiology consult."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReferral}>
              Confirm Referral
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clinical Referral Slip Modal */}
      {selectedReferralForSlip && (
        <ClinicalReferralSlipModal
          isOpen={!!selectedReferralForSlip}
          onClose={() => setSelectedReferralForSlip(null)}
          referral={selectedReferralForSlip}
          patient={activeSlipPatient}
          facility={activeSlipFacility}
        />
      )}
    </div>
  );
}
