"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, undefined);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-display text-2xl font-semibold text-ink">StockFlow</div>
          <p className="text-slate text-sm mt-1">Inventory, without the overhead.</p>
        </div>
        <form action={formAction} className="card p-6 space-y-4">
          <h1 className="font-display text-xl font-semibold">Sign in</h1>
          {state?.error && (
            <p className="text-sm text-warn bg-[#FBF0ED] border border-[#E2C3B8] rounded-md px-3 py-2">
              {state.error}
            </p>
          )}
          <div className="space-y-1.5">
            <label className="field-label" htmlFor="email">Email</label>
            <input className="input" id="email" name="email" type="email" required autoFocus />
          </div>
          <div className="space-y-1.5">
            <label className="field-label" htmlFor="password">Password</label>
            <input className="input" id="password" name="password" type="password" required />
          </div>
          <SubmitButton />
          <p className="text-sm text-slate text-center">
            No account?{" "}
            <Link href="/signup" className="text-signal font-medium">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
