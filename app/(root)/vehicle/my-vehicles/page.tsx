"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { client } from "@/sanity/lib/client";
import Link from "next/link";

type Vehicle = {
  _id: string;
  brand: { name: string };
  model: { name: string };
  year: number;
  price: number;
  images?: { asset: { url: string } }[];
};

export default function MyVehiclesPage() {
  const { data: session } = useSession();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicles() {
      if (!session?.user?.id) return;
      const results: Vehicle[] = await client.fetch(
        `*[_type=="vehicle" && user._ref == $userId]{
          _id,
          brand->{name},
          model->{name},
          year,
          price,
          images[]{asset->{url}}
        }`,
        { userId: session.user.id }
      );
      setVehicles(results);
      setLoading(false);
    }
    fetchVehicles();
  }, [session?.user?.id]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    await client.delete(id);
    setVehicles(prev => prev.filter(v => v._id !== id));
  };

  if (!session?.user) {
    return <p className="text-center mt-10">You must be logged in to view your vehicles.</p>;
  }

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Vehicles</h1>

      {vehicles.length === 0 ? (
        <p>You have not added any vehicles yet.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(vehicle => (
            <li key={vehicle._id} className="border rounded p-4 space-y-2">
              {vehicle.images?.[0]?.asset.url && (
                <img src={vehicle.images[0].asset.url} alt={`${vehicle.brand.name} ${vehicle.model.name}`} className="w-full h-48 object-cover rounded"/>
              )}
              <h2 className="text-lg font-semibold">{vehicle.brand.name} {vehicle.model.name}</h2>
              <p>Year: {vehicle.year}</p>
              <p>Price: €{vehicle.price}</p>
              <div className="flex gap-2 mt-2">
                <Link href={`/vehicle/edit/${vehicle._id}`} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                  Edit
                </Link>
                <button onClick={() => handleDelete(vehicle._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
