"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/dashboard", // where to go after sign in
        rememberMe: true,          // keep user logged in
      },
      {
        onRequest: () => {
          setSuccess("Signing in...");
        },
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      }
    );
  }

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="bg-ring p-10 rounded shadow w-full max-w-sm">
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            className="w-full mb-4 p-2 border rounded bg-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            className="w-full mb-4 p-2 border rounded bg-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded font-semibold">
            Sign In
          </button>
          {error && <p className="text-red-600 mt-4">{error}</p>}
          {success && <p className="text-green-600 mt-4">{success}</p>}
        </form>
      </main>
    </>
  );
}
