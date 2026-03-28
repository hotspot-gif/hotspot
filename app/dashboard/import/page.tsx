'use client'
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, Download, Info } from 'lucide-react'

type ImportType = 'retailers' | 'performance'
type Status = 'idle' | 'parsing' | 'importing' | 'done' | 'error'

interface ImportResult {
  inserted: number
  skipped: number
  errors: string[]
}

export default function ImportPage() {
  const { user } = useAuth()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [importType, setImportType] = useState<ImportType>('performance')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<ImportResult | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState('')
  const [preview, setPreview] = useState<any[]>([])

  useEffect(() => {
    if (user?.role !== 'HS-ADMIN') router.replace('/dashboard')
  }, [user])

  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase().replace(/ /g, '_'))
    return lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim().replace(/"/g, ''))
      const row: any = {}
      headers.forEach((h, i) => { row[h] = vals[i] || '' })
      return row
    }).filter(row => Object.values(row).some(v => v))
  }

  const handleFile = async (file: File) => {
    if (!file) return
    setFileName(file.name)
    setStatus('parsing')
    setResult(null)
    setPreview([])

    try {
      const text = await file.text()
      let rows: any[]

      if (file.name.endsWith('.json')) {
        rows = JSON.parse(text)
      } else {
        rows = parseCSV(text)
      }

      setPreview(rows.slice(0, 5))
      await importRows(rows)
    } catch (e: any) {
      setStatus('error')
      setResult({ inserted: 0, skipped: 0, errors: [e.message] })
    }
  }

  const importRows = async (rows: any[]) => {
    setStatus('importing')
    let inserted = 0, skipped = 0
    const errors: string[] = []

    const BATCH = 50
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH)

      if (importType === 'retailers') {
        const mapped = batch.map(r => ({
          retailer_id: r.retailer_id || r.id,
          name: r.name,
          branch: r.branch,
          zone: r.zone || null,
        })).filter(r => r.retailer_id && r.name && r.branch)

        if (mapped.length < batch.length) skipped += batch.length - mapped.length

        const { data, error } = await supabase
          .from('retailers')
          .upsert(mapped, { onConflict: 'retailer_id' })
          .select()

        if (error) { errors.push(`Batch ${i / BATCH + 1}: ${error.message}`); skipped += batch.length }
        else inserted += data?.length || 0

      } else {
        const mapped = batch.map(r => ({
          retailer_id: r.retailer_id,
          year: parseInt(r.year) || 2024,
          month: parseInt(r.month) || 1,
          ga_activations: parseFloat(r.ga_activations || r.ga) || 0,
          new_activations: parseFloat(r.new_activations || r.new) || 0,
          port_in: parseFloat(r.port_in) || 0,
          port_out: parseFloat(r.port_out) || 0,
          plan_pin_699_below: parseFloat(r.plan_pin_699_below || r.pin_below) || 0,
          plan_pin_699_above: parseFloat(r.plan_pin_699_above || r.pin_above) || 0,
          plan_new_699_below: parseFloat(r.plan_new_699_below || r.new_below) || 0,
          plan_new_699_above: parseFloat(r.plan_new_699_above || r.new_above) || 0,
          incentive_amount: parseFloat(r.incentive_amount || r.incentive) || 0,
          port_in_incentive: parseFloat(r.port_in_incentive) || 0,
          gara_bonus: parseFloat(r.gara_bonus || r.gara) || 0,
          deductions_clawback: parseFloat(r.deductions_clawback || r.clawback) || 0,
          deductions_po: parseFloat(r.deductions_po) || 0,
          deductions_renewal: parseFloat(r.deductions_renewal) || 0,
          renewal_rate: parseFloat(r.renewal_rate) || 0,
        })).filter(r => r.retailer_id && r.year && r.month)

        if (mapped.length < batch.length) skipped += batch.length - mapped.length

        const { data, error } = await supabase
          .from('retailer_performance')
          .upsert(mapped, { onConflict: 'retailer_id,year,month' })
          .select()

        if (error) { errors.push(`Batch ${i / BATCH + 1}: ${error.message}`); skipped += batch.length }
        else inserted += data?.length || 0
      }
    }

    setResult({ inserted, skipped, errors })
    setStatus('done')
  }

  const downloadTemplate = () => {
    let csv: string
    if (importType === 'retailers') {
      csv = 'retailer_id,name,branch,zone\nR001,Example Retailer,LMIT-HS-MILAN,Zone A'
    } else {
      csv = 'retailer_id,year,month,ga_activations,new_activations,port_in,port_out,plan_pin_699_below,plan_pin_699_above,plan_new_699_below,plan_new_699_above,incentive_amount,port_in_incentive,gara_bonus,deductions_clawback,deductions_po,deductions_renewal,renewal_rate\nR001,2024,1,45,30,12,3,10,8,12,15,1200.50,300,150,50,25,30,78.5'
    }
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `hs-${importType}-template.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setStatus('idle'); setResult(null); setFileName(''); setPreview([])
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-6 fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-[#21264e] flex items-center gap-2">
          <Upload size={22} style={{ color: '#006ae0' }} /> Data Import
        </h1>
        <p className="text-[#21264e]/50 text-sm mt-0.5">Import retailers or performance data via CSV or JSON</p>
      </div>

      {/* Type selector */}
      <div className="card">
        <p className="label mb-3">What are you importing?</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'performance' as ImportType, label: 'Performance Data', desc: 'Monthly KPIs, incentives, deductions' },
            { id: 'retailers' as ImportType, label: 'Retailers', desc: 'Retailer list with branch and zone' },
          ].map(opt => (
            <button key={opt.id} onClick={() => { setImportType(opt.id); reset() }}
              className={`text-left p-4 rounded-xl border transition-all ${importType === opt.id ? 'bg-[#21264e] text-white border-[#21264e]' : 'border-gray-200 hover:border-[#21264e]/30'}`}>
              <p className={`font-semibold text-sm ${importType === opt.id ? 'text-white' : 'text-[#21264e]'}`}>{opt.label}</p>
              <p className={`text-xs mt-0.5 ${importType === opt.id ? 'text-white/60' : 'text-[#21264e]/40'}`}>{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Template download */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#006ae0]/8 border border-[#006ae0]/20">
        <Info size={15} className="text-[#006ae0] shrink-0" />
        <p className="text-sm text-[#21264e]/70 flex-1">
          Download the CSV template to ensure correct column formatting for {importType === 'retailers' ? 'retailers' : 'performance data'}.
        </p>
        <button onClick={downloadTemplate}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#006ae0] hover:underline shrink-0">
          <Download size={13} /> Template
        </button>
      </div>

      {/* Drop zone */}
      {status === 'idle' || status === 'parsing' ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${dragOver ? 'border-[#006ae0] bg-[#006ae0]/5' : 'border-gray-200 hover:border-[#006ae0]/40 hover:bg-[#fff7f2]'}`}
        >
          <input ref={fileRef} type="file" accept=".csv,.json" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          <FileSpreadsheet size={40} className="mx-auto mb-3 text-[#21264e]/20" />
          <p className="font-semibold text-[#21264e]">Drop your file here or click to browse</p>
          <p className="text-sm text-[#21264e]/40 mt-1">CSV or JSON · Max 10MB</p>
        </div>
      ) : null}

      {/* Importing */}
      {status === 'importing' && (
        <div className="card text-center py-10">
          <div className="spinner mx-auto mb-4" />
          <p className="font-semibold text-[#21264e]">Importing {fileName}…</p>
          <p className="text-sm text-[#21264e]/40 mt-1">Please wait, uploading in batches</p>
        </div>
      )}

      {/* Result */}
      {(status === 'done' || status === 'error') && result && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#21264e]">Import Complete</h3>
            <button onClick={reset} className="text-[#21264e]/40 hover:text-[#21264e]"><X size={18} /></button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl p-3 bg-[#08dc7d]/10 border border-[#08dc7d]/20 text-center">
              <p className="text-2xl font-bold text-[#059652]">{result.inserted}</p>
              <p className="text-xs text-[#21264e]/50 mt-0.5">Rows imported</p>
            </div>
            <div className="rounded-xl p-3 bg-[#ffd54f]/10 border border-[#ffd54f]/40 text-center">
              <p className="text-2xl font-bold text-[#b45309]">{result.skipped}</p>
              <p className="text-xs text-[#21264e]/50 mt-0.5">Rows skipped</p>
            </div>
            <div className="rounded-xl p-3 bg-[#f04438]/10 border border-[#f04438]/20 text-center">
              <p className="text-2xl font-bold text-[#f04438]">{result.errors.length}</p>
              <p className="text-xs text-[#21264e]/50 mt-0.5">Batch errors</p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="rounded-xl bg-[#f04438]/5 border border-[#f04438]/20 p-3 space-y-1">
              {result.errors.map((e, i) => (
                <p key={i} className="text-xs text-[#f04438] flex items-start gap-1.5">
                  <AlertCircle size={12} className="mt-0.5 shrink-0" /> {e}
                </p>
              ))}
            </div>
          )}

          {result.inserted > 0 && (
            <div className="flex items-center gap-2 text-[#059652] text-sm">
              <CheckCircle2 size={16} />
              Successfully imported {result.inserted} {importType === 'retailers' ? 'retailers' : 'performance records'}
            </div>
          )}

          <button onClick={reset} className="btn-secondary w-full">Import Another File</button>
        </div>
      )}

      {/* Preview */}
      {preview.length > 0 && status !== 'importing' && (
        <div className="card overflow-hidden p-0">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-[#21264e]">File Preview (first 5 rows)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table text-xs">
              <thead>
                <tr>
                  {Object.keys(preview[0]).map(k => <th key={k} className="text-xs">{k}</th>)}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((v: any, j) => (
                      <td key={j} className="text-xs max-w-[120px] truncate">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
