'use client'
import { RetailerPerformance } from '@/types'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props { performance: RetailerPerformance[]; years: number[] }

const COLORS = ['#46286E', '#21264E', '#006AE0', '#08DC7D']
const LABELS = ['P-IN ≤€6.99', 'P-IN >€6.99', 'NEW ≤€6.99', 'NEW >€6.99']
const YEAR_COLORS: Record<number, string> = { 2024: '#006ae0', 2025: '#08dc7d', 2026: '#ffd54f' }

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function PlanMixDonut({ performance, years }: Props) {
  return (
    <div className="card">
      <h3 className="section-title mb-0.5">Plan Mix by Year</h3>
      <p className="section-subtitle mb-4">Distribution of plan types across years</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {years.map(yr => {
          const yp = performance.filter(p => p.year === yr)
          const data = [
            { name: LABELS[0], value: yp.reduce((s, p) => s + p.plan_pin_699_below, 0) },
            { name: LABELS[1], value: yp.reduce((s, p) => s + p.plan_pin_699_above, 0) },
            { name: LABELS[2], value: yp.reduce((s, p) => s + p.plan_new_699_below, 0) },
            { name: LABELS[3], value: yp.reduce((s, p) => s + p.plan_new_699_above, 0) },
          ].filter(d => d.value > 0)

          const total = data.reduce((s, d) => s + d.value, 0)

          return (
            <div key={yr} className="rounded-2xl p-4 border"
              style={{ borderColor: (YEAR_COLORS[yr] || '#006ae0') + '40', background: (YEAR_COLORS[yr] || '#006ae0') + '08' }}>
              <p className="text-sm font-bold text-center mb-2"
                style={{ color: YEAR_COLORS[yr] || '#006ae0' }}>{yr}</p>
              <p className="text-xs text-center text-[#21264e]/40 mb-2">Total: {total.toLocaleString('it-IT')}</p>
              <PieChart width={200} height={180} style={{ margin: '0 auto' }}>
                <Pie data={data} cx={100} cy={80} innerRadius={45} outerRadius={80}
                  dataKey="value" labelLine={false} label={<CustomLabel />}>
                  {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#21264e', border: 'none', borderRadius: 10, color: '#fff', fontSize: 11 }}
                  formatter={(v: any) => [v.toLocaleString('it-IT'), '']}
                />
              </PieChart>
              <div className="space-y-1 mt-2">
                {data.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: COLORS[i % COLORS.length] }} />
                      {d.name}
                    </span>
                    <span className="font-semibold text-[#21264e]">{d.value.toLocaleString('it-IT')}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
