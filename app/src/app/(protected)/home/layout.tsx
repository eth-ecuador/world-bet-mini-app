import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto mt-16">{children}</main>
      <div className="mb-16"></div>
      <Footer />
    </div>
  );
}
