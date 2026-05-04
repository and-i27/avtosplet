"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AdminStats = {
  users: number;
  vehicles: number;
  messages: number;
  admins: number;
};

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
  providers?: string[];
};

type AdminVehicle = {
  _id: string;
  price: number;
  year: number;
  _createdAt: string;
  brand?: { name: string };
  model?: { name: string };
  user?: { _id: string; name: string; email: string };
};

type AdminMessage = {
  _id: string;
  subject: string;
  createdAt: string;
  sender?: { name: string };
  recipient?: { name: string };
  vehicle?: {
    _id: string;
    brand?: { name: string };
    model?: { name: string };
  };
};

type AdminOverview = {
  stats: AdminStats;
  users: AdminUser[];
  vehicles: AdminVehicle[];
  messages: AdminMessage[];
};

export default function AdminPanel() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  async function loadData() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/overview");
      const overview = await res.json();

      if (!res.ok) {
        setFeedback(overview.error ?? "Failed to load admin data.");
        return;
      }

      setData(overview);
      setFeedback("");
    } catch (error) {
      console.error(error);
      setFeedback("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleRoleChange(userId: string, role: "user" | "admin") {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const data = await res.json();
        setFeedback(data.error ?? "Failed to update user role.");
        return;
      }

      await loadData();
      setFeedback("User role updated.");
    } catch (error) {
      console.error(error);
      setFeedback("Failed to update user role.");
    }
  }

  async function handleVehicleDelete(vehicleId: string) {
    if (!confirm("Delete this vehicle?")) return;

    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`, { method: "DELETE" });
      const result = await res.json();

      if (!res.ok) {
        setFeedback(result.error ?? "Failed to delete vehicle.");
        return;
      }

      await loadData();
      setFeedback("Vehicle deleted.");
    } catch (error) {
      console.error(error);
      setFeedback("Failed to delete vehicle.");
    }
  }

  async function handleMessageDelete(messageId: string) {
    if (!confirm("Delete this message?")) return;

    try {
      const res = await fetch(`/api/messages/${messageId}`, { method: "DELETE" });
      const result = await res.json();

      if (!res.ok) {
        setFeedback(result.error ?? "Failed to delete message.");
        return;
      }

      await loadData();
      setFeedback("Message deleted.");
    } catch (error) {
      console.error(error);
      setFeedback("Failed to delete message.");
    }
  }

  if (loading) {
    return <p className="mt-10 text-center">Loading admin panel...</p>;
  }

  if (!data) {
    return <p className="mt-10 text-center">{feedback || "Admin data unavailable."}</p>;
  }

  const statCards = [
    { label: "Users", value: data.stats.users },
    { label: "Admins", value: data.stats.admins },
    { label: "Vehicles", value: data.stats.vehicles },
    { label: "Recent Messages", value: data.stats.messages },
  ];

  function formatProviders(providers?: string[]) {
    const unique = Array.from(new Set((providers ?? []).filter(Boolean)));
    return unique.length > 0 ? unique.join(", ") : "-";
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-sm text-gray-600">Manage users, vehicles and recent platform activity.</p>
        {feedback && <p className="mt-2 text-sm text-blue-700">{feedback}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Users</h2>
        </div>
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Providers</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-3">{user.name || "Unknown"}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{formatProviders(user.providers)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role ?? "user"}
                      onChange={(e) => handleRoleChange(user._id, e.target.value as "user" | "admin")}
                      className="rounded border px-3 py-2"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Vehicles</h2>
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.vehicles.map((vehicle) => (
                <tr key={vehicle._id} className="border-t">
                  <td className="px-4 py-3">
                    {vehicle.brand?.name} {vehicle.model?.name}
                  </td>
                  <td className="px-4 py-3">{vehicle.user?.name || vehicle.user?.email || "Unknown"}</td>
                  <td className="px-4 py-3">{vehicle.year}</td>
                  <td className="px-4 py-3">EUR {vehicle.price}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
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
                        onClick={() => handleVehicleDelete(vehicle._id)}
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Recent Messages</h2>
        <div className="space-y-3">
          {data.messages.length === 0 ? (
            <p className="rounded-xl border bg-white p-4">No recent messages.</p>
          ) : (
            data.messages.map((message) => (
              <div key={message._id} className="rounded-xl border bg-white p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{message.subject}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleMessageDelete(message._id)}
                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {message.sender?.name || "Unknown"} {"->"} {message.recipient?.name || "Unknown"}
                </p>
                {message.vehicle?._id && (
                  <Link
                    href={`/vehicle/${message.vehicle._id}`}
                    className="mt-1 inline-block text-sm text-blue-600 hover:underline"
                  >
                    {message.vehicle.brand?.name} {message.vehicle.model?.name}
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
