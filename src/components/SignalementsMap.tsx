import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// Use SVG data-URL pins (avoids Leaflet's broken default-icon paths in Vite).
function pinIcon(color: string) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42">
  <path d="M15 0C6.7 0 0 6.7 0 15c0 11.2 15 27 15 27s15-15.8 15-27C30 6.7 23.3 0 15 0z" fill="${color}"/>
  <circle cx="15" cy="15" r="6" fill="white"/>
</svg>`;
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -36],
  });
}

const COLORS: Record<string, string> = {
  EN_ATTENTE: "#f59e0b",
  EN_COURS: "#3b82f6",
  RESOLU: "#10b981",
};

const LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  EN_COURS: "En cours",
  RESOLU: "Résolu",
};

export interface MapSignalement {
  id: number;
  lat: number;
  lng: number;
  quartier: string;
  ville: string;
  categorie: string;
  description: string;
  statut: string;
  photo: string;
  date: string;
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 14);
    } else {
      map.fitBounds(points as any, { padding: [40, 40] });
    }
  }, [points, map]);
  return null;
}

export function SignalementsMap({
  items,
  onSelect,
  height = 540,
}: {
  items: MapSignalement[];
  onSelect?: (s: MapSignalement) => void;
  height?: number;
}) {
  const points = items.map((s) => [s.lat, s.lng] as [number, number]);

  return (
    <div className="rounded-xl overflow-hidden border border-border relative" style={{ height }}>
      <MapContainer
        center={[3.8480, 11.5021]}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {items.map((s) => (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={pinIcon(COLORS[s.statut] ?? "#6b7280")}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-primary">
                    {s.categorie}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: COLORS[s.statut] }}
                  >
                    {LABELS[s.statut]}
                  </span>
                </div>
                <p className="text-sm font-medium mb-1.5">{s.description}</p>
                <p className="text-xs text-gray-500 mb-2">
                  {s.quartier}, {s.ville} · {s.date}
                </p>
                <img src={s.photo} alt="" className="w-full h-24 object-cover rounded mb-2" />
                {onSelect && (
                  <button
                    onClick={() => onSelect(s)}
                    className="w-full text-xs font-semibold text-primary hover:underline"
                  >
                    Voir le détail →
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Légende */}
      <div className="absolute bottom-3 left-3 z-[400] rounded-lg bg-white/95 backdrop-blur shadow-md border border-border px-3 py-2 text-xs">
        <div className="font-semibold mb-1.5">Légende</div>
        {Object.entries(LABELS).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2 py-0.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[k] }} />
            <span>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
