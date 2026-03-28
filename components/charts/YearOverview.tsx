'use client'
import { RetailerPerformance, MONTHS } from '@/types'

interface Props { performance: RetailerPerformance[]; years: number[] }

const YEAR_COLORS: Record<number, string> = { 2024: '#006ae0', 2025: '#08dc7d', 2026: '#ffd54f' }

export default function YearOverview({ performance, years }: Props) {
  const yearData = years.map(yr => {
    const yp = performance.filter(p => p.year === yr)
    const total = (k: keyof RetailerPerformance) => yp.reduce((s, p) => s + (Number(p[k]) || 0), 0)
    const avg = (k: keyof RetailerPerformance) => yp.length ? total(k) / yp.length : 0
    const deductions = total('deductions_clawback') + total('deductions_po') + total('deductions_renewal')
    return {
      year: yr,
      ga: total('ga_activations'),
      new_acts: total('new_activations'),
      port_in: total('port_in'),
      port_out: total('port_out'),
      pin_below: total('plan_pin_699_below'),
      pin_above: total('plan_pin_699_above'),
      new_below: total('plan_new_699_below'),
      new_above: total('plan_new_699_above'),
      incentive: total('incentive_amount'),
      port_incentive: total('port_in_incentive'),
      gara: total('gara_bonus'),
      deductions,
      clawback: total('deductions_clawback'),
      po_deduct: total('deductions_po'),
      renewal_deduct: total('deductions_renewal'),
      net_incentive: total('incentive_amount') - deductions,
      avg_renewal: avg('renewal_rate'),
      months: yp.length,
    }
  })

  const rows: { label: string; key: keyof typeof yearData[0]; format: (v: number) => string; category?: boolean }[] = [
    { label: 'GA Activations', key: 'ga', format: v => v.toLocaleString('it-IT') },
    { label: 'New Activations', key: 'new_acts', format: v => v.toLocaleString('it-IT') },
    { label: 'Port-In', key: 'port_in', format: v => v.toLocaleString('it-IT') },
    { label: 'Port-Out', key: 'port_out', format: v => v.toLocaleString('it-IT') },
    { label: 'P-IN ≤€6.99', key: 'pin_below', format: v => v.toLocaleString('it-IT') },
    { label: 'P-IN >€6.99', key: 'pin_above', format: v => v.toLocaleString('it-IT') },
    { label: 'NEW ≤€6.99', key: 'new_below', format: v => v.toLocaleString('it-IT') },
    { label: 'NEW >€6.99', key: 'new_above', format: v => v.toLocaleString('it-IT') },
    { label: 'Incentive (€)', key: 'incentive', format: v => `€${v.toLocaleString('it-IT', { maximumFractionDigits: 0 })}` },
    { label: 'Port-In Incentive (€)', key: 'port_incentive', format: v => `€${v.toLocaleString('it-IT', { maximumFractionDigits: 0 })}` },
    { label: 'GARA Bonus (€)', key: 'gara', format: v => `€${v.toLocaleString('it-IT', { maximumFractionDigits: 0 })}` },
    { label: 'Total Deductions (€)', key: 'deductions', format: v => `€${v.toLocaleString('it-IT', { maximumFractionDigits: 0 })}` },
    { label: '— Clawback', key: 'clawback', format: v => `€${v.toLocaleString('it-IT', { maximumFractionDigits: 0 })}` },
    { label: '— PO Deductions', key: 'po_deduct', format: v => `€${v.toLocaleString('it-IT', { maximumFractionDigits: 0 })}` },
    { label: '— Renewal Impact', key: 'renewal_deduct', format: v => `€${v.toLocaleString('it-IT', { maximumFractionDigits: 0 })}` },
    { label: 'Net Incentive (€)', key: 'net_incentive', format: v => `€${v.toLocaleString('it-IT', { maximumFractionDigits: 0 })}` },
    { label: 'Avg Renewal Rate', key: 'avg_renewal', format: v => `${v.toFixed(1)}%` },
    { label: 'Months of Data', key: 'months', format: v => v.toString() },
  ]

  const deductionRows = new Set(['Total Deductions (€)', '— Clawback', '— PO Deductions', '— Renewal Impact'])
  const highlightRows = new Set(['Net Incentive (€)', 'GA Activations'])

  return (
    <div className="card overflow-hidden">
      <h3 className="section-title mb-0.5">Year-by-Year Overview</h3>
      <p className="section-subtitle mb-4">Full metrics comparison across years</p>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-48">Metric</th>
              {yearData.map(yd => (
                <th key={yd.year} style={{ color: YEAR_COLORS[yd.year] || '#fff', background: '#21264e' }}>
                  {yd.year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isDeduction = deductionRows.has(row.label)
              const isHighlight = highlightRows.has(row.label)
              const isSub = row.label.startsWith('—')
              return (
                <tr key={i} className={isHighlight ? 'font-semibold' : ''}>
                  <td className={`font-medium ${isSub ? 'pl-7 text-xs text-[#21264e]/50' : ''} ${isHighlight ? 'font-bold' : ''}`}>
                    {row.label}
                  </td>
                  {yearData.map(yd => {
                    const val = yd[row.key] as number
                    return (
                      <td key={yd.year} className={`text-right font-${isHighlight ? 'bold' : 'medium'} ${isDeduction ? 'text-[#f04438]' : ''} ${isSub ? 'text-xs' : ''}`}>
                        {row.format(val)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
