import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NavBar from "@/components/NavBar";
import ProductsTable from "./ProductsTable";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const user = await requireUser();

  const products = await prisma.product.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <NavBar organizationName={user.organization.name} active="products" />
      <main className="max-w-5xl mx-auto px-5 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">Products</h1>
            <p className="text-slate text-sm mt-1">
              {products.length} product{products.length === 1 ? "" : "s"} in your catalog.
            </p>
          </div>
          <Link href="/products/new" className="btn-primary">
            + Add product
          </Link>
        </div>

        <ProductsTable
          products={products.map((p) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            quantity: p.quantity,
            sellingPrice: p.sellingPrice,
            lowStockThreshold: p.lowStockThreshold ?? user.organization.defaultLowStockThreshold,
          }))}
        />
      </main>
    </div>
  );
}
