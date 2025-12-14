"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";

type FilterState = Record<string, string>;

type FilterOptions = {
  brands: { _id: string; name: string }[];
  models: { _id: string; name: string }[];
  colors: { _id: string; name: string }[];
  fuels: { _id: string; name: string }[];
  gearboxes: { _id: string; name: string }[];
};

export default function VehicleFilter() {
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>({
    brand: "",
    model: "",
    fuel: "",
    gearbox: "",
    color: "",
    doors: "",
    seats: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    minKm: "",
    maxKm: "",
    minKw: "",
    maxKw: "",
    minCcm: "",
    maxCcm: "",
  });

  const [options, setOptions] = useState<FilterOptions>({
    brands: [],
    models: [],
    colors: [],
    fuels: [],
    gearboxes: [],
  });

  // Fetch osnovne opcije
  useEffect(() => {
    async function fetchOptions() {
      const [brands, colors, fuels, gearboxes] = await Promise.all([
        client.fetch(`*[_type == "brand"]{_id, name}`),
        client.fetch(`*[_type == "color"]{_id, name}`),
        client.fetch(`*[_type == "fuel"]{_id, name}`),
        client.fetch(`*[_type == "gearbox"]{_id, name}`),
      ]);
      setOptions((prev) => ({ ...prev, brands, colors, fuels, gearboxes }));
    }
    fetchOptions();
  }, []);

  // Fetch modeli glede na izbrano znamko
  useEffect(() => {
    async function fetchModels() {
      if (!filters.brand) return setOptions((prev) => ({ ...prev, models: [] }));
      const models = await client.fetch(
        `*[_type == "model" && brand._ref == $brand]{_id, name}`,
        { brand: filters.brand }
      );
      setOptions((prev) => ({ ...prev, models }));
    }
    fetchModels();
  }, [filters.brand]);

  function update(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleSearch() {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim() !== "") params.set(key, value);
    });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      
      {/* Znamka */}
      <select value={filters.brand} onChange={(e) => update("brand", e.target.value)} className="input">
        <option value="">Znamka</option>
        {options.brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
      </select>

      {/* Model */}
      <select value={filters.model} onChange={(e) => update("model", e.target.value)} className="input" disabled={!filters.brand}>
        <option value="">Model</option>
        {options.models.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
      </select>

      {/* Barva */}
      <select value={filters.color} onChange={(e) => update("color", e.target.value)} className="input">
        <option value="">Barva</option>
        {options.colors.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>

      {/* Gorivo */}
      <select value={filters.fuel} onChange={(e) => update("fuel", e.target.value)} className="input">
        <option value="">Gorivo</option>
        {options.fuels.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
      </select>

      {/* Menjalnik */}
      <select value={filters.gearbox} onChange={(e) => update("gearbox", e.target.value)} className="input">
        <option value="">Menjalnik</option>
        {options.gearboxes.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
      </select>

      {/* Numeric inputi */}
      <input placeholder="Min cena" type="number" value={filters.minPrice} onChange={(e) => update("minPrice", e.target.value)} className="input"/>
      <input placeholder="Max cena" type="number" value={filters.maxPrice} onChange={(e) => update("maxPrice", e.target.value)} className="input"/>
      <input placeholder="Min letnik" type="number" value={filters.minYear} onChange={(e) => update("minYear", e.target.value)} className="input"/>
      <input placeholder="Max letnik" type="number" value={filters.maxYear} onChange={(e) => update("maxYear", e.target.value)} className="input"/>

      {/* Vrata */}
<input
  placeholder="Vrata"
  type="number"
  value={filters.doors}
  onChange={(e) => update("doors", e.target.value)}
  className="input"
/>

{/* Sedeži */}
<input
  placeholder="Sedeži"
  type="number"
  value={filters.seats}
  onChange={(e) => update("seats", e.target.value)}
  className="input"
/>

{/* Kilometri */}
<input
  placeholder="Min km"
  type="number"
  value={filters.minKm}
  onChange={(e) => update("minKm", e.target.value)}
  className="input"
/>
<input
  placeholder="Max km"
  type="number"
  value={filters.maxKm}
  onChange={(e) => update("maxKm", e.target.value)}
  className="input"
/>

{/* Moč (kW) */}
<input
  placeholder="Min kW"
  type="number"
  value={filters.minKw}
  onChange={(e) => update("minKw", e.target.value)}
  className="input"
/>
<input
  placeholder="Max kW"
  type="number"
  value={filters.maxKw}
  onChange={(e) => update("maxKw", e.target.value)}
  className="input"
/>

{/* Prostornina motorja (ccm) */}
<input
  placeholder="Min ccm"
  type="number"
  value={filters.minCcm}
  onChange={(e) => update("minCcm", e.target.value)}
  className="input"
/>
<input
  placeholder="Max ccm"
  type="number"
  value={filters.maxCcm}
  onChange={(e) => update("maxCcm", e.target.value)}
  className="input"
/>


      <button onClick={handleSearch} className="col-span-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        IŠČI
      </button>
    </div>
  );
}
