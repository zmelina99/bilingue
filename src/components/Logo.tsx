import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/brand/logo.png";
import { brand } from "@/data/business";
import { getDictionary, getLocale } from "@/lib/dictionaries";

// Mark + wordmark. The descriptor is part of the business name, so it stays in German.
export default async function Logo({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const lang = await getLocale();
  const { header } = await getDictionary();

  return (
    <Link
      href={`/${lang}`}
      aria-label={`${brand.name} – ${header.homeLabel}`}
      className={`group inline-flex items-center gap-2.5 rounded sm:gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground ${className}`}
    >
      <Image
        src={logo}
        alt=""
        height={40}
        className={`h-10 w-auto transition-transform ${tone === "light" ? "brightness-0 invert" : ""} duration-500 ease-soft motion-safe:group-hover:-rotate-6`}
      />
      <span className="flex flex-col leading-none">
        <span className={`text-2xl font-bold tracking-tight ${tone === "light" ? "text-white" : "text-foreground"}`}>
          {brand.name}
        </span>
        <span className={`mt-1.5 hidden text-[0.625rem] tracking-[0.18em] whitespace-nowrap uppercase lg:block ${tone === "light" ? "text-white/60" : "text-secondary"}`}>
          {brand.descriptor}
        </span>
      </span>
    </Link>
  );
}
