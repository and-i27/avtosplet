// search page - server component with suspense for client component

import { Suspense } from "react";
import SearchClient from "./SearchClient"; // skelet za fallback
import Link from 'next/link'

export default function SearchPage() {
  return (
    <main className="min-h-screen p-8">
      <Link href="/">Home</Link>
      <h1 className="text-3xl font-semibold mb-6">Rezultati iskanja</h1>

      {/* Suspense obkroži client komponento */}
      <Suspense>
        <SearchClient />
      </Suspense>
    </main>
  );
}
