import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary: "bg-primary-800 text-white hover:bg-primary-900",
  outline: "border border-primary-800/40 text-primary-800 hover:bg-primary-50",
  light: "bg-white text-ink hover:bg-primary-100",
  ghost: "border border-white/30 text-white hover:bg-white/10",
};

const sizes = {
  md: "px-6 py-3 md:px-8 text-lg",
  sm: "px-5 py-2 text-base",
  lg: "px-8 py-3 text-base sm:px-10 sm:py-4 sm:text-xl",
};

type Props = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export default function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: Props) {
  return (
    <Link
      className={`inline-flex items-center justify-center rounded-full transition duration-300 ease-soft motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
