import { AuthButton } from "@/components/auth/auth-button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#1A1A1A]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-r from-[#0047FF]/20 to-transparent blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-l from-[#B0FF00]/10 to-transparent blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
      <AuthButton />
    </main>
  );
}
