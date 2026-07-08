"use client";

import { useState } from "react";
import Link from "next/link";
import { adjustStockAction, deleteProductAction } from "@/app/actions/products";

type Row = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  sellingPrice: number | null;
  lowStockThreshold: number;
};

export default function ProductsTable({ products }: { products: Row[] }) {
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  return (
    <div className="card">
      <div className="px-5 py-4 border-b border-line">
        <input
          className="input max-w-xs"
          placeholder="Search by name or SKU…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-slate">
          {products.length === 0 ? (
            <>
              No products yet.{" "}
              <Link href="/products/new" className="text-signal font-medium">
                Add your first one
              </Link>
              .
            </>
          ) : (
            "No products match your search."
          )}
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate border-b border-line">
              <th className="px-5 py-2.5 font-medium">Name</th>
              <th className="px-5 py-2.5 font-medium">SKU</th>
              <th className="px-5 py-2.5 font-medium">Quantity</th>
              <th className="px-5 py-2.5 font-medium">Selling price</th>
              <th className="px-5 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const isLow = p.quantity <= p.lowStockThreshold;
              return (
                <tr key={p.id} className="border-b border-line last:border-0 align-middle">
                  <td className="px-5 py-3">{p.name}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate">{p.sku}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <form action={adjustStockAction}>
                        <input type="hidden" name="productId" value={p.id} />
                        <input type="hidden" name="delta" value="-1" />
                        <button
                          type="submit"
                          className="w-6 h-6 rounded border border-line text-slate hover:bg-[#EFECE3]"
                          aria-label={`Decrease ${p.name} quantity`}
                        >
                          −
                        </button>
                      </form>
                      <span className={isLow ? "text-warn font-semibold" : ""}>
                        {p.quantity}
                      </span>
                      <form action={adjustStockAction}>
                        <input type="hidden" name="productId" value={p.id} />
                        <input type="hidden" name="delta" value="1" />
                        <button
                          type="submit"
                          className="w-6 h-6 rounded border border-line text-slate hover:bg-[#EFECE3]"
                          aria-label={`Increase ${p.name} quantity`}
                        >
                          +
                        </button>
                      </form>
                      {isLow && (
                        <span className="text-[10px] uppercase tracking-wide bg-[#FBF0ED] text-warn px-1.5 py-0.5 rounded">
                          Low
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {p.sellingPrice != null ? `$${p.sellingPrice.toFixed(2)}` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/products/${p.id}/edit`} className="btn-secondary text-xs">
                        Edit
                      </Link>
                      <form
                        action={deleteProductAction}
                        onSubmit={(e) => {
                          if (!confirm(`Delete "${p.name}"? This can't be undone.`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="productId" value={p.id} />
                        <button type="submit" className="btn-danger text-xs">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
