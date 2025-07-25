export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-28 pb-16 text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Pricing That Works for You</h2>
      <p className="text-gray-500 mb-12">Start free. Upgrade when you're ready to scale.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* STARTER PLAN */}
        <div className="border rounded-xl bg-white p-8 text-left shadow hover:shadow-md transition">
          <h3 className="text-xl font-semibold text-gray-800">Starter</h3>
          <p className="text-3xl font-bold text-blue-700 mt-2">$0 <span className="text-base text-gray-400">/month</span></p>
          <p className="text-sm text-gray-500 mt-1">Perfect for solo owners getting started</p>
          <ul className="mt-6 space-y-3 text-sm text-gray-700">
            <li><strong>1 report</strong> per month</li>
            <li>Drag & drop file uploads</li>
            <li>AI reconciliation engine</li>
            <li>Email alerts for gaps or mismatches</li>
            <li>Secure cloud storage</li>
          </ul>
          <a href="/dashboard" className="mt-6 inline-block w-full text-center bg-blue-100 text-blue-700 font-semibold py-2 rounded-md">
            Get Started Free
          </a>
        </div>

        {/* PRO PLAN */}
        <div className="border-2 border-blue-700 rounded-xl bg-blue-50 p-8 text-left shadow-xl transition transform scale-105">
          <h3 className="text-xl font-semibold text-blue-800">Pro</h3>
          <p className="text-3xl font-bold text-blue-700 mt-2">$9 <span className="text-base text-blue-500">/month</span></p>
          <p className="text-sm text-blue-600 mt-1">For growing businesses & serious reporting</p>
          <ul className="mt-6 space-y-3 text-sm text-blue-800">
            <li><strong>Unlimited</strong> monthly reports</li>
            <li>Auto tax calculation by location</li>
            <li>Downloadable PDF tax reports</li>
            <li>Sales vs deposit trend insights</li>
            <li>Priority email support</li>
            <li>Advanced fraud/gap detection</li>
          </ul>
          <a href="/upgrade" className="mt-6 inline-block w-full text-center bg-blue-700 text-white font-semibold py-2 rounded-md">
            Upgrade to Pro
          </a>
        </div>

        {/* ACCOUNTANT PLAN */}
        <div className="border rounded-xl bg-white p-8 text-left shadow hover:shadow-md transition">
          <h3 className="text-xl font-semibold text-gray-800">Accountant</h3>
          <p className="text-3xl font-bold text-green-700 mt-2">$99 <span className="text-base text-gray-400">/month</span></p>
          <p className="text-sm text-gray-500 mt-1">For firms managing multiple clients</p>
          <ul className="mt-6 space-y-3 text-sm text-gray-700">
            <li>Dashboard for up to <strong>10 clients</strong></li>
            <li>View & export client reports</li>
            <li>Monthly email digests per client</li>
            <li>Collaborative comment threads</li>
            <li>White-label report downloads</li>
            <li>Dedicated onboarding support</li>
          </ul>
          <a href="/contact" className="mt-6 inline-block w-full text-center bg-gray-800 text-white font-semibold py-2 rounded-md">
            Request Demo
          </a>
        </div>
      </div>
    </div>
  );
}
