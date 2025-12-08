"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert("Registration successful! You can now log in.");
        router.push("/login");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setLoading(false);
      alert("Internal server error. Please try again later.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-10 p-6 border rounded shadow"
    >
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <p className="text-center text-sm mt-3">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 underline">
          Log in
        </a>
      </p>
    </form>
  );
}
