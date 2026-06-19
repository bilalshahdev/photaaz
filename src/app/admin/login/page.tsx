"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminSessionStorageKey } from "@/lib/admin-session";
import { adminCredentials } from "@/data/platform-admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>(adminCredentials.email);
  const [password, setPassword] = useState<string>(adminCredentials.password);
  const [error, setError] = useState("");

  function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (email === adminCredentials.email && password === adminCredentials.password) {
      localStorage.setItem(adminSessionStorageKey, "true");
      router.replace("/admin");
      return;
    }

    setError("Invalid super admin credentials.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <section className="w-full max-w-xl border border-slate-200 bg-white p-6 shadow-2xl shadow-black/30">
        <LockKeyhole className="size-7 text-teal-700" aria-hidden="true" />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Super Admin Login</p>
        <h1 className="mt-3 font-display text-4xl font-black tracking-[-0.04em]">Platform control access.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Demo credentials: <strong>{adminCredentials.email}</strong> / <strong>{adminCredentials.password}</strong>
        </p>

        <form onSubmit={login} className="mt-6 grid gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-11 w-full border border-slate-200 px-3 outline-none focus:border-teal-700" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="mt-2 h-11 w-full border border-slate-200 px-3 outline-none focus:border-teal-700" />
          </label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <Button type="submit" className="rounded-none bg-slate-950 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-teal-800">
            Sign in
          </Button>
        </form>
      </section>
    </main>
  );
}
