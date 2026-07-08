"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateSettingsAction } from "@/app/actions/settings";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export default function SettingsForm({
  defaultLowStockThreshold,
}: {
  defaultLowStockThreshold: number;
}) {
  const [state, formAction] = useFormState(updateSettingsAction, undefined);

  return (
    <form action={formAction} className="card p-6 space-y-4 max-w-md">
      {state?.error && (
        <p className="text-sm text-warn bg-[#FBF0ED] border border-[#E2C3B8] rounded-md px-3 py-2">
          {state.error}
        </p>
      )}
      {!state?.error && state !== undefined && (
        <p className="text-sm text-signal bg-[#EAF3EF] border border-[#BFDDD2] rounded-md px-3 py-2">
          Saved.
        </p>
      )}
      <div className="space-y-1.5">
        <label className="field-label" htmlFor="defaultLowStockThreshold">
          Default low stock threshold
        </label>
        <input
          className="input max-w-[160px]"
          id="defaultLowStockThreshold"
          name="defaultLowStockThreshold"
          type="number"
          min={0}
          defaultValue={defaultLowStockThreshold}
        />
      </div>
      <SubmitButton />
    </form>
  );
}
