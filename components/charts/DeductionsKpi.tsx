'use client'
import { RetailerPerformance } from '@/types'
import { AlertTriangle, TrendingDown, Scissors } from 'lucide-react'

interface Props { performance: RetailerPerformance[] }

export default function DeductionsKpi({ performance }: Props) {
  const total = (k: keyof RetailerPerformance) => performance.reduce((s, p) => s + (Number(p[k]) || 0), 0)
  const clawback = total('deductions_clawback')
  const po = total('deductions_po')
  const renewal = total('deductions_renewal')
  const grand = clawback + po + renewal
  const incentive = total('incentive_amount')
  const ratio = incentive > 0 ? (grand / incentive * 100) : 0

  const cards = [
    { label: 'Total Deductions', value: `€${grand.toLocaleString('it-IT', { maximumFractionDigits: 0 })}`, sub: 'All-time', icon: <TrendingDown size={20} /> },
    { label: 'Clawback', value: `€${clawback.toLocaleString('it-IT', { maximumFractionDigits: 0 })}`, sub: 'Reversed incentive', icon: <Scissors size={20} /> },
    { label: 'PO Deductions', value: `€${po.toLocaleString('it-IT', { maximumFractionDigits: 0 })}`, sub: 'Port-out penalties', icon: <AlertTriangle size={20} /> },
    { label: 'Renewal Impact', value: `€${renewal.toLocaleString('it-IT', { maximumFractionDigits: 0 })}`, sub: 'Renewal penalties', icon: <TrendingDown size={20} /> },
    { label: 'Deduction Ratio', value: `${ratio.toFixed(1)}%`, sub: 'Of gross incentive', icon: <AlertTriangle size={20} /> },
    { label: 'Net After Deductions', value: `€${(incentive - grand).toLocaleString('it-IT', { maximumFractionDigits: 0 })}`, sub: 'Final net incentive', icon: <TrendingDown size={20} /> },
  ]

  return (
    <div className="space-y-2">
      <h3 className="section-title">Deductions Analysis</h3>
      <p className="section-subtitle">All deductions applied to this retailer</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
        {cards.map((c, i) => (
          <div key={i} className="rounded-2xl p-4 shadow-sm" style={{ background: '#f04438' + (i === 0 ? 'ff' : i < 4 ? 'dd' : 'bb'), color: '#fff' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 bg-white/20">
              {c.icon}
            </div>
            <p className="text-lg font-bold leading-tight">{c.value}</p>
            <p className="text-sm font-semibold mt-0.5 text-white/90">{c.label}</p>
            <p className="text-xs text-white/60 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
