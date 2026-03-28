'use client'
import { RetailerPerformance, MONTHS } from '@/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props { performance: RetailerPerformance[]; years: number[] }
const YEAR_COLORS: Record<number, string> = { 2024: '#006ae0', 2025: '#08dc7d', 2026: '#ffd54f' }

export default function GaCalendarOverlay({ performance, years }: Props) {
  const data = MONTHS.map((m, i) => {
    const row: any = { month: m }
    years.forEach(yr => {
      const p = performance.find(p => p.year === yr && p.month === i + 1)
      row[yr.toString()] = p?.ga_activations ?? null
    })
    return row
  })

  return (
    <div className="card">
      <h3 className="section-title mb-0.5">GA Activations — Calendar Overlay</h3>
      <p className="section-subtitle mb-4">Monthly GA activations layered across years</p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
          <XAxis dataKey="month" tick={{ fill: '#21264e99', fontSize: 11 }} tickLine={false} />
          <YAxis tick={{ fill: '#21264e99', fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: '#21264e', border: 'none', borderRadius: 12, color: '#fff', fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {years.map(yr => (
            <Line key={yr} type="monotone" dataKey={yr.toString()} name={`GA ${yr}`}
              stroke={YEAR_COLORS[yr] || '#006ae0'} strokeWidth={2.5}
              dot={{ r: 3, fill: YEAR_COLORS[yr] }} connectNulls activeDot={{ r: 5 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
