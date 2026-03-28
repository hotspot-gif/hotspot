'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getRetailersByBranchAndZone, getZonesByBranch, getRetailerPerformance, getRetailerInfo } from '@/lib/data'
import { BRANCHES, NORTH_BRANCHES, SOUTH_BRANCHES, Branch, RetailerPerformance } from '@/types'
import RetailerReport from '@/components/RetailerReport'
import { Search, Filter, FileText } from 'lucide-react'
import clsx from 'clsx'

export default function ReportsPage() {
  const { user } = useAuth()
  const [selectedBranch, setSelectedBranch] = useState<Branch | ''>('')
  const [selectedZone, setSelectedZone] = useState('')
  const [selectedRetailer, setSelectedRetailer] = useState('')
  const [zones, setZones] = useState<string[]>([])
  const [retailers, setRetailers] = useState<any[]>([])
  const [retailerInfo, setRetailerInfo] = useState<any>(null)
  const [performance, setPerformance] = useState<RetailerPerformance[]>([])
  const [loadingRetailers, setLoadingRetailers] = useState(false)
  const [loadingReport, setLoadingReport] = useState(false)
  const [search, setSearch] = useState('')

  const accessibleBranches: Branch[] = user?.role === 'HS-ADMIN'
    ? BRANCHES
    : user?.branches || []

  // Auto-select for ASM (single branch)
  useEffect(() => {
    if (user?.role === 'ASM' && accessibleBranches.length === 1) {
      setSelectedBranch(accessibleBranches[0])
    }
  }, [user])

  // Load zones when branch changes
  useEffect(() => {
    if (!selectedBranch) return
    getZonesByBranch([selectedBranch]).then(setZones).catch(() => setZones([]))
  }, [selectedBranch])

  // Load retailers when branch/zone changes
  useEffect(() => {
    if (!selectedBranch) return
    setLoadingRetailers(true)
    setSelectedRetailer('')
    setRetailerInfo(null)
    setPerformance([])
    getRetailersByBranchAndZone([selectedBranch], selectedZone || undefined)
      .then(setRetailers)
      .catch(() => setRetailers([]))
      .finally(() => setLoadingRetailers(false))
  }, [selectedBranch, selectedZone])

  // Load report when retailer selected
  const loadReport = async (retailerId: string) => {
    setSelectedRetailer(retailerId)
    setLoadingReport(true)
    try {
      const [info, perf] = await Promise.all([
        getRetailerInfo(retailerId),
        getRetailerPerformance(retailerId),
      ])
      setRetailerInfo(info)
      setPerformance(perf)
    } catch {
      setRetailerInfo(null)
      setPerformance([])
    } finally {
      setLoadingReport(false)
    }
  }

  const filteredRetailers = retailers.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.retailer_id?.toLowerCase().includes(search.toLowerCase())
  )

  const getRegionInfo = (branch: Branch) => {
    if (NORTH_BRANCHES.includes(branch)) return 'North Region'
    if (SOUTH_BRANCHES.includes(branch)) return 'South Region'
    return ''
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#21264e] flex items-center gap-2">
          <FileText size={22} style={{ color: '#006ae0' }} /> Retailer Reports
        </h1>
        <p className="text-[#21264e]/50 text-sm mt-0.5">Select a retailer to view full performance analysis</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={15} className="text-[#21264e]/50" />
          <h3 className="font-semibold text-[#21264e] text-sm">Filters</h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Branch */}
          {user?.role !== 'ASM' && (
            <div>
              <label className="label">Branch</label>
              <div className="relative">
                <select
                  className="select-field pr-8"
                  value={selectedBranch}
                  onChange={e => { setSelectedBranch(e.target.value as Branch); setSelectedZone('') }}
                >
                  <option value="">Select branch...</option>
                  {accessibleBranches.map(b => (
                    <option key={b} value={b}>{b.replace('LMIT-HS-', '')} ({getRegionInfo(b)})</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▾</span>
              </div>
            </div>
          )}

          {/* Zone */}
          <div>
            <label className="label">Zone {!selectedBranch && <span className="text-gray-300">(select branch first)</span>}</label>
            <div className="relative">
              <select
                className="select-field pr-8"
                value={selectedZone}
                onChange={e => setSelectedZone(e.target.value)}
                disabled={!selectedBranch}
              >
                <option value="">All zones</option>
                {zones.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▾</span>
            </div>
          </div>

          {/* Search */}
          <div className={user?.role === 'ASM' ? 'sm:col-span-2' : ''}>
            <label className="label">Search Retailer</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="input-field pl-9"
                placeholder="Name or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                disabled={!selectedBranch}
              />
            </div>
          </div>
        </div>

        {/* Retailer list */}
        {selectedBranch && (
          <div className="mt-4">
            <label className="label">
              Select Retailer
              {filteredRetailers.length > 0 && <span className="text-[#006ae0] ml-1">({filteredRetailers.length} found)</span>}
            </label>
            {loadingRetailers ? (
              <div className="flex items-center gap-2 py-4 text-sm text-[#21264e]/50">
                <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Loading retailers...
              </div>
            ) : filteredRetailers.length === 0 ? (
              <p className="text-sm text-[#21264e]/30 py-4">No retailers found</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-h-52 overflow-y-auto">
                {filteredRetailers.map(r => (
                  <button
                    key={r.id}
                    onClick={() => loadReport(r.id)}
                    className={clsx(
                      'text-left px-3 py-2.5 rounded-xl border text-sm transition-all duration-150',
                      selectedRetailer === r.id
                        ? 'bg-[#21264e] text-white border-[#21264e]'
                        : 'bg-white text-[#21264e] border-gray-200 hover:border-[#006ae0]/40 hover:bg-[#fff7f2]'
                    )}
                  >
                    <p className="font-semibold truncate">{r.name}</p>
                    <p className={clsx('text-xs', selectedRetailer === r.id ? 'text-white/60' : 'text-[#21264e]/40')}>
                      {r.retailer_id} · {r.zone}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Report */}
      {loadingReport && (
        <div className="card flex items-center justify-center h-40">
          <div className="text-center">
            <div className="spinner mx-auto mb-3" />
            <p className="text-[#21264e]/50 text-sm">Loading retailer report...</p>
          </div>
        </div>
      )}

      {!loadingReport && retailerInfo && performance.length > 0 && (
        <RetailerReport retailer={retailerInfo} performance={performance} />
      )}

      {!loadingReport && selectedRetailer && performance.length === 0 && !loadingReport && retailerInfo && (
        <div className="card text-center py-12">
          <p className="text-[#21264e]/40 text-lg">No performance data available for this retailer.</p>
        </div>
      )}

      {!selectedBranch && (
        <div className="card text-center py-16 border-dashed border-2 border-gray-200 bg-transparent shadow-none">
          <FileText size={40} className="mx-auto mb-3 text-[#21264e]/20" />
          <h3 className="text-[#21264e]/40 font-semibold">Select a branch to get started</h3>
          <p className="text-[#21264e]/25 text-sm mt-1">Then choose a zone and retailer to view their full report</p>
        </div>
      )}
    </div>
  )
}
