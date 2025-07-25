'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith('/dashboard');

  return (
    <header className={`w-full fixed top-0 left-0 z-50 ${pathname === '/' ? 'bg-transparent' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-blue-700">LedgerMatch.ai</Link>
        <nav className="space-x-6 text-sm font-medium">
          <Link href="/pricing" className="hover:text-blue-600">Pricing</Link>
          {isAuth ? (
            <Link href="/logout" className="text-red-600">Logout</Link>
          ) : (
            <Link href="/login" className="text-blue-600">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
