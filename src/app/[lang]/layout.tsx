import type { Metadata } from "next";
import { Karla, Newsreader } from "next/font/google";
import { lang } from "next/root-params";
import WhatsAppButton from "@/components/WhatsAppButton";
import { locales } from "@/lib/locales";
import "../globals.css";

const title = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});
const sans = Karla({ subsets: ["latin"], variable: "--font-karla" });

export const metadata: Metadata = {
  title: { default: "Bilingue", template: "%s – Bilingue" },
  // Hosting is TBD: set NEXT_PUBLIC_SITE_URL once the domain is known.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  return (
    <html
      lang={await lang()}
      data-scroll-behavior="smooth"
      className={`${title.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
