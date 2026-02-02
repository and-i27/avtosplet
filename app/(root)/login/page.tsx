// Login page

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
      // use next-auth signIn method for credentials
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      // handle response
      if (!res?.error) {
        router.push("/"); // redirect after successful login
        router.refresh(); // refresh to update navbar component
      } else {
        alert(res.error || "Invalid email or password");
      }
    } catch (err) {
      // handle unexpected errors
      console.error("Login error:", err);
      setLoading(false);
      alert("Internal server error. Please try again later.");
    }
  };

  const handleGitHubLogin = () => {
    // use next-auth signIn method for GitHub
    signIn("github", {
      redirect: true,
      redirectTo: "/",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>
        {/* login form */}
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
          Don't have an account?{" "}
          <a href="/login/register" className="text-blue-600 underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
