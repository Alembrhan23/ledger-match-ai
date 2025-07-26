'use client'
import { useState } from 'react'

export default function TaxReturnTrigger({ reconciliationId }: { reconciliationId: string }) {
  const [message, setMessage] = useState<string | null>(null)

  const handleGenerate = async () => {
    setMessage(null)
    const res = await fetch('/api/generate-tax-return', {
      method: 'POST',
      body: JSON.stringify({ reconciliationId }),
    })
    const result = await res.json()

    if (!res.ok) {
      setMessage(`❌ ${result.error}`)
    } else {
      setMessage('✅ Tax return generated successfully')
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Generate Tax Return
      </button>
      {message && <div className="mt-2 text-sm text-gray-700">{message}</div>}
    </div>
  )
}
