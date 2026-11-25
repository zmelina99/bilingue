/* eslint-disable @typescript-eslint/no-unused-vars -- Link-only props are dropped on plain anchors */
import Link from "next/link";
import type { ComponentProps } from "react";

// Same-page hash links (e.g. "#contact") are plain native anchors, so the
// browser scrolls to the target and applies `scroll-margin-top`; the Next router
// stays out of it. Everything else is a normal <Link>.
export default function AppLink({
  href,
  prefetch: _prefetch,
  replace: _replace,
  scroll: _scroll,
  shallow: _shallow,
  passHref: _passHref,
  legacyBehavior: _legacy,
  locale: _locale,
  ...props
}: ComponentProps<typeof Link>) {
  if (typeof href === "string" && href.startsWith("#")) {
    return <a href={href} {...props} />;
  }
  return <Link href={href} {...props} />;
}
