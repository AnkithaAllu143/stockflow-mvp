"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import type { FormState } from "@/app/actions/auth";

type Defaults = {
  name?: string;
  sku?: string;
  description?: string | null;
  quantity?: number;
  costPrice?: number | null;
  sellingPrice?: number | null;
  lowStockThreshold?: number | null;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export default function ProductForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  defaults?: Defaults;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction} className="card p-6 space-y-5 max-w-xl">
      {state?.error && (
        <p className="text-sm text-warn bg-[#FBF0ED] border border-[#E2C3B8] rounded-md px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 col-span-2 sm:col-span-1">
          <label className="field-label" htmlFor="name">Name</label>
          <input
            className="input"
            id="name"
            name="name"
            defaultValue={defaults?.name}
            required
            autoFocus
          />
        </div>
        <div className="space-y-1.5 col-span-2 sm:col-span-1">
          <label className="field-label" htmlFor="sku">SKU</label>
          <input className="input" id="sku" name="sku" defaultValue={defaults?.sku} required />
        </div>

        <div className="space-y-1.5 col-span-2">
          <label className="field-label" htmlFor="description">Description (optional)</label>
          <textarea
            className="input"
            id="description"
            name="description"
            rows={3}
            defaultValue={defaults?.description ?? ""}
          />
        </div>

        <div className="space-y-1.5">
          <label className="field-label" htmlFor="quantity">Quantity on hand</label>
          <input
            className="input"
            id="quantity"
            name="quantity"
            type="number"
            min={0}
            defaultValue={defaults?.quantity ?? 0}
          />
        </div>
        <div className="space-y-1.5">
          <label className="field-label" htmlFor="lowStockThreshold">
            Low stock threshold (optional)
          </label>
          <input
            className="input"
            id="lowStockThreshold"
            name="lowStockThreshold"
            type="number"
            min={0}
            defaultValue={defaults?.lowStockThreshold ?? ""}
            placeholder="Uses org default if empty"
          />
        </div>

        <div className="space-y-1.5">
          <label className="field-label" htmlFor="costPrice">Cost price (optional)</label>
          <input
            className="input"
            id="costPrice"
            name="costPrice"
            type="number"
            step="0.01"
            min={0}
            defaultValue={defaults?.costPrice ?? ""}
          />
        </div>
        <div className="space-y-1.5">
          <label className="field-label" htmlFor="sellingPrice">Selling price (optional)</label>
          <input
            className="input"
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            step="0.01"
            min={0}
            defaultValue={defaults?.sellingPrice ?? ""}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton label={submitLabel} />
        <Link href="/products" className="btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
