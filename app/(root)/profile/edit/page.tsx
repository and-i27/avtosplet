// edit profile page

"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [providers, setProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch user data on mount
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/user");
      const data: { name?: string; email?: string; providers?: string[] } = await res.json();

      setName(data.name ?? "");
      setEmail(data.email ?? "");
      setProviders(data.providers ?? []);
      setLoading(false);
    }

    // Only fetch if authenticated
    if (status === "authenticated") fetchUser();
  }, [status]);

  // Handle saved changes
  const handleSave = async () => {
    setSaving(true);
    setError("");

    const body: Record<string, string> = { name };

    // Only include changed email
    if (email && email !== session?.user?.email) {
      body.email = email;
    }

    // Check if password change is requested
    if (newPassword) {
      if (!oldPassword) {
        setError("Za spremembo gesla vnesite staro geslo.");
        setSaving(false);
        return;
      }
      body.oldPassword = oldPassword;
      body.newPassword = newPassword;
    }

    try {
      // send updated user data to the API
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      // handle response
      if (!res.ok) {
        setError(data.error ?? "Napaka pri shranjevanju.");
      } else {
        router.push("/profile");
      }
    } catch (err) {
      // handle unexpected errors
      console.error(err);
      setError("Napaka pri shranjevanju.");
    } finally {
      // stop saving state
      setSaving(false);
    }
  };

  // Render loading, unauthenticated, or form based on session status
  if (status === "loading" || loading) {
    return <p className="text-center mt-10">Loading…</p>;
  }

  if (!session?.user) {
    return <p className="text-center mt-10">Not authenticated</p>;
  }

  const githubLinked = providers.includes("github");

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Uredi profil</h1>
      {/* show error if any */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Ime</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Spremeni geslo</label>
        <input
          type="password"
          placeholder="Starо geslo"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Novo geslo"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Connect GitHub */}
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">GitHub</h2>
        {githubLinked ? (
          <p className="text-green-600">✅ GitHub povezan</p>
        ) : (
          <button
            onClick={() => signIn("github")}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Poveži GitHub
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {saving ? "Shranjujem…" : "Shrani"}
        </button>

        <button
          onClick={() => router.back()}
          className="px-6 py-2 border rounded"
        >
          Prekliči
        </button>
      </div>
    </div>
  );
}
