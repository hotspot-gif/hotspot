'use client'
import { RetailerPerformance } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props { performance: RetailerPerformance[]; years: number[] }

export default function PortDeductionsAnnual({ performance, years }: Props) {
  const data = years.map(yr => {
    const yp = performance.filter(p => p.year === yr)
    return {
      year: yr.toString(),
      'Port-In Incentive': yp.reduce((s, p) => s + p.port_in_incentive, 0),
      'Total Deductions': yp.reduce((s, p) => s + p.deductions_clawback + p.deductions_po + p.deductions_renewal, 0),
    }
  })

  return (
    <div className="card">
      <h3 className="section-title mb-0.5">Port-In Incentive vs Deductions — Annual</h3>
      <p className="section-subtitle mb-4">Incentive earned vs deductions taken per year</p>
      <ResponsiveContainer width="100%" height={260}>
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
          <Bar dataKey="Port-In Incentive" fill="#46286E" radius={[4, 4, 0, 0]} maxBarSize={60} />
          <Bar dataKey="Total Deductions" fill="#F04438" radius={[4, 4, 0, 0]} maxBarSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
