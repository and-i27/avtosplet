"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Vehicle = {
  _id: string;
  brand: { name: string };
  model: { name: string };
  year: number;
  price: number;
  images?: { asset: { url: string } }[];
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------- FETCH VEHICLES ---------- */
  useEffect(() => {
    async function fetchVehicles() {
      if (!session?.user?.id) return;

      try {
        const res = await fetch("/api/vehicles/my");
        const data = await res.json();

        // varnost: preverimo, da je data array
        setVehicles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, [session?.user?.id]);

  /* ---------- DELETE VEHICLE ---------- */
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      setVehicles(prev => prev.filter(v => v._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  if (!session?.user) {
    return <p className="text-center mt-10">You must be logged in.</p>;
  }

  if (loading) {
    return <p className="text-center mt-10">Loading…</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* ---------- USER INFO ---------- */}
      <div className="border rounded p-4">
        <h1 className="text-2xl font-bold mb-2">{session.user.name}</h1>
        <p className="text-sm text-gray-600">{session.user.email}</p>
        <Link
          href="/vehicle/create"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Vehicle
        </Link>
      </div>

      {/* ---------- USER VEHICLES ---------- */}
      <div>
        <h2 className="text-xl font-bold mb-4">My Vehicles</h2>

        {vehicles.length === 0 ? (
          <p>You have not added any vehicles yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map(vehicle => (
              <li key={vehicle._id} className="border rounded p-4 space-y-2">
                {vehicle.images?.[0]?.asset?.url && (
                  <img
                    src={vehicle.images[0].asset.url}
                    alt={`${vehicle.brand.name} ${vehicle.model.name}`}
                    className="w-full h-48 object-cover rounded"
                  />
                )}
                <h3 className="text-lg font-semibold">
                  {vehicle.brand.name} {vehicle.model.name}
                </h3>
                <p>Year: {vehicle.year}</p>
                <p>Price: €{vehicle.price}</p>
                <div className="flex gap-2 mt-2">
                  <Link
                    href={`/vehicle/edit/${vehicle._id}`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(vehicle._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
