'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setErrorMsg('');
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(error.message || 'Login failed.');
    } else {
      router.push('/dashboard');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center px-6">
      <div className="w-full max-w-6xl flex shadow-2xl rounded-xl overflow-hidden border border-blue-100 bg-white">
        {/* Left Branding Panel */}
        <div className="hidden lg:flex w-1/2 bg-blue-800 text-white flex-col justify-center items-center px-12 py-20">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">LedgerMatch.ai</h1>
          <p className="text-xl text-blue-100 leading-relaxed text-center">
            Upload. Match. Reconcile.  
            <br />Your virtual tax assistant for small business.
          </p>
        </div>

        {/* Right Form Panel */}
        <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-10 text-center">Sign In</h2>

          {errorMsg && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6 text-lg text-center">
              {errorMsg}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Email</label>
              <input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
  placeholder="you@example.com"
/>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Password</label>
              <input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full px-5 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
  placeholder="••••••••"/>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full px-5 py-4 rounded-lg text-lg font-semibold text-white transition ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <p className="text-sm text-center text-gray-500 mt-10">
            © {new Date().getFullYear()} LedgerMatch.ai — All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
