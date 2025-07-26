'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingReview() {
  const [uploaded, setUploaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simulate file check
    setTimeout(() => setUploaded(true), 1000)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">✅ Files Uploaded</h2>
        <p className="text-gray-600 mb-6">Your sales, receipt, and bank statement have been processed.</p>
        <button
          onClick={() => router.push('/onboarding/complete')}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Continue →
        </button>
      </div>
      <button
  onClick={() => router.push('/onboarding/upload')}
  className="mt-6 px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
>
  Continue →
</button>

    </div>
  )
}
