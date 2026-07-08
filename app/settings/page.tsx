import { requireUser } from "@/lib/auth";
import NavBar from "@/components/NavBar";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div>
      <NavBar organizationName={user.organization.name} active="settings" />
      <main className="max-w-5xl mx-auto px-5 py-8 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">Settings</h1>
          <p className="text-slate text-sm mt-1">
            Applies to any product that doesn't have its own low stock threshold.
          </p>
        </div>
        <SettingsForm defaultLowStockThreshold={user.organization.defaultLowStockThreshold} />
      </main>
    </div>
  );
}
