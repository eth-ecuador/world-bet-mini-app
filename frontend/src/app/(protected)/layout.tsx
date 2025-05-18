import { auth } from "@/auth";
import { Header } from "@/components/PageLayout";
import Footer from "@/components/PageLayout/Footer";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If the user is not authenticated, redirect to the root page
  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header />
      <main className="container mx-auto pb-8">{children}</main>
      <Separator className="pt-0" />
      <Footer />
    </div>
  );
}
