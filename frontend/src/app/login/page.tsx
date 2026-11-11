
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
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-card">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <span className="aws-logo" style={{ color: "#fff", fontSize: 32 }}>aws</span>
          <span style={{ color: "#aebbc9", fontSize: 13 }}>Route 53</span>
        </div>
        <h1>Sign in</h1>
        <p style={{ margin: "8px 0 28px" }}>Sign in to your Route 53 management console.</p>
        <form onSubmit={handleLogin} style={{ display: "grid", gap: 18 }}>
          <div>
            <label htmlFor="username">Username</label>
            <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </div>
          <button disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>
      </section>
    </main>
  );
}
