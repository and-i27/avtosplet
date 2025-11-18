"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!res?.error) window.location.href = "/";
    else alert("Invalid email or password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">

        <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            className="w-full p-2 border rounded"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full p-2 border rounded"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* GitHub login */}
        <button
          onClick={() => signIn("github")}
          className="w-full mt-4 p-2 bg-black text-white rounded"
        >
      Login with GitHub
    </button>
    <p className="text-center text-sm mt-3">
  Don’t have an account?{" "}
  <a href="/login/register" className="text-blue-600 underline">
    Register
  </a>
</p>
      </div>
    </div>
  );
}
