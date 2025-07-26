'use client'

import { useEffect, useState } from 'react'
import TaxReturnTrigger from '../../../components/TaxReturnTrigger'
import DownloadDenverReturn from '../../../components/DownloadDenverReturn'
import { FileTextIcon, AlertCircle, DollarSign, Clock, FileMinus } from 'lucide-react'

type Reconciliation = {
  id: string
  user_id: string
  sales_report_id: string
  bank_statement_id: string
  cash_reported: number
  cash_found: number
  gap: number
  gap_percent: number
  insights?: string
  created_at: string
}

type TaxReturn = {
  id: string
  reconciliation_id: string
  tax_due: number
  tax_rate: number
  calculated_on: string
}

export default function ReconciliationDashboard() {
  const [data, setData] = useState<Reconciliation | null>(null)
  const [latestTaxReturn, setLatestTaxReturn] = useState<TaxReturn | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/reconciliation-latest')
        const result = await res.json()
        if (!res.ok) throw new Error(result.error || 'Failed to load')
        setData(result)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    async function fetchLatestTaxReturn() {
      try {
        const res = await fetch('/api/tax-return-latest')
        const result = await res.json()
        if (!res.ok) throw new Error(result.error || 'Failed to load tax return')
        setLatestTaxReturn(result)
      } catch (err) {
        console.error('Failed to load tax return:', err)
      }
    }

    fetchData()
    fetchLatestTaxReturn()
  }, [])

  if (loading) return <p className="text-center text-gray-600">Loading reconciliation...</p>
  if (error) return <p className="text-center text-red-600">❌ {error}</p>
  if (!data) return <p className="text-center text-gray-600">No reconciliation found.</p>

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0e0e0e] px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-800">
          <FileTextIcon className="text-indigo-600" /> Reconciliation Summary
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
          <div><span className="font-medium text-gray-500">Sales Report ID:</span><br />{data.sales_report_id}</div>
          <div><span className="font-medium text-gray-500">Bank Statement ID:</span><br />{data.bank_statement_id}</div>
          <div className="flex items-center gap-2">
            <DollarSign className="text-green-600 w-4 h-4" />
            <span><strong>Cash Reported:</strong> ${data.cash_reported.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileMinus className="text-blue-600 w-4 h-4" />
            <span><strong>Cash Found:</strong> ${data.cash_found.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-500 w-4 h-4" />
            <span><strong>Gap:</strong> ${data.gap.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="text-yellow-500 w-4 h-4" />
            <span><strong>Gap %:</strong> {data.gap_percent.toFixed(2)}%</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <Clock className="text-gray-500 w-4 h-4" />
            <span><strong>Created At:</strong> {new Date(data.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-6">
          <TaxReturnTrigger reconciliationId={data.id} />
        </div>

        {latestTaxReturn && (
          <div className="mt-4">
            <DownloadDenverReturn taxReturn={latestTaxReturn} />
          </div>
        )}
      </div>
    </div>
  )
}
