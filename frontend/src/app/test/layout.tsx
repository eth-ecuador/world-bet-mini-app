import { Header } from "@/components/PageLayout";
import { Footer } from "@/components/PageLayout/Footer";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
