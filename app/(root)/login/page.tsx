"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      if (!res?.error) {
        router.push("/");
      } else {
        alert(res.error || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      alert("Internal server error. Please try again later.");
    }
  };

  const handleGitHubLogin = () => {
    signIn("github");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGitHubLogin}
          className="w-full mt-4 p-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Log in with GitHub
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
