"use client"

import { useMemo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps'

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

// Country name to coordinates mapping
const countryToCoords: Record<string, [number, number]> = {
  'United States': [-98.5795, 39.8283],
  'US': [-98.5795, 39.8283],
  'Canada': [-106.3468, 56.1304],
  'CA': [-106.3468, 56.1304],
  'United Kingdom': [-3.4360, 55.3781],
  'UK': [-3.4360, 55.3781],
  'Germany': [10.4515, 51.1657],
  'DE': [10.4515, 51.1657],
  'France': [2.2137, 46.2276],
  'FR': [2.2137, 46.2276],
  'India': [78.9629, 20.5937],
  'IN': [78.9629, 20.5937],
  'Australia': [133.7751, -25.2744],
  'AU': [133.7751, -25.2744],
  'Brazil': [-51.9253, -14.2350],
  'BR': [-51.9253, -14.2350],
  'Japan': [138.2529, 36.2048],
  'JP': [138.2529, 36.2048],
  'China': [104.1954, 35.8617],
  'CN': [104.1954, 35.8617],
  'Netherlands': [5.2913, 52.1326],
  'NL': [5.2913, 52.1326],
  'Spain': [-3.7492, 40.4637],
  'ES': [-3.7492, 40.4637],
  'Italy': [12.5674, 41.8719],
  'IT': [12.5674, 41.8719],
  'Mexico': [-102.5528, 23.6345],
  'MX': [-102.5528, 23.6345],
  'South Korea': [127.7669, 35.9078],
  'KR': [127.7669, 35.9078],
  'Russia': [105.3188, 61.5240],
  'RU': [105.3188, 61.5240],
  'Singapore': [103.8198, 1.3521],
  'SG': [103.8198, 1.3521],
  'Sweden': [18.6435, 60.1282],
  'SE': [18.6435, 60.1282],
  'Switzerland': [8.2275, 46.8182],
  'CH': [8.2275, 46.8182],
  'Poland': [19.1451, 51.9194],
  'PL': [19.1451, 51.9194],
  'Ireland': [-8.2439, 53.4129],
  'IE': [-8.2439, 53.4129],
  'Portugal': [-8.2245, 39.3999],
  'PT': [-8.2245, 39.3999],
  'Argentina': [-63.6167, -38.4161],
  'AR': [-63.6167, -38.4161],
  'Indonesia': [113.9213, -0.7893],
  'ID': [113.9213, -0.7893],
  'Philippines': [121.7740, 12.8797],
  'PH': [121.7740, 12.8797],
  'Vietnam': [108.2772, 14.0583],
  'VN': [108.2772, 14.0583],
  'Thailand': [100.9925, 15.8700],
  'TH': [100.9925, 15.8700],
  'Malaysia': [101.9758, 4.2105],
  'MY': [101.9758, 4.2105],
  'Turkey': [35.2433, 38.9637],
  'TR': [35.2433, 38.9637],
  'Israel': [34.8516, 31.0461],
  'IL': [34.8516, 31.0461],
  'South Africa': [22.9375, -30.5595],
  'ZA': [22.9375, -30.5595],
  'Nigeria': [8.6753, 9.0820],
  'NG': [8.6753, 9.0820],
  'Egypt': [30.8025, 26.8206],
  'EG': [30.8025, 26.8206],
  'Belgium': [4.4699, 50.5039],
  'BE': [4.4699, 50.5039],
  'Austria': [14.5501, 47.5162],
  'AT': [14.5501, 47.5162],
  'Denmark': [9.5018, 56.2639],
  'DK': [9.5018, 56.2639],
  'Finland': [25.7482, 61.9241],
  'FI': [25.7482, 61.9241],
  'Norway': [8.4689, 60.4720],
  'NO': [8.4689, 60.4720],
  'New Zealand': [174.886, -40.9006],
  'NZ': [174.886, -40.9006],
  'Czech Republic': [15.4729, 49.8175],
  'CZ': [15.4729, 49.8175],
  'Romania': [24.9668, 45.9432],
  'RO': [24.9668, 45.9432],
  'Ukraine': [31.1656, 48.3794],
  'UA': [31.1656, 48.3794],
  'Colombia': [-74.2973, 4.5709],
  'CO': [-74.2973, 4.5709],
  'Chile': [-71.5430, -35.6751],
  'CL': [-71.5430, -35.6751],
  'Peru': [-75.0152, -9.1900],
  'PE': [-75.0152, -9.1900],
}

interface City {
  name: string
  country: string
  views: number
  lat: number | null
  lng: number | null
}

interface VisitorMapProps {
  countries: { name: string; views: number }[]
  cities?: City[]
}

export function VisitorMap({ countries, cities = [] }: VisitorMapProps) {
  // Prioritize city-level markers with actual coordinates
  const markers = useMemo(() => {
    // First, use cities that have real lat/lng coordinates
    const cityMarkers = cities
      .filter(c => c.lat !== null && c.lng !== null)
      .map(c => ({
        name: `${c.name}, ${c.country}`,
        views: c.views,
        coordinates: [c.lng!, c.lat!] as [number, number]
      }))
    
    // If no city coordinates, fall back to country centers
    if (cityMarkers.length === 0) {
      return countries
        .filter(c => countryToCoords[c.name])
        .map(c => ({
          name: c.name,
          views: c.views,
          coordinates: countryToCoords[c.name] as [number, number]
        }))
    }
    
    return cityMarkers
  }, [countries, cities])

  const maxViews = Math.max(...markers.map(m => m.views), 1)
  const hasData = markers.length > 0 || countries.length > 0

  return (
    <div className="w-full h-[350px] bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl overflow-hidden relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 130,
          center: [0, 25]
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#cbd5e1"
                  stroke="#94a3b8"
                  strokeWidth={0.3}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#94a3b8', outline: 'none' },
                    pressed: { outline: 'none' }
                  }}
                />
              ))
            }
          </Geographies>
          {markers.map(({ name, coordinates, views }) => {
            const size = Math.max(8, Math.min(24, (views / maxViews) * 24 + 8))
            return (
              <Marker key={name} coordinates={coordinates}>
                {/* Pulse ring */}
                <circle
                  r={size + 4}
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  className="animate-ping"
                  style={{ animationDuration: '2s' }}
                />
                {/* Main marker */}
                <circle
                  r={size}
                  fill="#3b82f6"
                  fillOpacity={0.8}
                  stroke="#fff"
                  strokeWidth={2}
                />
                {/* Center dot */}
                <circle
                  r={3}
                  fill="#fff"
                />
                <title>{`${name}: ${views} views`}</title>
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Empty state overlay */}
      {!hasData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-600">Waiting for visitors</p>
            <p className="text-xs text-slate-400 mt-1">Locations will appear on the map in real-time</p>
          </div>
        </div>
      )}
      
      {/* Legend */}
      {hasData && (
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-slate-600 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Visitor locations</span>
          </div>
        </div>
      )}
    </div>
  )
}
