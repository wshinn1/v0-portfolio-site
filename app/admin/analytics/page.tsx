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
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { 
  Globe, 
  MapPin, 
  Eye, 
  FileText, 
  Loader2,
  Calendar,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import the map component to avoid SSR issues
const VisitorMap = dynamic(() => import('@/components/admin/visitor-map').then(mod => mod.VisitorMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
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
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time visitor tracking for your portfolio</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {lastUpdated && (
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchAnalytics(false)}
            disabled={refreshing}
            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <label className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Live
          </label>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Total Views</span>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{(data?.totalViews || 0).toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600 font-medium">Live tracking</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Countries</span>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Globe className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{data?.countries?.length || 0}</p>
          <div className="flex items-center gap-1 mt-2">
            <Activity className="w-3 h-3 text-indigo-500" />
            <span className="text-xs text-slate-500">Unique locations</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Cities</span>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{data?.cities?.length || 0}</p>
          <div className="flex items-center gap-1 mt-2">
            <Users className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-slate-500">City-level data</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Pages</span>
            <div className="p-2 bg-amber-100 rounded-lg">
              <FileText className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{data?.pages?.length || 0}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-amber-500" />
            <span className="text-xs text-slate-500">Visited pages</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="xl:col-span-2 space-y-6">
          {/* Views Over Time */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Traffic Overview</h2>
                <p className="text-sm text-slate-500">Daily page views over time</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">{(data?.totalViews || 0).toLocaleString()}</p>
                <p className="text-xs text-slate-500">Total views</p>
              </div>
            </div>
            <div className="h-[280px]">
              {data?.daily && data.daily.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.daily}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#64748b' }} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
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
                  <Activity className="w-12 h-12 mb-3 opacity-40" />
                  <p className="text-sm">No traffic data yet</p>
                  <p className="text-xs mt-1">Data will appear as visitors arrive</p>
                </div>
              )}
            </div>
          </div>

          {/* World Map */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Visitor Locations</h2>
                <p className="text-sm text-slate-500">Real-time geographic distribution</p>
              </div>
              {data?.recentVisitors && data.recentVisitors.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">Live</span>
                </div>
              )}
            </div>
            <VisitorMap countries={data?.countries || []} />
          </div>
        </div>

        {/* Right Column - Tables */}
        <div className="space-y-6">
          {/* Recent Visitors */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent Visitors</h2>
              {data?.recentVisitors && data.recentVisitors.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-700 font-medium">Live</span>
                </div>
              )}
            </div>
            <div className="space-y-3 max-h-[280px] overflow-y-auto">
              {data?.recentVisitors && data.recentVisitors.length > 0 ? (
                data.recentVisitors.slice(0, 6).map((visitor, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{visitor.city || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{visitor.country}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(visitor.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No recent visitors</p>
                  <p className="text-xs mt-1">Visitors will appear here in real-time</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Countries Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Countries</h2>
            {data?.countries && data.countries.length > 0 ? (
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3">Country</th>
                      <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider pb-3">Views</th>
                      <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider pb-3">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.countries.slice(0, 5).map((country, index) => {
                      const percentage = ((country.views / (data.totalViews || 1)) * 100).toFixed(1)
                      return (
                        <tr key={country.name} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600">
                                {index + 1}
                              </span>
                              <span className="text-sm font-medium text-slate-900">{country.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-right text-sm text-slate-600">{country.views}</td>
                          <td className="py-3 text-right">
                            <span className="text-xs font-medium text-green-600">{percentage}%</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <Globe className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No country data yet</p>
              </div>
            )}
          </div>

          {/* Top Cities Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Top Cities</h2>
            {data?.cities && data.cities.length > 0 ? (
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3">City</th>
                      <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider pb-3">Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.cities.slice(0, 5).map((city, index) => (
                      <tr key={`${city.name}-${city.country}`} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center text-xs font-medium text-emerald-600">
                              {index + 1}
                            </span>
                            <div>
                              <span className="text-sm font-medium text-slate-900">{city.name}</span>
                              <span className="text-xs text-slate-400 ml-1">{city.country}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-right text-sm text-slate-600">{city.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No city data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Pages Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Page Performance</h2>
        {data?.pages && data.pages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 pl-3">Page</th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider pb-3">Views</th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 pr-3">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.pages.map((page, index) => {
                  const percentage = ((page.views / (data.totalViews || 1)) * 100).toFixed(1)
                  return (
                    <tr key={page.path} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 pl-3">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                            {index + 1}
                          </span>
                          <span className="text-sm font-mono text-slate-700">{page.path}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-sm font-semibold text-slate-900">{page.views.toLocaleString()}</span>
                      </td>
                      <td className="py-4 pr-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${Math.min(parseFloat(percentage), 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-500 w-10 text-right">{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No page data yet</p>
            <p className="text-xs mt-1">Page views will appear here as visitors browse your site</p>
          </div>
        )}
      </div>
    </div>
  )
}
