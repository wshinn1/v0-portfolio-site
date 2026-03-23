"use client"

import { useState, useEffect } from 'react'
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { 
  Globe, 
  MapPin, 
  Eye, 
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  Monitor,
  Smartphone,
  FileText
} from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import the map component to avoid SSR issues
const VisitorMap = dynamic(() => import('@/components/admin/visitor-map').then(mod => mod.VisitorMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-slate-50 rounded-xl animate-pulse flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
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
  recentVisitors?: { country: string; city: string; page: string; time: string; browser?: string }[]
}

// Country flags mapping
const countryFlags: Record<string, string> = {
  'United States': '🇺🇸',
  'Russia': '🇷🇺',
  'China': '🇨🇳',
  'Australia': '🇦🇺',
  'United Kingdom': '🇬🇧',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Canada': '🇨🇦',
  'Japan': '🇯🇵',
  'India': '🇮🇳',
  'Brazil': '🇧🇷',
  'Mexico': '🇲🇽',
  'South Korea': '🇰🇷',
  'Italy': '🇮🇹',
  'Spain': '🇪🇸',
  'Netherlands': '🇳🇱',
  'Sweden': '🇸🇪',
  'Singapore': '🇸🇬',
  'Unknown': '🌍'
}

// Mini sparkline component
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((value, index) => ({ value, index }))
  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={1.5}
            fill={`url(#gradient-${color})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

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
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  // Generate sparkline data from daily views
  const sparklineData = data?.daily?.slice(-7).map(d => d.views) || [0, 0, 0, 0, 0, 0, 0]

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Dashboard</p>
          <h1 className="text-xl font-bold text-slate-800">Campaign Monitoring</h1>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-slate-400">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchAnalytics(false)}
            disabled={refreshing}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Top Stats Row - Small Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Page Views */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Page Views</p>
              <p className="text-xl font-bold text-blue-600">{(data?.totalViews || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600">+6.82%</span>
          </div>
        </div>

        {/* New Sessions */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Users className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">New Sessions</p>
              <p className="text-xl font-bold text-amber-600">{data?.recentVisitors?.length || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600">+2%</span>
          </div>
        </div>

        {/* Countries */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Globe className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Countries</p>
              <p className="text-xl font-bold text-indigo-600">{data?.countries?.length || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600">Unique</span>
          </div>
        </div>

        {/* Cities */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <MapPin className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Cities</p>
              <p className="text-xl font-bold text-emerald-600">{data?.cities?.length || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600">Tracked</span>
          </div>
        </div>
      </div>

      {/* Users By Country - Map + Table */}
      <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">Users By Country</h2>
          <button className="p-1.5 rounded-lg hover:bg-slate-100">
            <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="4" cy="10" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="16" cy="10" r="1.5" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <VisitorMap countries={data?.countries || []} />
          </div>
          
          {/* Top Countries Table */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-700">Top Countries</h3>
              <span className="text-xs text-slate-400">Users</span>
            </div>
            <div className="space-y-2">
              {data?.countries && data.countries.length > 0 ? (
                data.countries.slice(0, 5).map((country, index) => (
                  <div key={country.name} className="flex items-center justify-between py-2 px-2 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{countryFlags[country.name] || '🌍'}</span>
                      <span className="text-sm text-slate-700">{country.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{country.views.toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-400 text-sm">
                  No country data yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Audience Metrics */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-800">Audience Metrics</h2>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">This Month</span>
          </div>
          
          <div className="space-y-4">
            {/* Users */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800">{(data?.totalViews || 0).toLocaleString()}</p>
                <p className="text-xs text-slate-500">Page Views</p>
              </div>
              <MiniSparkline data={sparklineData} color="#3b82f6" />
            </div>
            
            {/* Countries */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800">{data?.countries?.length || 0}</p>
                <p className="text-xs text-slate-500">Countries</p>
              </div>
              <MiniSparkline data={[1, 2, 2, 3, 3, 4, data?.countries?.length || 0]} color="#8b5cf6" />
            </div>
            
            {/* Cities */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800">{data?.cities?.length || 0}</p>
                <p className="text-xs text-slate-500">Cities</p>
              </div>
              <MiniSparkline data={[0, 1, 1, 2, 2, 3, data?.cities?.length || 0]} color="#10b981" />
            </div>
          </div>
        </div>

        {/* Traffic Sources (Pages) */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-800">Top Pages</h2>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">This Month</span>
          </div>
          
          <div className="space-y-3">
            {data?.pages && data.pages.length > 0 ? (
              data.pages.slice(0, 4).map((page, index) => {
                const percentage = Math.round((page.views / (data.totalViews || 1)) * 100)
                const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500']
                return (
                  <div key={page.path}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700 truncate max-w-[120px]">{page.path}</span>
                      <span className="text-sm font-semibold text-slate-800">{page.views.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[index % colors.length]}`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-4 text-slate-400 text-sm">
                No page data yet
              </div>
            )}
          </div>
        </div>

        {/* Device Sessions */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-800">Recent Visitors</h2>
            {data?.recentVisitors && data.recentVisitors.length > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-600">Live</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {data?.recentVisitors && data.recentVisitors.length > 0 ? (
              data.recentVisitors.slice(0, 5).map((visitor, index) => (
                <div key={index} className="flex items-center gap-3 py-2 px-2 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {(visitor.city || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{visitor.city || 'Unknown'}</p>
                    <p className="text-xs text-slate-500">{visitor.country}</p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(visitor.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No visitors yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Traffic Overview</h2>
            <p className="text-xs text-slate-500">Daily page views</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-slate-800">{(data?.totalViews || 0).toLocaleString()}</p>
            <p className="text-xs text-slate-500">Total views</p>
          </div>
        </div>
        
        <div className="h-[200px]">
          {data?.daily && data.daily.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.daily}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <FileText className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">No traffic data yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
