import { requireUser } from "@/lib/auth";
import NavBar from "@/components/NavBar";
import ProductForm from "@/components/ProductForm";
import { createProductAction } from "@/app/actions/products";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const user = await requireUser();

  return (
    <div>
      <NavBar organizationName={user.organization.name} active="products" />
      <main className="max-w-5xl mx-auto px-5 py-8 space-y-6">
        <h1 className="font-display text-2xl font-semibold">Add product</h1>
        <ProductForm action={createProductAction} submitLabel="Create product" />
      </main>
    </div>
  );
}
