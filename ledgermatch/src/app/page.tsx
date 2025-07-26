'use client';

import { useState } from 'react';
import MatchingFlow from '../components/MatchingFlow';

export default function HomePage() {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      // TODO: Upload to Supabase
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-28 px-6 text-center font-sans">
      {/* Hero Section */}
      <section className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold text-blue-900 leading-tight mb-4">
          Automate Your Tax Season.
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Upload sales, receipts, and bank statements. We’ll auto-match, flag gaps, and generate tax-ready reports.
        </p>
        <a
          href="/dashboard"
          className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition duration-300"
        >
          Try It Free — No Credit Card
        </a>
      </section>

      {/* Drag & Drop Upload Simulation */}
      <section
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`mt-16 border-4 border-dashed transition-all duration-300 ${
          dragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white'
        } rounded-xl max-w-xl mx-auto py-20 px-6`}
      >
        <div>
          <p className="text-xl font-semibold text-gray-700">
            📥 Drag & Drop Your Sales Report Here
          </p>
          <p className="text-sm text-gray-500 mt-1">CSV, Excel, PDF, or images — we support them all.</p>
          {fileName && (
            <p className="mt-4 text-green-600 font-medium">✅ Uploaded: {fileName}</p>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto mt-24 px-4 grid md:grid-cols-3 gap-10 text-left">
        {[
          {
            icon: '📤',
            title: 'Upload',
            desc: 'Drop your sales logs, receipts, and bank statements. We support PDF, CSV, Excel, and images.'
          },
          {
            icon: '🤖',
            title: 'Auto-Match',
            desc: 'AI matches your sales with bank deposits and receipts — forget the spreadsheets.'
          },
          {
            icon: '📄',
            title: 'Download Tax Report',
            desc: 'Generate clean, tax-ready PDFs. Send to your accountant or file directly.'
          }
        ].map((step, idx) => (
          <div key={idx}>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              {step.icon} {step.title}
            </h3>
            <p className="text-gray-600 text-sm">{step.desc}</p>
          </div>
        ))}
      </section>

      {/* Animated Matching Flow */}
      <section className="mt-24">
        <MatchingFlow />
      </section>
    </main>
  );
}
