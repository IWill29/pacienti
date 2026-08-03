"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/pirmreizejais-pacients", label: "Pirmreizējais pacients" },
  { href: "/protokols", label: "Protokols (uzn.nod.1)" },
] as const;

export function FormNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Formu navigācija"
      className="flex flex-wrap gap-2 rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-[0_4px_20px_-2px_rgb(0_0_0_/_0.08)]"
    >
      {links.map((link) => {
        const active = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
