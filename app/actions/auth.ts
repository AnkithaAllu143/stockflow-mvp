"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";

export type FormState = { error?: string } | undefined;

export async function signupAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const organizationName = String(formData.get("organizationName") || "").trim();

  if (!email || !password || !organizationName) {
    return { error: "All fields are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const organization = await prisma.organization.create({
    data: { name: organizationName },
  });

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, organizationId: organization.id },
  });

  await createSession({
    userId: user.id,
    organizationId: organization.id,
    email: user.email,
  });

  redirect("/dashboard");
}

export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await createSession({
    userId: user.id,
    organizationId: user.organizationId,
    email: user.email,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
