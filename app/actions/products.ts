"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import type { FormState } from "./auth";

function toNullableFloat(v: FormDataEntryValue | null) {
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toNullableInt(v: FormDataEntryValue | null) {
  if (v === null || v === "") return null;
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
}

export async function createProductAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();

  const name = String(formData.get("name") || "").trim();
  const sku = String(formData.get("sku") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const quantity = toNullableInt(formData.get("quantity")) ?? 0;
  const costPrice = toNullableFloat(formData.get("costPrice"));
  const sellingPrice = toNullableFloat(formData.get("sellingPrice"));
  const lowStockThreshold = toNullableInt(formData.get("lowStockThreshold"));

  if (!name || !sku) {
    return { error: "Name and SKU are required." };
  }

  const existing = await prisma.product.findUnique({
    where: { organizationId_sku: { organizationId: user.organizationId, sku } },
  });
  if (existing) {
    return { error: `SKU "${sku}" is already in use for your organization.` };
  }

  await prisma.product.create({
    data: {
      organizationId: user.organizationId,
      name,
      sku,
      description,
      quantity,
      costPrice,
      sellingPrice,
      lowStockThreshold,
      lastUpdatedBy: user.email,
    },
  });

  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/products");
}

export async function updateProductAction(
  productId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();

  const product = await prisma.product.findFirst({
    where: { id: productId, organizationId: user.organizationId },
  });
  if (!product) return { error: "Product not found." };

  const name = String(formData.get("name") || "").trim();
  const sku = String(formData.get("sku") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const quantity = toNullableInt(formData.get("quantity")) ?? 0;
  const costPrice = toNullableFloat(formData.get("costPrice"));
  const sellingPrice = toNullableFloat(formData.get("sellingPrice"));
  const lowStockThreshold = toNullableInt(formData.get("lowStockThreshold"));

  if (!name || !sku) {
    return { error: "Name and SKU are required." };
  }

  if (sku !== product.sku) {
    const clash = await prisma.product.findUnique({
      where: { organizationId_sku: { organizationId: user.organizationId, sku } },
    });
    if (clash) return { error: `SKU "${sku}" is already in use for your organization.` };
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      sku,
      description,
      quantity,
      costPrice,
      sellingPrice,
      lowStockThreshold,
      lastUpdatedBy: user.email,
    },
  });

  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/products");
}

export async function deleteProductAction(formData: FormData) {
  const user = await requireUser();
  const productId = String(formData.get("productId") || "");

  await prisma.product.deleteMany({
    where: { id: productId, organizationId: user.organizationId },
  });

  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/products");
}

export async function adjustStockAction(formData: FormData) {
  const user = await requireUser();
  const productId = String(formData.get("productId") || "");
  const delta = parseInt(String(formData.get("delta") || "0"), 10);

  const product = await prisma.product.findFirst({
    where: { id: productId, organizationId: user.organizationId },
  });
  if (!product || !Number.isFinite(delta)) {
    revalidatePath("/products");
    return;
  }

  const newQuantity = Math.max(0, product.quantity + delta);

  await prisma.product.update({
    where: { id: productId },
    data: { quantity: newQuantity, lastUpdatedBy: user.email },
  });

  revalidatePath("/products");
  revalidatePath("/dashboard");
}
