
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      toast.success("Login successful!");
      router.push("/hosted-zones");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#232f3e] p-5">
      <div className="bg-white rounded-xl p-10 w-full max-w-md shadow-xl">
        <h1 className="text-3xl font-bold text-[#232f3e] mb-2">
          AWS Route 53
        </h1>

        <p className="text-gray-500 mb-8">
          Sign in to your management console
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold">
              Username
            </label>
            <input
              className="w-full border rounded-md p-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              Password
            </label>
            <input
              type="password"
              className="w-full border rounded-md p-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#ff9900] p-3 rounded-md font-bold text-[#232f3e] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

