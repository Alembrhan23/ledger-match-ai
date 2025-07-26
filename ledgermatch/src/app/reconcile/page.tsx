'use client'

import { useState } from 'react'

export default function ReconciliationPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleReconcile = async () => {
    setLoading(true)
    setMessage(null)

    const res = await fetch('/api/reconcile', {
      method: 'POST',
    })

    const result = await res.json()
    console.log('Reconciliation result:', result)

    if (!res.ok) {
      setMessage(`❌ Failed: ${result.error || 'Something went wrong'}`)
    } else {
      setMessage('✅ Reconciliation complete!')
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center p-10 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Reconcile Sales vs Bank</h2>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
        onClick={handleReconcile}
        disabled={loading}
      >
        {loading ? 'Reconciling...' : 'Run Reconciliation'}
      </button>

      {message && (
        <div
          className={`mt-4 p-3 text-sm rounded-md text-center max-w-xs ${
            message.startsWith('✅')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}
