'use client'
import { RetailerPerformance } from '@/types'
import { Zap, Award, TrendingUp, TrendingDown, RefreshCw, BarChart2 } from 'lucide-react'

interface Props { performance: RetailerPerformance[] }

export default function AllTimeKpi({ performance }: Props) {
  const total = (key: keyof RetailerPerformance) =>
    performance.reduce((s, p) => s + (Number(p[key]) || 0), 0)

  const avg = (key: keyof RetailerPerformance) =>
    performance.length ? total(key) / performance.length : 0

  const totalDeductions = total('deductions_clawback') + total('deductions_po') + total('deductions_renewal')

  const kpis = [
    { label: 'Total GA Activations', value: total('ga_activations').toLocaleString('it-IT'), icon: <Zap size={20} />, color: '#006ae0', sub: 'All time' },
    { label: 'Total Incentive Earned', value: `€${total('incentive_amount').toLocaleString('it-IT', { maximumFractionDigits: 0 })}`, icon: <Award size={20} />, color: '#08dc7d', sub: 'Gross incentive' },
    { label: 'Total Port-In', value: total('port_in').toLocaleString('it-IT'), icon: <TrendingUp size={20} />, color: '#46286e', sub: 'All time' },
    { label: 'Total Deductions', value: `€${totalDeductions.toLocaleString('it-IT', { maximumFractionDigits: 0 })}`, icon: <TrendingDown size={20} />, color: '#f04438', sub: 'Clawback + PO + Renewal' },
    { label: 'Avg Renewal Rate', value: `${avg('renewal_rate').toFixed(1)}%`, icon: <RefreshCw size={20} />, color: '#00d7ff', sub: 'Monthly average' },
    { label: 'Net Incentive', value: `€${(total('incentive_amount') - totalDeductions).toLocaleString('it-IT', { maximumFractionDigits: 0 })}`, icon: <BarChart2 size={20} />, color: '#ffd54f', sub: 'After deductions' },
  ]

  return (
    <div className="space-y-2">
      <h3 className="section-title">All-Time KPI Summary</h3>
      <p className="section-subtitle">Cumulative performance across all available data</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-2xl p-4 shadow-sm border"
            style={{ background: k.color + '0f', borderColor: k.color + '30' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: k.color + '20', color: k.color }}>
              {k.icon}
            </div>
            <p className="text-xl font-bold text-[#21264e] leading-tight">{k.value}</p>
            <p className="text-sm font-semibold text-[#21264e] mt-1">{k.label}</p>
            <p className="text-xs text-[#21264e]/40 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
