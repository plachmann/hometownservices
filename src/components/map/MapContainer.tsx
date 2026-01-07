"use client";

import { MapContainer as LeafletMapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapContainerProps {
  latitude: number;
  longitude: number;
  radiusMiles: number;
  companyName: string;
}

// Convert miles to meters for Leaflet
const milesToMeters = (miles: number) => miles * 1609.344;

// Fix for default marker icon in production
const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapContainer({
  latitude,
  longitude,
  radiusMiles,
  companyName,
}: MapContainerProps) {
  const radiusMeters = milesToMeters(radiusMiles);
  const center: [number, number] = [latitude, longitude];

  // Calculate zoom level based on radius
  // Rough approximation: zoom = 14 - log2(radiusMiles / 5)
  const zoom = Math.max(6, Math.min(14, Math.round(14 - Math.log2(radiusMiles / 5))));

  return (
    <LeafletMapContainer
      center={center}
      zoom={zoom}
      className="w-full h-[400px] rounded-lg z-0"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Service area circle */}
      <Circle
        center={center}
        radius={radiusMeters}
        pathOptions={{
          color: "hsl(var(--primary))",
          fillColor: "hsl(var(--primary))",
          fillOpacity: 0.15,
          weight: 2,
        }}
      />

      {/* Center marker */}
      <Marker position={center} icon={defaultIcon}>
        <Popup>
          <div className="text-center">
            <strong>{companyName}</strong>
            <br />
            <span className="text-sm text-gray-600">
              Service Area: {radiusMiles} miles
            </span>
          </div>
        </Popup>
      </Marker>
    </LeafletMapContainer>
  );
}
