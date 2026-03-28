'use client'
import { RetailerPerformance, MONTHS } from '@/types'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface Props { performance: RetailerPerformance[] }

export default function IncentiveTimeline({ performance }: Props) {
  const data = [...performance]
    .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
    .map(p => ({
      label: `${MONTHS[p.month - 1]} ${p.year}`,
      incentive: p.incentive_amount,
      net: p.incentive_amount - p.deductions_clawback - p.deductions_po - p.deductions_renewal,
    }))

  return (
    <div className="card">
      <h3 className="section-title mb-0.5">Full Monthly Incentive Timeline</h3>
      <p className="section-subtitle mb-4">Gross vs net incentive across all months</p>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
          <defs>
            <linearGradient id="gradInc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#006ae0" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#006ae0" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradNet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#08dc7d" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#08dc7d" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
          <XAxis dataKey="label" tick={{ fill: '#21264e99', fontSize: 9 }} tickLine={false}
            interval={Math.ceil(data.length / 12) - 1} />
          <YAxis tick={{ fill: '#21264e99', fontSize: 11 }} tickLine={false} axisLine={false}
            tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ background: '#21264e', border: 'none', borderRadius: 12, color: '#fff', fontSize: 11 }}
            formatter={(v: any, n: string) => [`€${Number(v).toLocaleString('it-IT', { maximumFractionDigits: 0 })}`, n]}
          />
          <Area type="monotone" dataKey="incentive" name="Gross Incentive" stroke="#006ae0" strokeWidth={2}
            fill="url(#gradInc)" />
          <Area type="monotone" dataKey="net" name="Net Incentive" stroke="#08dc7d" strokeWidth={2}
            fill="url(#gradNet)" />
          <ReferenceLine y={0} stroke="#f04438" strokeDasharray="4 3" strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
