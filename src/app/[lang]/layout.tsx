import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { lang } from "next/root-params";
import WhatsAppButton from "@/components/WhatsAppButton";
import { locales } from "@/lib/locales";
import { isIndexable, siteUrl } from "@/lib/site";
import "../globals.css";

const title = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: { default: "Bilingue", template: "%s – Bilingue" },
  metadataBase: new URL(siteUrl),
  // Previews and local builds: keep out of search results (see lib/site.ts).
  robots: isIndexable ? undefined : { index: false, follow: false },
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  return (
    <html
      lang={await lang()}
      data-scroll-behavior="smooth"
      className={`${title.variable} h-full antialiased site`}
    >
      <body className="min-h-full flex flex-col site__body">
        <noscript>
          <style>{".reveal-item{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
