'use client'
import { useRef } from 'react'
import { RetailerPerformance, MONTHS, CHART_COLORS } from '@/types'
import { useAuth } from '@/lib/auth-context'
import KpiCards from './charts/KpiCards'
import YearOverview from './charts/YearOverview'
import AllTimeKpi from './charts/AllTimeKpi'
import AnnualIncentiveYoY from './charts/AnnualIncentiveYoY'
import MonthlyIncentiveOverlay from './charts/MonthlyIncentiveOverlay'
import IncentiveTimeline from './charts/IncentiveTimeline'
import PlanActivationTrends from './charts/PlanActivationTrends'
import PinPriceChart from './charts/PinPriceChart'
import NewPriceChart from './charts/NewPriceChart'
import PlanMixDonut from './charts/PlanMixDonut'
import GaCalendarOverlay from './charts/GaCalendarOverlay'
import PortGaraMonthly from './charts/PortGaraMonthly'
import PortDeductionsAnnual from './charts/PortDeductionsAnnual'
import DeductionsKpi from './charts/DeductionsKpi'
import DeductionsMonthly from './charts/DeductionsMonthly'
import DeductionsByYear from './charts/DeductionsByYear'
import RenewalRateMonthly from './charts/RenewalRateMonthly'
import { Download, Printer } from 'lucide-react'

interface Props {
  retailer: any
  performance: RetailerPerformance[]
}

export default function RetailerReport({ retailer, performance }: Props) {
  const { user } = useAuth()
  const reportRef = useRef<HTMLDivElement>(null)

  const years = Array.from(new Set(performance.map(p => p.year))).sort()

  const handleExportPDF = async () => {
    try {
      const jsPDF = (await import('jspdf')).default
      await import('jspdf-autotable')
      const html2canvas = (await import('html2canvas')).default

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 15

      const addHeader = (pageNum: number) => {
        // Header bar
        doc.setFillColor(33, 38, 78)
        doc.rect(0, 0, pageWidth, 20, 'F')
        // Logo placeholder text
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text('HS Simply Italy', margin, 13)
        // Retailer ID
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(`Retailer: ${retailer.retailer_id} | ${retailer.name}`, pageWidth / 2, 13, { align: 'center' })
        doc.text(`Branch: ${retailer.branch?.replace('LMIT-HS-', '')} | Zone: ${retailer.zone || '—'}`, pageWidth - margin, 13, { align: 'right' })
        // Accent line
        doc.setFillColor(0, 106, 224)
        doc.rect(0, 20, pageWidth, 1.5, 'F')
      }

      const addFooter = (pageNum: number, totalPages: number) => {
        doc.setFillColor(245, 243, 240)
        doc.rect(0, pageHeight - 14, pageWidth, 14, 'F')
        doc.setDrawColor(220, 215, 210)
        doc.line(0, pageHeight - 14, pageWidth, pageHeight - 14)
        doc.setFontSize(7)
        doc.setTextColor(100, 100, 120)
        doc.setFont('helvetica', 'italic')
        doc.text('CONFIDENTIAL - Proprietary retailer performance data. For internal use only. Unauthorised distribution prohibited.', margin, pageHeight - 6)
        doc.setFont('helvetica', 'normal')
        doc.text(`Exported by: ${user?.name} (${user?.role}) | Page ${pageNum} of ${totalPages} | ${new Date().toLocaleDateString('it-IT')}`, pageWidth - margin, pageHeight - 6, { align: 'right' })
      }

      // Page 1: KPI Summary
      addHeader(1)
      doc.setTextColor(33, 38, 78)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Performance Report', margin, 32)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 120)
      doc.text(`${retailer.name} | ${retailer.retailer_id} | ${years.join(', ')}`, margin, 40)

      // KPI table
      const kpiData = years.map(yr => {
        const yrData = performance.filter(p => p.year === yr)
        return [
          yr.toString(),
          yrData.reduce((s, p) => s + p.ga_activations, 0).toString(),
          yrData.reduce((s, p) => s + p.new_activations, 0).toString(),
          yrData.reduce((s, p) => s + p.port_in, 0).toString(),
          `€${yrData.reduce((s, p) => s + p.incentive_amount, 0).toFixed(0)}`,
          `€${(yrData.reduce((s, p) => s + p.deductions_clawback + p.deductions_po + p.deductions_renewal, 0)).toFixed(0)}`,
          `${(yrData.reduce((s, p) => s + p.renewal_rate, 0) / (yrData.length || 1)).toFixed(1)}%`,
        ]
      })

      ;(doc as any).autoTable({
        startY: 46,
        head: [['Year', 'GA Acts', 'New Acts', 'Port-In', 'Incentive', 'Deductions', 'Renewal Rate']],
        body: kpiData,
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [33, 38, 78], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [255, 247, 242] },
        margin: { left: margin, right: margin },
      })

      // Monthly data table
      let currentY = (doc as any).lastAutoTable.finalY + 10
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(33, 38, 78)
      doc.text('Monthly Performance Detail', margin, currentY)
      currentY += 4

      const monthlyRows = performance.map(p => [
        p.year.toString(),
        MONTHS[p.month - 1],
        p.ga_activations.toString(),
        p.new_activations.toString(),
        p.port_in.toString(),
        p.port_out.toString(),
        `€${p.incentive_amount.toFixed(0)}`,
        `€${p.port_in_incentive.toFixed(0)}`,
        `€${(p.deductions_clawback + p.deductions_po + p.deductions_renewal).toFixed(0)}`,
        `${p.renewal_rate.toFixed(1)}%`,
      ])

      ;(doc as any).autoTable({
        startY: currentY,
        head: [['Year', 'Month', 'GA', 'New', 'Port-In', 'Port-Out', 'Incentive', 'PO Incentive', 'Deductions', 'Renewal%']],
        body: monthlyRows,
        styles: { fontSize: 7.5, cellPadding: 2.5 },
        headStyles: { fillColor: [33, 38, 78], textColor: 255, fontStyle: 'bold', fontSize: 7.5 },
        alternateRowStyles: { fillColor: [255, 247, 242] },
        margin: { left: margin, right: margin },
        rowPageBreak: 'avoid',
        didDrawPage: (data: any) => {
          addHeader(data.pageNumber)
          addFooter(data.pageNumber, 999)
        },
      })

      const totalPages = doc.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        addFooter(i, totalPages)
      }
      // Fix page 1 footer
      doc.setPage(1)
      addFooter(1, totalPages)

      doc.save(`HS-Report-${retailer.retailer_id}-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
      alert('PDF export failed. Please try again.')
    }
  }

  return (
    <div className="space-y-6 fade-in" ref={reportRef}>
      {/* Report header */}
      <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #21264e, #2e3a7a)', border: 'none' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white/80">
              {retailer.branch?.replace('LMIT-HS-', '')}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/60">
              {retailer.zone}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">{retailer.name}</h2>
          <p className="text-white/50 text-sm">ID: {retailer.retailer_id} · Years: {years.join(', ')}</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-white text-[#21264e] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#fff7f2] transition-all text-sm shrink-0"
        >
          <Download size={15} /> Export PDF
        </button>
      </div>

      <KpiCards performance={performance} />
      <AllTimeKpi performance={performance} />
      <YearOverview performance={performance} years={years} />
      <AnnualIncentiveYoY performance={performance} years={years} />
      <div className="grid lg:grid-cols-2 gap-6">
        <MonthlyIncentiveOverlay performance={performance} years={years} />
        <IncentiveTimeline performance={performance} />
      </div>
      <PlanActivationTrends performance={performance} />
      <div className="grid lg:grid-cols-2 gap-6">
        <PinPriceChart performance={performance} />
        <NewPriceChart performance={performance} />
      </div>
      <PlanMixDonut performance={performance} years={years} />
      <GaCalendarOverlay performance={performance} years={years} />
      <div className="grid lg:grid-cols-2 gap-6">
        <PortGaraMonthly performance={performance} />
        <PortDeductionsAnnual performance={performance} years={years} />
      </div>
      <DeductionsKpi performance={performance} />
      <div className="grid lg:grid-cols-2 gap-6">
        <DeductionsMonthly performance={performance} />
        <DeductionsByYear performance={performance} years={years} />
      </div>
      <RenewalRateMonthly performance={performance} years={years} />
    </div>
  )
}
