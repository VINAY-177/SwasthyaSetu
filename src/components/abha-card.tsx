import { Patient } from "@/lib/types";

interface AbhaCardProps {
  patient: Patient;
}

export default function AbhaCard({ patient }: AbhaCardProps) {
  // Generate a mock ABHA number
  const hash = patient.id.split("-").pop() || "8329";
  const abhaNumber = `14-${hash.substring(0, 4)}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;

  return (
    <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg leading-tight">Ayushman Bharat</h3>
          <p className="text-emerald-100 text-sm">Health Account</p>
        </div>
        <div className="text-right">
          <div className="font-black text-2xl tracking-tighter">ABHA</div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex justify-between items-start">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-emerald-700 uppercase font-semibold">Name</p>
            <p className="font-bold text-gray-900 text-lg">{patient.name}</p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-emerald-700 uppercase font-semibold">Age/Gender</p>
              <p className="font-medium text-gray-900">{patient.age} / {patient.gender}</p>
            </div>
            <div>
              <p className="text-xs text-emerald-700 uppercase font-semibold">Blood Group</p>
              <p className="font-medium text-gray-900">{patient.bloodGroup || "N/A"}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-emerald-700 uppercase font-semibold">Location</p>
            <p className="font-medium text-gray-900">{patient.village}, {patient.district}</p>
          </div>
          <div className="pt-2">
            <p className="text-xs text-emerald-700 uppercase font-semibold">ABHA Number</p>
            <p className="font-mono font-bold text-emerald-800 text-xl tracking-widest">{abhaNumber}</p>
          </div>
        </div>

        {/* QR Placeholder */}
        <div className="w-24 h-24 bg-white p-1 rounded-md shadow-sm border border-emerald-200 shrink-0 flex items-center justify-center">
          <div className="w-full h-full bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:6px_6px] bg-emerald-50 rounded-sm flex items-center justify-center relative">
             <div className="absolute inset-2 border-2 border-emerald-600 rounded-sm"></div>
             <div className="absolute inset-4 bg-white flex items-center justify-center font-bold text-emerald-600 text-xs">QR</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-emerald-800 p-2 text-center">
        <p className="text-emerald-100 text-xs font-medium">Government of India | National Health Authority</p>
      </div>
    </div>
  );
}
