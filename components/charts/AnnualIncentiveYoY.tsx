'use client'
import { RetailerPerformance } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts'

interface Props { performance: RetailerPerformance[]; years: number[] }

const YEAR_COLORS: Record<number, string> = { 2024: '#006ae0', 2025: '#08dc7d', 2026: '#ffd54f' }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#21264e] text-white rounded-xl p-3 shadow-xl text-xs">
      <p className="font-bold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.name}: €{Number(p.value).toLocaleString('it-IT', { maximumFractionDigits: 0 })}
        </p>
      ))}
    </div>
  )
}

export default function AnnualIncentiveYoY({ performance, years }: Props) {
  const data = years.map(yr => {
    const yp = performance.filter(p => p.year === yr)
    return {
      year: yr.toString(),
      Incentive: yp.reduce((s, p) => s + p.incentive_amount, 0),
      'Port-In Incentive': yp.reduce((s, p) => s + p.port_in_incentive, 0),
      'GARA Bonus': yp.reduce((s, p) => s + p.gara_bonus, 0),
    }
  })

  return (
    <div className="card">
      <h3 className="section-title mb-0.5">Annual Incentive — Year-on-Year</h3>
      <p className="section-subtitle mb-4">Total incentive breakdown per year</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
          <XAxis dataKey="year" tick={{ fill: '#21264e99', fontSize: 12 }} tickLine={false} />
          <YAxis tick={{ fill: '#21264e99', fontSize: 11 }} tickLine={false} axisLine={false}
            tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#21264e99' }} />
          {years.map(yr => (
            <Bar key={yr} dataKey="Incentive" name={`Incentive ${yr}`} fill={YEAR_COLORS[yr] || '#006ae0'} radius={[4, 4, 0, 0]} maxBarSize={60} />
          ))}
          <Bar dataKey="Port-In Incentive" fill="#46286e" radius={[4, 4, 0, 0]} maxBarSize={60} />
          <Bar dataKey="GARA Bonus" fill="#00d7ff" radius={[4, 4, 0, 0]} maxBarSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
