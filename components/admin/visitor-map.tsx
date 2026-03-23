"use client"

import { useMemo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps'

// World map TopoJSON
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

// Country name to ISO code mapping for common countries
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

interface VisitorMapProps {
  countries: { name: string; views: number }[]
}

export function VisitorMap({ countries }: VisitorMapProps) {
  const markers = useMemo(() => {
    return countries
      .filter(c => countryToCoords[c.name])
      .map(c => ({
        name: c.name,
        views: c.views,
        coordinates: countryToCoords[c.name] as [number, number]
      }))
  }, [countries])

  const maxViews = Math.max(...countries.map(c => c.views), 1)

  return (
    <div className="w-full h-[400px] bg-zinc-50 rounded-xl overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: [0, 30]
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
                  fill="#e4e4e7"
                  stroke="#d4d4d8"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#d4d4d8', outline: 'none' },
                    pressed: { outline: 'none' }
                  }}
                />
              ))
            }
          </Geographies>
          {markers.map(({ name, coordinates, views }) => {
            const size = Math.max(6, Math.min(20, (views / maxViews) * 20 + 6))
            return (
              <Marker key={name} coordinates={coordinates}>
                <circle
                  r={size}
                  fill="#ff6b4a"
                  fillOpacity={0.7}
                  stroke="#fff"
                  strokeWidth={1.5}
                />
                <title>{`${name}: ${views} views`}</title>
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}
