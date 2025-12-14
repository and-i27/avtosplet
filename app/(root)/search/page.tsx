import { Suspense } from "react";
import SearchClient from "./SearchClient"; // skelet za fallback

export default function SearchPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-semibold mb-6">Rezultati iskanja</h1>

      {/* Suspense obkroži client komponento */}
      <Suspense>
        <SearchClient />
      </Suspense>
    </main>
  );
}
