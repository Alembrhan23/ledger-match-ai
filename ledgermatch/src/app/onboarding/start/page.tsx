'use client'
import { useRouter } from 'next/navigation'

export default function OnboardingStart() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to LedgerMatch.ai</h1>
        <p className="text-gray-600 text-lg mb-6">
          We’ll guide you through uploading your reports and generating your first tax summary.
        </p>
        <button
          onClick={() => router.push('/onboarding/upload')}
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
        >
          Let’s Get Started →
        </button>
      </div>
    </div>
  )
}
