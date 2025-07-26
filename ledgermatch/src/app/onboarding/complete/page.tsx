'use client'
import Link from 'next/link'

export default function OnboardingComplete() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-3">🎉 All Set!</h2>
        <p className="text-gray-700 mb-6">Your tax dashboard is ready. You can now reconcile, file, and download tax returns.</p>
        <Link href="/dashboard">
          <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition">
            Go to Dashboard →
          </button>
        </Link>
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
