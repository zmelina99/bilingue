"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  label: string;
  items: { href: string; label: string }[];
};

export default function MainNav({ label, items }: Props) {
  const pathname = usePathname();

  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-5 lg:gap-8">
        {items.map(({ href, label }) => {
          // Section pages (e.g. /editing/rates) keep their parent tab active.
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded py-1 whitespace-nowrap transition-colors duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-primary-800 after:transition-transform after:duration-300 after:ease-soft hover:text-foreground hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                  active
                    ? "font-medium text-foreground after:scale-x-100"
                    : "text-secondary after:scale-x-0"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
