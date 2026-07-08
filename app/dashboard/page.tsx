import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NavBar from "@/components/NavBar";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();

  const products = await prisma.product.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { createdAt: "desc" },
  });

  const defaultThreshold = user.organization.defaultLowStockThreshold;
  const totalProducts = products.length;
  const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);

  const lowStock = products.filter((p) => {
    const threshold = p.lowStockThreshold ?? defaultThreshold;
    return p.quantity <= threshold;
  });

  return (
    <div>
      <NavBar organizationName={user.organization.name} active="dashboard" />
      <main className="max-w-5xl mx-auto px-5 py-8 space-y-8">
        <div>
          <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
          <p className="text-slate text-sm mt-1">
            A quick look at what's in stock for {user.organization.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card p-5">
            <div className="field-label">Total products</div>
            <div className="font-display text-3xl font-semibold mt-2">{totalProducts}</div>
          </div>
          <div className="card p-5">
            <div className="field-label">Units on hand</div>
            <div className="font-display text-3xl font-semibold mt-2">{totalUnits}</div>
          </div>
        </div>

        <div className="card">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <h2 className="font-display font-semibold">Low stock items</h2>
            <span className="text-xs text-slate">
              {lowStock.length} item{lowStock.length === 1 ? "" : "s"} at or below threshold
            </span>
          </div>
          {lowStock.length === 0 ? (
            <p className="px-5 py-8 text-sm text-slate text-center">
              Nothing is low on stock right now.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate border-b border-line">
                  <th className="px-5 py-2.5 font-medium">Name</th>
                  <th className="px-5 py-2.5 font-medium">SKU</th>
                  <th className="px-5 py-2.5 font-medium">Quantity</th>
                  <th className="px-5 py-2.5 font-medium">Threshold</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3">{p.name}</td>
                    <td className="px-5 py-3 font-mono text-xs text-slate">{p.sku}</td>
                    <td className="px-5 py-3 text-warn font-semibold">{p.quantity}</td>
                    <td className="px-5 py-3 text-slate">
                      {p.lowStockThreshold ?? defaultThreshold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
