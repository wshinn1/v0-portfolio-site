"use client"

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts'
import { 
  Globe, 
  MapPin, 
  Eye, 
  FileText, 
  Loader2,
  Calendar,
  AlertCircle,
  ExternalLink,
  Map,
  RefreshCw
} from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import the map component to avoid SSR issues
const VisitorMap = dynamic(() => import('@/components/admin/visitor-map').then(mod => mod.VisitorMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-zinc-100 rounded-xl animate-pulse flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
    </div>
  )
})

interface AnalyticsData {
  totalViews: number
  uniqueCountries: number
  uniqueCities: number
  countries: { name: string; views: number }[]
  cities: { name: string; views: number; country: string }[]
  pages: { path: string; views: number }[]
  daily: { date: string; views: number }[]
  recentVisitors?: { country: string; city: string; page: string; time: string }[]
}

const COLORS = ['#ff6b4a', '#4ade80', '#60a5fa', '#f472b6', '#a78bfa', '#fbbf24', '#34d399', '#f87171', '#818cf8', '#fb923c']

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [days, setDays] = useState(30)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  // Auto-refresh every 15 seconds for real-time updates
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      fetchAnalytics(false)
    }, 15000)
    return () => clearInterval(interval)
  }, [autoRefresh, days])

  const fetchAnalytics = async (showLoader = true) => {
    if (showLoader) setLoading(true)
    else setRefreshing(true)
    setError(null)
    try {
      // Use PostHog API for real-time analytics with city data
      const response = await fetch(`/api/analytics/posthog?days=${days}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const result = await response.json()
      setData(result)
      setLastUpdated(new Date())
    } catch (err) {
      setError('Failed to load analytics data')
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  const hasData = data && data.totalViews > 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Analytics</h1>
          <p className="text-zinc-500 mt-1">Track visitors to your portfolio</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {lastUpdated && (
            <span className="text-xs text-zinc-400">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchAnalytics(false)}
            disabled={refreshing}
            className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 text-zinc-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <label className="flex items-center gap-2 text-sm text-zinc-600">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-zinc-300"
            />
            Auto-refresh
          </label>
          <Calendar className="w-5 h-5 text-zinc-400" />
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {!hasData ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-zinc-400" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">No Analytics Data Yet</h2>
          <p className="text-zinc-500 max-w-md mx-auto mb-6">
            Analytics data will appear here once visitors start viewing your site. PostHog tracks page views in real-time with city-level geo data.
          </p>
          <div className="bg-zinc-50 rounded-lg p-4 max-w-lg mx-auto text-left">
            <h3 className="font-medium text-zinc-900 mb-2">Powered by PostHog</h3>
            <p className="text-sm text-zinc-600 mb-3">
              Your site is configured with PostHog analytics. Visit your site to start tracking page views.
            </p>
            <a 
              href="https://us.posthog.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              Open PostHog Dashboard
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Eye className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm text-zinc-500">Total Views</span>
              </div>
              <p className="text-3xl font-bold text-zinc-900">{data?.totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-zinc-500">Countries</span>
              </div>
              <p className="text-3xl font-bold text-zinc-900">{data?.countries.length || 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm text-zinc-500">Cities</span>
              </div>
              <p className="text-3xl font-bold text-zinc-900">{data?.cities.length || 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm text-zinc-500">Top Pages</span>
              </div>
              <p className="text-3xl font-bold text-zinc-900">{data?.pages.length || 0}</p>
            </div>
          </div>

          {/* Real-time Visitors */}
          {data?.recentVisitors && data.recentVisitors.length > 0 && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Recent Visitors (Live)
              </h2>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {data.recentVisitors.map((visitor, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-900 font-medium">{visitor.city}</span>
                          <span className="text-zinc-400">{visitor.country}</span>
                        </div>
                        <span className="text-xs text-zinc-500 font-mono">{visitor.page}</span>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-400">
                      {new Date(visitor.time).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visitor Map */}
          {data?.countries && data.countries.length > 0 && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-zinc-400" />
                Visitor Locations
              </h2>
              <VisitorMap countries={data.countries} />
              <p className="text-xs text-zinc-400 mt-3 text-center">
                Bubble size represents relative visitor count. Hover over bubbles to see details.
              </p>
            </div>
          )}

          {/* Views Over Time */}
          {data?.daily && data.daily.length > 0 && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">Views Over Time</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#ff6b4a" 
                      strokeWidth={2}
                      dot={{ fill: '#ff6b4a', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Countries and Cities Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Countries Chart */}
            {data?.countries && data.countries.length > 0 && (
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-zinc-400" />
                  Top Countries
                </h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.countries} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="views" fill="#ff6b4a" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Cities Chart */}
            {data?.cities && data.cities.length > 0 && (
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-zinc-400" />
                  Top Cities
                </h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.cities} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={120} 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value, index) => {
                          const city = data.cities[index]
                          return city ? `${value}, ${city.country}` : value
                        }}
                      />
                      <Tooltip 
                        formatter={(value, name, props) => [value, 'Views']}
                        labelFormatter={(label, payload) => {
                          const item = payload?.[0]?.payload
                          return item ? `${item.name}, ${item.country}` : label
                        }}
                      />
                      <Bar dataKey="views" fill="#4ade80" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Countries and Cities Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Countries List */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-zinc-400" />
                All Countries
              </h2>
              {data?.countries && data.countries.length > 0 ? (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {data.countries.map((country, index) => (
                    <div key={country.name} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs font-medium text-orange-600">
                          {index + 1}
                        </span>
                        <span className="text-zinc-900 font-medium">{country.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${(country.views / data.countries[0].views) * 100}%` }}
                          />
                        </div>
                        <span className="text-zinc-500 text-sm font-medium w-12 text-right">{country.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-400">
                  <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Location data not yet available</p>
                  <p className="text-xs mt-1">Vercel Analytics may take time to provide geo data</p>
                </div>
              )}
            </div>

            {/* Cities List */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-zinc-400" />
                All Cities
              </h2>
              {data?.cities && data.cities.length > 0 ? (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {data.cities.map((city, index) => (
                    <div key={`${city.name}-${city.country}`} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-600">
                          {index + 1}
                        </span>
                        <div>
                          <span className="text-zinc-900 font-medium">{city.name}</span>
                          <span className="text-zinc-400 text-sm ml-2">{city.country}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(city.views / data.cities[0].views) * 100}%` }}
                          />
                        </div>
                        <span className="text-zinc-500 text-sm font-medium w-12 text-right">{city.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-400">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">City data not yet available</p>
                  <p className="text-xs mt-1">PostHog will show city-level data once visitors arrive</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Pages */}
          {data?.pages && data.pages.length > 0 && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-zinc-400" />
                Top Pages
              </h2>
              <div className="space-y-3">
                {data.pages.map((page, index) => (
                  <div key={page.path} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-medium text-zinc-600">
                        {index + 1}
                      </span>
                      <span className="text-zinc-900 font-mono text-sm">{page.path}</span>
                    </div>
                    <span className="text-zinc-500 font-medium">{page.views.toLocaleString()} views</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
