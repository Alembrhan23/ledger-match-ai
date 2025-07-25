export default function Footer() {
  return (
    <footer className="bg-white border-t py-10 mt-20 text-center text-sm text-gray-500">
      <p>© {new Date().getFullYear()} LedgerMatch.ai — Built for Small Businesses.</p>
      <p className="mt-2 text-xs">Join 1,000+ businesses reconciling sales, receipts, and tax in minutes.</p>
    </footer>
  );
}
