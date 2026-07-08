"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import type { FormState } from "./auth";

export async function updateSettingsAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();
  const raw = String(formData.get("defaultLowStockThreshold") || "");
  const value = parseInt(raw, 10);

  if (!Number.isFinite(value) || value < 0) {
    return { error: "Enter a valid non-negative number." };
  }

  await prisma.organization.update({
    where: { id: user.organizationId },
    data: { defaultLowStockThreshold: value },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { error: undefined };
}
