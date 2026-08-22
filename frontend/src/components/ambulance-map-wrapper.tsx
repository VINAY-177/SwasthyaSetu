"use client";

import dynamic from "next/dynamic";

const AmbulanceMap = dynamic(
  () => import("@/components/ambulance-map"),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full rounded-md bg-muted animate-pulse" />
  }
);

export default AmbulanceMap;
