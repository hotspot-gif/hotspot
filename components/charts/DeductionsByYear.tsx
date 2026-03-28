'use client'
import { RetailerPerformance } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props { performance: RetailerPerformance[]; years: number[] }

export default function DeductionsByYear({ performance, years }: Props) {
  const data = years.map(yr => {
    const yp = performance.filter(p => p.year === yr)
    return {
      year: yr.toString(),
      Clawback: yp.reduce((s, p) => s + p.deductions_clawback, 0),
      'PO Deductions': yp.reduce((s, p) => s + p.deductions_po, 0),
      'Renewal Impact': yp.reduce((s, p) => s + p.deductions_renewal, 0),
    }
  })

  return (
    <div className="card">
      <h3 className="section-title mb-0.5">Deductions by Year</h3>
      <p className="section-subtitle mb-4">Annual deduction breakdown by type</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
          <XAxis dataKey="year" tick={{ fill: '#21264e99', fontSize: 12 }} tickLine={false} />
          <YAxis tick={{ fill: '#21264e99', fontSize: 11 }} tickLine={false} axisLine={false}
            tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ background: '#21264e', border: 'none', borderRadius: 12, color: '#fff', fontSize: 11 }}
            formatter={(v: any, n: string) => [`€${Number(v).toLocaleString('it-IT', { maximumFractionDigits: 0 })}`, n]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="Clawback" fill="#f04438" radius={[4, 4, 0, 0]} maxBarSize={50} />
          <Bar dataKey="PO Deductions" fill="#ff8a65" radius={[4, 4, 0, 0]} maxBarSize={50} />
          <Bar dataKey="Renewal Impact" fill="#c62828" radius={[4, 4, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
