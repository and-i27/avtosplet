// client component for rendering search results

"use client";

import { useState, useEffect, useMemo } from "react";
import { client } from "@/sanity/lib/client";
import { useSearchParams } from "next/navigation";
import VehicleCard, { VehicleTypeCard } from "@/app/components/VehicleCard";

// Raw vehicle type from Sanity
type RawVehicle = {
  _id: string;
  views?: number;
  price: number;
  year: number;
  kilometers?: number;
  brand?: { _id: string; name?: string };
  model?: { _id: string; name?: string };
  color?: { _id: string; name?: string };
  fuel?: { _id: string; name?: string };
  gearbox?: { _id: string; name?: string };
  images?: { asset: { url: string } }[];
  user?: { _id: string; name?: string; email: string; };
};

export default function SearchClient() {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<VehicleTypeCard[]>([]);

  // Memoize search parameters
  const params = useMemo(() => ({
    brand: searchParams.get("brand") || "",
    model: searchParams.get("model") || "",
    fuel: searchParams.get("fuel") || "",
    gearbox: searchParams.get("gearbox") || "",
    color: searchParams.get("color") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minYear: searchParams.get("minYear") || "",
    maxYear: searchParams.get("maxYear") || "",
    minKm: searchParams.get("minKm") || "",
    maxKm: searchParams.get("maxKm") || "",
    minKw: searchParams.get("minKw") || "",
    maxKw: searchParams.get("maxKw") || "",
    minCcm: searchParams.get("minCcm") || "",
    maxCcm: searchParams.get("maxCcm") || "",
    doors: searchParams.get("doors") || "",
    seats: searchParams.get("seats") || "",
  }), [searchParams]);

  // Fetch vehicles when search parameters change
  useEffect(() => {
    async function fetchVehicles() {
      // Build GROQ query with filters
      const query = `*[_type == "vehicle"
        ${params.brand ? `&& brand._ref == "${params.brand}"` : ""}
        ${params.model ? `&& model._ref == "${params.model}"` : ""}
        ${params.fuel ? `&& fuel._ref == "${params.fuel}"` : ""}
        ${params.gearbox ? `&& gearbox._ref == "${params.gearbox}"` : ""}
        ${params.color ? `&& color._ref == "${params.color}"` : ""}
        ${params.minPrice ? `&& price >= ${params.minPrice}` : ""}
        ${params.maxPrice ? `&& price <= ${params.maxPrice}` : ""}
        ${params.minYear ? `&& year >= ${params.minYear}` : ""}
        ${params.maxYear ? `&& year <= ${params.maxYear}` : ""}
        ${params.minKm ? `&& kilometers >= ${params.minKm}` : ""}
        ${params.maxKm ? `&& kilometers <= ${params.maxKm}` : ""}
        ${params.minKw ? `&& powerKW >= ${params.minKw}` : ""}
        ${params.maxKw ? `&& powerKW <= ${params.maxKw}` : ""}
        ${params.minCcm ? `&& engineSize >= ${params.minCcm}` : ""}
        ${params.maxCcm ? `&& engineSize <= ${params.maxCcm}` : ""}
        ${params.doors ? `&& doors == ${params.doors}` : ""}
        ${params.seats ? `&& seats == ${params.seats}` : ""}
        ]{
          _id,
          views,
          price,
          year,
          kilometers,
          engineSize,
          powerKW,
          doors,
          seats,
          brand->{_id, name},
          model->{_id, name},
          color->{_id, name},
          fuel->{_id, name},
          gearbox->{_id, name},
          images[]{asset->{url}},
          user->{_id, name, email}
      }`;

      // Fetch data from Sanity
      const results: RawVehicle[] = await client.fetch(query);

      // Map raw data to VehicleTypeCard
      const mapped: VehicleTypeCard[] = results.map(v => ({
        _id: v._id,
        views: v.views || 0,
        user: {
          _id: v.user?._id || "unknown",
          name: v.user?.name || "Unknown",
          email: v.user?.email || "Unknown"
        },
        brand: v.brand?.name || "N/A",
        model: v.model?.name || "N/A",
        price: v.price,
        year: v.year,
        kilometers: v.kilometers || 0,
        fuel: v.fuel?.name || "N/A",
        gearbox: v.gearbox?.name || "N/A",
        images: v.images,
      }));

      setVehicles(mapped);
    }

    fetchVehicles();
  }, [params]);

  return (
    <div>
      {/* Show results based on search: */}
      {vehicles.length === 0 ? (
        <p>Ni rezultatov.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(v => (
            <VehicleCard key={v._id} post={v} />
          ))}
        </ul>
      )}
    </div>
  );
}
