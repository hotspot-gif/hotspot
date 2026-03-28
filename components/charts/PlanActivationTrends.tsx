'use client'
import { RetailerPerformance, MONTHS } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props { performance: RetailerPerformance[] }

export default function PlanActivationTrends({ performance }: Props) {
  const data = [...performance]
    .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
    .map(p => ({
      label: `${MONTHS[p.month - 1].slice(0, 3)} ${p.year}`,
      'P-IN ≤€6.99': p.plan_pin_699_below,
      'P-IN >€6.99': p.plan_pin_699_above,
      'NEW ≤€6.99': p.plan_new_699_below,
      'NEW >€6.99': p.plan_new_699_above,
    }))

  return (
    <div className="card">
      <h3 className="section-title mb-0.5">Plan Activation Trends</h3>
      <p className="section-subtitle mb-4">Monthly breakdown by plan type and price slab</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
          <XAxis dataKey="label" tick={{ fill: '#21264e99', fontSize: 9 }} tickLine={false}
            interval={Math.ceil(data.length / 12)} />
          <YAxis tick={{ fill: '#21264e99', fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#21264e', border: 'none', borderRadius: 12, color: '#fff', fontSize: 11 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="P-IN ≤€6.99" stackId="a" fill="#46286E" />
          <Bar dataKey="P-IN >€6.99" stackId="a" fill="#21264E" />
          <Bar dataKey="NEW ≤€6.99" stackId="a" fill="#006AE0" />
          <Bar dataKey="NEW >€6.99" stackId="a" fill="#08DC7D" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
