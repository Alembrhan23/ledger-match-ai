'use client';
import { useState } from 'react';
import MatchingFlow from '@/components/MatchingFlow';
export default function HomePage() {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      // Real: upload to Supabase
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-28 px-6 text-center">
      {/* Hero */}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-extrabold text-blue-800 leading-tight mb-4">
          Smart Tax Starts Here.
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Upload your sales, receipts, and bank statements. We’ll match them, flag issues, and calculate taxes — instantly.
        </p>
        <a
          href="/dashboard"
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
        >
          Try Free — No Credit Card
        </a>
      </div>

      {/* Drag & Drop Simulation */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`mt-16 border-4 border-dashed transition-all duration-300 ${
          dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } rounded-xl max-w-xl mx-auto py-20 px-6`}
      >
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">
            📥 Drag & Drop Your Sales Report Here
          </p>
          <p className="text-sm text-gray-500 mt-1">.csv, .xlsx, .pdf — we’ll take care of the rest</p>
          {fileName && (
            <p className="mt-4 text-green-600 font-medium">✅ Uploaded: {fileName}</p>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-5xl mx-auto mt-24 grid md:grid-cols-3 gap-10 text-left">
        <div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">📤 Upload</h3>
          <p className="text-gray-600">Drop your sales logs, receipts, and bank statements. We support CSV, Excel, and images.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">🤖 Auto-Match</h3>
          <p className="text-gray-600">Our AI matches your sales against bank deposits and receipt records — no spreadsheets needed.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">📄 Download Tax Report</h3>
          <p className="text-gray-600">We generate a clean tax-ready PDF report. Send to your accountant or file directly.</p>
        </div>
      </div>

          {/* Insert the animated matching flow */}
      <MatchingFlow />

    </div>
  );
}
