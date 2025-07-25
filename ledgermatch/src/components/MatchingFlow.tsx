'use client'
import { useEffect, useState } from 'react';

export default function MatchingFlow() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % 5);
    }, 1500); // updates every 1.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-24 text-center">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">How LedgerMatch Works</h2>
      <div className="flex justify-center items-center space-x-6 transition-all">
        {/* Step 1: Sales */}
        <div className={`transition-opacity duration-500 ${stage >= 0 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-white shadow p-4 rounded-lg w-36">
            <p className="text-blue-600 font-bold">Sales Report</p>
            <p className="text-xs text-gray-500">CSV / Excel</p>
          </div>
        </div>

        {/* Step 2: Bank */}
        <div className={`transition-opacity duration-500 ${stage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-white shadow p-4 rounded-lg w-36">
            <p className="text-green-600 font-bold">Bank Statement</p>
            <p className="text-xs text-gray-500">Deposits</p>
          </div>
        </div>

        {/* Step 3: Receipts */}
        <div className={`transition-opacity duration-500 ${stage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-white shadow p-4 rounded-lg w-36">
            <p className="text-purple-600 font-bold">Receipts</p>
            <p className="text-xs text-gray-500">OCR Scanned</p>
          </div>
        </div>

        {/* Step 4: AI Match */}
        <div className={`transition-transform duration-500 ${stage >= 3 ? 'scale-100' : 'scale-90 opacity-50'}`}>
          <div className="bg-blue-600 text-white p-4 rounded-lg w-36">
            <p className="font-bold">AI Matching</p>
            <p className="text-xs text-blue-100">Sales ↔ Deposits</p>
          </div>
        </div>

        {/* Step 5: Tax Report */}
        <div className={`transition-opacity duration-500 ${stage === 4 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-white border-2 border-green-600 text-green-700 p-4 rounded-lg w-36">
            <p className="font-bold">Tax Report</p>
            <p className="text-xs">✅ Ready to File</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400 mt-4">Step {stage + 1} of 5</p>
    </div>
  );
}
