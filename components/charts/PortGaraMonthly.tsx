'use client'
import { RetailerPerformance, MONTHS } from '@/types'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props { performance: RetailerPerformance[] }

export default function PortGaraMonthly({ performance }: Props) {
  const data = [...performance]
    .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
    .map(p => ({
      label: `${MONTHS[p.month - 1].slice(0, 3)} ${String(p.year).slice(2)}`,
      'Port-In': p.port_in,
      'Port-Out': p.port_out,
      'GARA Bonus': p.gara_bonus,
      'Port-In Incentive': p.port_in_incentive,
    }))

  return (
    <div className="card">
      <h3 className="section-title mb-0.5">Port-In Incentive + GARA Bonus Monthly</h3>
      <p className="section-subtitle mb-4">Port volume and associated bonuses</p>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
          <XAxis dataKey="label" tick={{ fill: '#21264e99', fontSize: 9 }} tickLine={false}
            interval={Math.ceil(data.length / 12)} />
          <YAxis yAxisId="left" tick={{ fill: '#21264e99', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#21264e99', fontSize: 10 }} tickLine={false} axisLine={false}
            tickFormatter={v => `€${v}`} />
          <Tooltip contentStyle={{ background: '#21264e', border: 'none', borderRadius: 12, color: '#fff', fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar yAxisId="left" dataKey="Port-In" fill="#46286E" radius={[3, 3, 0, 0]} maxBarSize={20} />
          <Bar yAxisId="left" dataKey="Port-Out" fill="#21264E" radius={[3, 3, 0, 0]} maxBarSize={20} />
          <Line yAxisId="right" type="monotone" dataKey="Port-In Incentive" stroke="#00d7ff" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="GARA Bonus" stroke="#08dc7d" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
