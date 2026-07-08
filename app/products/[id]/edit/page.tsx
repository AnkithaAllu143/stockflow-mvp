import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NavBar from "@/components/NavBar";
import ProductForm from "@/components/ProductForm";
import { updateProductAction } from "@/app/actions/products";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const user = await requireUser();

  const product = await prisma.product.findFirst({
    where: { id: params.id, organizationId: user.organizationId },
  });

  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, product.id);

  return (
    <div>
      <NavBar organizationName={user.organization.name} active="products" />
      <main className="max-w-5xl mx-auto px-5 py-8 space-y-6">
        <h1 className="font-display text-2xl font-semibold">Edit product</h1>
        <ProductForm
          action={boundAction}
          submitLabel="Save changes"
          defaults={{
            name: product.name,
            sku: product.sku,
            description: product.description,
            quantity: product.quantity,
            costPrice: product.costPrice,
            sellingPrice: product.sellingPrice,
            lowStockThreshold: product.lowStockThreshold,
          }}
        />
      </main>
    </div>
  );
}
