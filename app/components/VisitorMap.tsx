'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface VisitRecord {
  ip: string;
  country: string;
  time: string;
}

// Static country-to-coordinates mapping (ISO country codes to [lat, lng])
const countryCoordinates: Record<string, [number, number]> = {
  US: [39.8283, -98.5795], // United States (center)
  GB: [54.7024, -3.2766], // United Kingdom
  CA: [56.1304, -106.3468], // Canada
  AU: [25.2744, 133.7751], // Australia
  DE: [51.1657, 10.4515], // Germany
  FR: [46.2276, 2.2137], // France
  IT: [41.8719, 12.5674], // Italy
  ES: [40.4637, -3.7492], // Spain
  NL: [52.1326, 5.2913], // Netherlands
  BE: [50.5039, 4.4699], // Belgium
  CH: [46.8182, 8.2275], // Switzerland
  AT: [47.5162, 14.5501], // Austria
  SE: [60.1282, 18.6435], // Sweden
  NO: [60.4720, 8.4689], // Norway
  DK: [56.2639, 9.5018], // Denmark
  FI: [61.9241, 25.7482], // Finland
  PL: [51.9194, 19.1451], // Poland
  JP: [36.2048, 138.2529], // Japan
  CN: [35.8617, 104.1954], // China
  IN: [20.5937, 78.9629], // India
  BR: [14.2350, -51.9253], // Brazil
  MX: [23.6345, -102.5528], // Mexico
  AR: [38.4161, -63.6167], // Argentina
  ZA: [30.5595, 22.9375], // South Africa
  EG: [26.0975, 30.0444], // Egypt
  NG: [9.0820, 8.6753], // Nigeria
  KE: [0.0236, 37.9062], // Kenya
  SG: [1.3521, 103.8198], // Singapore
  MY: [4.2105, 101.9758], // Malaysia
  TH: [15.8700, 100.9925], // Thailand
  ID: [0.7893, 113.9213], // Indonesia
  PH: [12.8797, 121.7740], // Philippines
  VN: [14.0583, 108.2772], // Vietnam
  KR: [35.9078, 127.7669], // South Korea
  NZ: [-40.9006, 174.8860], // New Zealand
  IE: [53.4129, -8.2439], // Ireland
  PT: [39.3999, -8.2245], // Portugal
  GR: [39.0742, 21.8243], // Greece
  TR: [38.9637, 35.2433], // Turkey
  RU: [61.5240, 105.3188], // Russia
  SA: [23.8859, 45.0792], // Saudi Arabia
  AE: [23.4241, 53.8478], // UAE
  IL: [31.0461, 34.8516], // Israel
  Local: [0, 0], // Local (will be skipped)
};

interface VisitorMapProps {
  records: VisitRecord[];
}

export default function VisitorMap({ records }: VisitorMapProps) {
  useEffect(() => {
    // Fix for default marker icons in Next.js (client-side only)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }, []);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatIp = (ip: string) => {
    return ip === '::1' || ip === '127.0.0.1' ? 'localhost' : ip;
  };

  // Filter records with valid coordinates
  const markers = records
    .filter((record) => {
      const coords = countryCoordinates[record.country];
      return coords && record.country !== 'Local' && record.country !== 'Unknown';
    })
    .map((record) => ({
      record,
      coords: countryCoordinates[record.country]!,
    }));

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-700">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map(({ record, coords }, index) => (
          <Marker key={`${record.ip}-${record.time}-${index}`} position={coords}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">IP: {formatIp(record.ip)}</p>
                <p>Country: {record.country}</p>
                <p>Time: {formatTime(record.time)}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

