"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Leaf, Mail, Lock, ArrowRight } from "lucide-react";

export default function ConsumerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    window.location.href = "/consumer";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4">
      <div className="w-full max-w-md">
        {/* LOGO */}
        <Link
          href="/consumer"
          className="mb-8 flex justify-center"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-xl">
              🌱
            </div>

            <div>
              <div className="text-xl font-extrabold text-green-700">
                FasalSetu
              </div>

              <div className="text-[10px] text-gray-500">
                Farm to your home
              </div>
            </div>
          </div>
        </Link>

        {/* CARD */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-extrabold text-gray-900">
              Welcome back 👋
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Login to continue shopping fresh produce.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white"
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* LOGIN */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}

              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          {/* REGISTER */}
          <div className="mt-6 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
             dont have an account?
            </p>

            <Link
              href="/consumer/register"
              className="mt-1 inline-block text-sm font-bold text-green-600 hover:underline"
            >
              Create consumer account
            </Link>
          </div>
        </div>

        {/* FARMER */}
        <div className="mt-5 text-center">
          <Link
            href="/farmer/login"
            className="text-xs font-semibold text-gray-500 hover:text-green-600"
          >
            Are you a farmer? Login here
          </Link>
        </div>
      </div>
    </main>
  );
}