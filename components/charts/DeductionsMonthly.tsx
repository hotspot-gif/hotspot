'use client'
import { RetailerPerformance, MONTHS } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props { performance: RetailerPerformance[] }

export default function DeductionsMonthly({ performance }: Props) {
  const data = [...performance]
    .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
    .map(p => ({
      label: `${MONTHS[p.month - 1].slice(0, 3)} ${String(p.year).slice(2)}`,
      Clawback: p.deductions_clawback,
      'PO Deductions': p.deductions_po,
      'Renewal Impact': p.deductions_renewal,
    }))

  return (
    <div className="card">
      <h3 className="section-title mb-0.5">Deductions Monthly</h3>
      <p className="section-subtitle mb-4">Monthly deduction breakdown by type</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
          <XAxis dataKey="label" tick={{ fill: '#21264e99', fontSize: 9 }} tickLine={false}
            interval={Math.ceil(data.length / 12)} />
          <YAxis tick={{ fill: '#21264e99', fontSize: 11 }} tickLine={false} axisLine={false}
            tickFormatter={v => `€${v}`} />
          <Tooltip
            contentStyle={{ background: '#21264e', border: 'none', borderRadius: 12, color: '#fff', fontSize: 11 }}
            formatter={(v: any, n: string) => [`€${Number(v).toLocaleString('it-IT', { maximumFractionDigits: 0 })}`, n]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="Clawback" stackId="a" fill="#f04438" />
          <Bar dataKey="PO Deductions" stackId="a" fill="#ff8a65" />
          <Bar dataKey="Renewal Impact" stackId="a" fill="#c62828" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
