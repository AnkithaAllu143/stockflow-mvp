"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card p-8 max-w-sm text-center space-y-4">
        <h1 className="font-display text-xl font-semibold">Something went wrong</h1>
        <p className="text-slate text-sm">
          Try again, or head back and sign in.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button className="btn-primary" onClick={() => reset()}>
            Try again
          </button>
          <a className="btn-secondary" href="/login">
            Go to login
          </a>
        </div>
      </div>
    </main>
  );
}
