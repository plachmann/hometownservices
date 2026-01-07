"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface ServiceAreaMapProps {
  latitude: number;
  longitude: number;
  radiusMiles: number;
  companyName: string;
}

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(
  () => import("./MapContainer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    ),
  }
);

export default function ServiceAreaMap({
  latitude,
  longitude,
  radiusMiles,
  companyName,
}: ServiceAreaMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer
      latitude={latitude}
      longitude={longitude}
      radiusMiles={radiusMiles}
      companyName={companyName}
    />
  );
}
