import Footer from "@/components/Footer";
import Header from "@/components/Header";

// Chrome for every page except the one-screen landing page.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
