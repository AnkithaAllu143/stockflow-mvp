import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";

export default function NavBar({
  organizationName,
  active,
}: {
  organizationName: string;
  active: "dashboard" | "products" | "settings";
}) {
  const links = [
    { href: "/dashboard", label: "Dashboard", key: "dashboard" },
    { href: "/products", label: "Products", key: "products" },
    { href: "/settings", label: "Settings", key: "settings" },
  ] as const;

  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-display font-semibold text-lg">StockFlow</span>
          <nav className="flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active === l.key
                    ? "bg-ink text-paper"
                    : "text-slate hover:bg-[#EFECE3]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate hidden sm:inline">{organizationName}</span>
          <form action={logoutAction}>
            <button className="btn-secondary text-sm" type="submit">
              Log out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
