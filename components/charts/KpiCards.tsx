'use client'
import { RetailerPerformance, MONTHS } from '@/types'
import { TrendingUp, TrendingDown, Zap, Award, ArrowDownRight, RefreshCw } from 'lucide-react'
import clsx from 'clsx'

interface Props { performance: RetailerPerformance[] }

export default function KpiCards({ performance }: Props) {
  // Get latest 2 months with data
  const sorted = [...performance].sort((a, b) => a.year !== b.year ? b.year - a.year : b.month - a.month)
  const latest = sorted[0]
  const prev = sorted[1]

  const delta = (curr: number, prev: number) => {
    if (!prev) return null
    return ((curr - prev) / prev * 100).toFixed(1)
  }

  if (!latest) return null

  const kpis = [
    {
      label: 'GA Activations',
      value: latest.ga_activations,
      prev: prev?.ga_activations,
      suffix: '',
      icon: <Zap size={18} />,
      color: '#006ae0',
      period: `${MONTHS[latest.month - 1]} ${latest.year}`,
    },
    {
      label: 'Monthly Incentive',
      value: latest.incentive_amount,
      prev: prev?.incentive_amount,
      suffix: '€',
      prefix: '€',
      icon: <Award size={18} />,
      color: '#08dc7d',
      period: `${MONTHS[latest.month - 1]} ${latest.year}`,
    },
    {
      label: 'Port-In',
      value: latest.port_in,
      prev: prev?.port_in,
      suffix: '',
      icon: <TrendingUp size={18} />,
      color: '#46286e',
      period: `${MONTHS[latest.month - 1]} ${latest.year}`,
    },
    {
      label: 'Deductions',
      value: latest.deductions_clawback + latest.deductions_po + latest.deductions_renewal,
      prev: prev ? prev.deductions_clawback + prev.deductions_po + prev.deductions_renewal : undefined,
      suffix: '€',
      prefix: '€',
      icon: <ArrowDownRight size={18} />,
      color: '#f04438',
      period: `${MONTHS[latest.month - 1]} ${latest.year}`,
      invertTrend: true,
    },
    {
      label: 'Renewal Rate',
      value: latest.renewal_rate,
      prev: prev?.renewal_rate,
      suffix: '%',
      icon: <RefreshCw size={18} />,
      color: '#00d7ff',
      period: `${MONTHS[latest.month - 1]} ${latest.year}`,
    },
    {
      label: 'Port-In Incentive',
      value: latest.port_in_incentive,
      prev: prev?.port_in_incentive,
      suffix: '€',
      prefix: '€',
      icon: <TrendingUp size={18} />,
      color: '#ffd54f',
      period: `${MONTHS[latest.month - 1]} ${latest.year}`,
    },
  ]

  return (
    <div className="space-y-2">
      <h3 className="section-title">Performance Insights</h3>
      <p className="section-subtitle">Latest available month vs previous month</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
        {kpis.map((k, i) => {
          const d = k.prev !== undefined ? delta(k.value, k.prev) : null
          const isUp = d !== null && parseFloat(d) > 0
          const isDown = d !== null && parseFloat(d) < 0
          const isGood = k.invertTrend ? isDown : isUp
          const isBad = k.invertTrend ? isUp : isDown

          return (
            <div key={i} className="kpi-card">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: k.color + '18', color: k.color }}>
                  {k.icon}
                </div>
                {d !== null && (
                  <span className={clsx(
                    'text-xs font-bold px-1.5 py-0.5 rounded-md',
                    isGood ? 'bg-[#08dc7d]/15 text-[#059652]' : isBad ? 'bg-[#f04438]/10 text-[#f04438]' : 'bg-gray-100 text-gray-500'
                  )}>
                    {isUp ? '▲' : isDown ? '▼' : '—'} {Math.abs(parseFloat(d))}%
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-[#21264e]">
                {k.prefix}{typeof k.value === 'number' && k.suffix === '%'
                  ? k.value.toFixed(1)
                  : typeof k.value === 'number'
                  ? k.value.toLocaleString('it-IT', { maximumFractionDigits: 0 })
                  : k.value}{k.suffix !== '€' ? k.suffix : ''}
              </p>
              <p className="text-xs text-[#21264e]/50 font-medium mt-0.5">{k.label}</p>
              <p className="text-xs text-[#21264e]/30 mt-0.5">{k.period}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
