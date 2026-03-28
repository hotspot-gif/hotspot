'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getTopRetailers } from '@/lib/data'
import { BRANCHES, NORTH_BRANCHES, SOUTH_BRANCHES, Branch, CHART_COLORS } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { MapPin, TrendingUp, Award, Users, ArrowRight, Building2 } from 'lucide-react'
import clsx from 'clsx'

export default function DashboardPage() {
  const { user } = useAuth()
  const [selectedBranch, setSelectedBranch] = useState<Branch | 'ALL'>('ALL')
  const [topRetailers, setTopRetailers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Determine accessible branches
  const accessibleBranches: Branch[] = user?.role === 'HS-ADMIN'
    ? BRANCHES
    : user?.branches || []

  useEffect(() => {
    const stored = localStorage.getItem('hs_selected_branch') as Branch | 'ALL' | null
    if (stored && (stored === 'ALL' || accessibleBranches.includes(stored as Branch))) {
      setSelectedBranch(stored as Branch | 'ALL')
    }
  }, [])

  useEffect(() => {
    const branches = selectedBranch === 'ALL' ? accessibleBranches : [selectedBranch]
    setLoading(true)
    getTopRetailers(branches, 8)
      .then(setTopRetailers)
      .catch(() => setTopRetailers([]))
      .finally(() => setLoading(false))
  }, [selectedBranch])

  const handleBranchSelect = (b: Branch | 'ALL') => {
    setSelectedBranch(b)
    localStorage.setItem('hs_selected_branch', b)
  }

  const colors = [CHART_COLORS.blue, CHART_COLORS.green, CHART_COLORS.cyan, CHART_COLORS.yellow, CHART_COLORS.peach, '#46286e', '#f04438', '#ff8c42']

  const getRegionLabel = () => {
    if (user?.role === 'HS-ADMIN') return 'All Italy'
    if (user?.branches?.every(b => NORTH_BRANCHES.includes(b))) return 'North Region'
    if (user?.branches?.every(b => SOUTH_BRANCHES.includes(b))) return 'South Region'
    return user?.branches?.join(', ') || ''
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#21264e]">
            Welcome back, <span style={{ color: '#006ae0' }}>{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-[#21264e]/50 text-sm mt-0.5 flex items-center gap-1">
            <MapPin size={13} />
            {getRegionLabel()} · {new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <a href="/dashboard/reports" className="btn-primary flex items-center gap-2 self-start">
          <BarChart3Icon /> View Reports
        </a>
      </div>

      {/* Branch selector (RSM & Admin) */}
      {(user?.role === 'HS-ADMIN' || user?.role === 'RSM') && (
        <div className="card">
          <p className="text-sm font-semibold text-[#21264e]/60 mb-3 flex items-center gap-2">
            <Building2 size={14} /> Select Branch View
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleBranchSelect('ALL')}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150',
                selectedBranch === 'ALL'
                  ? 'bg-[#21264e] text-white border-[#21264e]'
                  : 'bg-white text-[#21264e]/60 border-gray-200 hover:border-[#21264e]/40'
              )}
            >
              All Branches
            </button>
            {accessibleBranches.map(b => (
              <button
                key={b}
                onClick={() => handleBranchSelect(b)}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150',
                  selectedBranch === b
                    ? 'bg-[#21264e] text-white border-[#21264e]'
                    : 'bg-white text-[#21264e]/60 border-gray-200 hover:border-[#21264e]/40'
                )}
              >
                {b.replace('LMIT-HS-', '')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Retailers', value: topRetailers.length + '+', icon: <Users size={18} />, color: '#006ae0' },
          { label: 'Active Branch(es)', value: selectedBranch === 'ALL' ? accessibleBranches.length : 1, icon: <Building2 size={18} />, color: '#08dc7d' },
          { label: 'Top GA (2024)', value: topRetailers[0]?.ga?.toLocaleString('it-IT') || '—', icon: <TrendingUp size={18} />, color: '#46286e' },
          { label: 'Top Incentive', value: topRetailers[0] ? `€${topRetailers[0].incentive?.toLocaleString('it-IT', { maximumFractionDigits: 0 })}` : '—', icon: <Award size={18} />, color: '#ffd54f' },
        ].map((kpi, i) => (
          <div key={i} className="kpi-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: kpi.color + '18', color: kpi.color }}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-xs text-[#21264e]/50 font-medium">{kpi.label}</p>
              <p className="text-xl font-bold text-[#21264e]">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top performers */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title flex items-center gap-2"><Award size={16} style={{ color: '#ffd54f' }} /> Top Retailers by GA (2024)</h3>
              <p className="section-subtitle">Best performing retailers in selected area</p>
            </div>
          </div>
          {loading ? (
            <div className="h-56 flex items-center justify-center"><div className="spinner" /></div>
          ) : topRetailers.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-[#21264e]/30 text-sm">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topRetailers} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#21264e99' }} tickLine={false}
                  tickFormatter={v => v.length > 10 ? v.slice(0, 10) + '…' : v} />
                <YAxis tick={{ fontSize: 10, fill: '#21264e99' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#21264e', border: 'none', borderRadius: 12, color: '#fff', fontSize: 12 }}
                  labelStyle={{ color: '#fff', fontWeight: 700 }}
                />
                <Bar dataKey="ga" name="GA Activations" radius={[6, 6, 0, 0]}>
                  {topRetailers.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Leaderboard table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title flex items-center gap-2"><TrendingUp size={16} style={{ color: '#006ae0' }} /> Performance Leaderboard</h3>
              <p className="section-subtitle">Ranked by total GA activations</p>
            </div>
            <a href="/dashboard/reports" className="text-xs font-semibold text-[#006ae0] hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </a>
          </div>
          {loading ? (
            <div className="h-56 flex items-center justify-center"><div className="spinner" /></div>
          ) : topRetailers.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-[#21264e]/30 text-sm">No data available</div>
          ) : (
            <div className="space-y-2">
              {topRetailers.slice(0, 6).map((r, i) => (
                <div key={r.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#fff7f2] transition-all">
                  <div className={clsx(
                    'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0',
                    i === 0 ? 'bg-[#ffd54f] text-[#21264e]' : i === 1 ? 'bg-gray-200 text-[#21264e]' : i === 2 ? 'bg-[#ffc8b2] text-[#21264e]' : 'bg-gray-100 text-[#21264e]/50'
                  )}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#21264e] truncate">{r.name}</p>
                    <p className="text-xs text-[#21264e]/40">{r.branch?.replace('LMIT-HS-', '')} · {r.zone}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[#21264e]">{r.ga?.toLocaleString('it-IT')}</p>
                    <p className="text-xs text-[#21264e]/40">GA acts</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick nav to reports */}
      <div className="card flex items-center justify-between bg-gradient-to-r from-[#21264e] to-[#2e3a7a] text-white">
        <div>
          <h3 className="font-bold text-lg">Analyse a Retailer</h3>
          <p className="text-white/60 text-sm mt-0.5">Select a retailer and generate a full performance report with charts and PDF export</p>
        </div>
        <a href="/dashboard/reports"
          className="shrink-0 flex items-center gap-2 bg-white text-[#21264e] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#fff7f2] transition-all text-sm">
          Open Reports <ArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}

function BarChart3Icon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  )
}
