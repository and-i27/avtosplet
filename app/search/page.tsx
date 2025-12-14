import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-semibold mb-6">Najdi vozilo</h1>
      <SearchClient /> {/* Client komponenta */}
    </div>
  );
}
