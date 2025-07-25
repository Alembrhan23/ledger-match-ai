'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.signOut().then(() => {
      setTimeout(() => router.push('/'), 2500);
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div className="max-w-md">
        <h2 className="text-3xl font-bold text-red-600 mb-4">👋 Logged out successfully</h2>
        <p className="text-gray-600">Thanks for using LedgerMatch. We’ll see you next tax cycle!</p>
      </div>
    </div>
  );
}
