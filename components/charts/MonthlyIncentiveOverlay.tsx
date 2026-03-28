'use client'
import { RetailerPerformance, MONTHS } from '@/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props { performance: RetailerPerformance[]; years: number[] }
const YEAR_COLORS: Record<number, string> = { 2024: '#006ae0', 2025: '#08dc7d', 2026: '#ffd54f' }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#21264e] text-white rounded-xl p-3 shadow-xl text-xs">
      <p className="font-bold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.stroke }}>
          {p.name}: €{Number(p.value).toLocaleString('it-IT', { maximumFractionDigits: 0 })}
        </p>
      ))}
    </div>
  )
}

export default function MonthlyIncentiveOverlay({ performance, years }: Props) {
  const data = MONTHS.map((m, i) => {
    const row: any = { month: m }
    years.forEach(yr => {
      const p = performance.find(p => p.year === yr && p.month === i + 1)
      row[yr.toString()] = p?.incentive_amount ?? null
    })
    return row
  })

  return (
    <div className="card">
      <h3 className="section-title mb-0.5">Monthly Incentive — Calendar Overlay</h3>
      <p className="section-subtitle mb-4">Month-by-month incentive across years</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
          <XAxis dataKey="month" tick={{ fill: '#21264e99', fontSize: 11 }} tickLine={false} />
          <YAxis tick={{ fill: '#21264e99', fontSize: 11 }} tickLine={false} axisLine={false}
            tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {years.map(yr => (
            <Line key={yr} type="monotone" dataKey={yr.toString()} name={yr.toString()}
              stroke={YEAR_COLORS[yr] || '#006ae0'} strokeWidth={2.5}
              dot={{ r: 3, fill: YEAR_COLORS[yr] }} connectNulls activeDot={{ r: 5 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
