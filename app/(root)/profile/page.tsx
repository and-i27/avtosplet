// user profile page

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

type Vehicle = {
  _id: string;
  brand: { name: string };
  model: { name: string };
  year: number;
  price: number;
  images?: { asset: { url: string } }[];
};

type Message = {
  _id: string;
  subject: string;
  body: string;
  createdAt: string;
  vehicle?: {
    _id: string;
    brand?: { name: string };
    model?: { name: string };
  };
  sender?: {
    _id: string;
    name: string;
    email: string;
  };
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      if (!session?.user?.id) return;

      try {
        const [vehiclesRes, messagesRes] = await Promise.all([
          fetch("/api/vehicles/my", {
            headers: { "x-user-id": session.user.id },
          }),
          fetch("/api/messages/my"),
        ]);

        const vehiclesData = await vehiclesRes.json();
        const messagesData = await messagesRes.json();

        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
        setMessages(Array.isArray(messagesData) ? messagesData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [session?.user?.id]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setVehicles((prev) => prev.filter((vehicle) => vehicle._id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  if (!session?.user) return <p className="mt-10 text-center">You must be logged in.</p>;
  if (loading) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="rounded border p-4">
        <h1 className="mb-2 text-2xl font-bold">{session.user.name}</h1>
        <p className="text-sm text-gray-600">{session.user.email}</p>
        <Link
          href="/profile/edit"
          className="mt-4 inline-block rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Uredi profil
        </Link>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">My Vehicles</h2>
        {vehicles.length === 0 ? (
          <p>You have not added any vehicles yet.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <li key={vehicle._id} className="space-y-3 rounded border p-4">
                <Link href={`/vehicle/${vehicle._id}`} className="block space-y-2">
                  {vehicle.images?.[0]?.asset?.url && (
                    <Image
                      src={vehicle.images[0].asset.url}
                      alt={`${vehicle.brand.name} ${vehicle.model.name}`}
                      width={96}
                      height={96}
                      className="h-48 w-full rounded object-cover"
                    />
                  )}
                  <h3 className="text-lg font-semibold transition hover:text-blue-600">
                    {vehicle.brand.name} {vehicle.model.name}
                  </h3>
                  <p>Year: {vehicle.year}</p>
                  <p>Price: EUR {vehicle.price}</p>
                </Link>

                <div className="mt-2 flex gap-2">
                  <Link
                    href={`/vehicle/${vehicle._id}`}
                    className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                  >
                    View
                  </Link>
                  <Link
                    href={`/vehicle/edit/${vehicle._id}`}
                    className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(vehicle._id)}
                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Messages</h2>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message._id} className="rounded border p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold">{message.subject}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  From: {message.sender?.name} ({message.sender?.email})
                </p>
                {message.vehicle?._id && (
                  <Link
                    href={`/vehicle/${message.vehicle._id}`}
                    className="mt-1 inline-block text-sm text-blue-600 hover:underline"
                  >
                    {message.vehicle.brand?.name} {message.vehicle.model?.name}
                  </Link>
                )}
                <p className="mt-3 whitespace-pre-wrap text-gray-800">{message.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
