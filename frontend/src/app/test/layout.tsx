import { Header } from "@/components/PageLayout/Header";
import { Footer } from "@/components/PageLayout/Footer";
import { Separator } from "@/components/ui/separator";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header />
      <main className="container mx-auto pb-8">{children}</main>
      <Separator className="pt-0" />
      <Footer />
    </div>
  );
}
