import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { lang } from "next/root-params";
import WhatsAppButton from "@/components/WhatsAppButton";
import { locales } from "@/lib/locales";
import { isIndexable, siteUrl } from "@/lib/site";
import "../globals.css";

const title = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

// Body text: a humanist sans that sits calmly beside Cormorant (variable font,
// one file per style).
const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
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
      className={`${title.variable} ${body.variable} h-full antialiased site`}
    >
      <body className="min-h-full flex flex-col site__body">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
