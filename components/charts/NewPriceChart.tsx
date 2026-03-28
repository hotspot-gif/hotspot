'use client'
import { RetailerPerformance } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props { performance: RetailerPerformance[] }

export default function NewPriceChart({ performance }: Props) {
  const yearly = Array.from(new Set(performance.map(p => p.year))).sort().map(yr => {
    const yp = performance.filter(p => p.year === yr)
    return {
      year: yr.toString(),
      '≤€6.99': yp.reduce((s, p) => s + p.plan_new_699_below, 0),
      '>€6.99': yp.reduce((s, p) => s + p.plan_new_699_above, 0),
    }
  })

  return (
    <div className="card">
      <h3 className="section-title mb-0.5">NEW ≤€6.99 vs NEW &gt;€6.99</h3>
      <p className="section-subtitle mb-4">New activation plan comparison by price tier</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={yearly} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
          <XAxis dataKey="year" tick={{ fill: '#21264e99', fontSize: 12 }} tickLine={false} />
          <YAxis tick={{ fill: '#21264e99', fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: '#21264e', border: 'none', borderRadius: 12, color: '#fff', fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="≤€6.99" fill="#006AE0" radius={[4, 4, 0, 0]} maxBarSize={50} />
          <Bar dataKey=">€6.99" fill="#08DC7D" radius={[4, 4, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
