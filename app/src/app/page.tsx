import { AuthButton } from "@/components/auth/auth-button";

export default function Home() {
  return (
    <div className="h-screen flex flex-col gap-6 items-center justify-center bg-[#222222]">
      <div className="text-white text-4xl font-bold">
        <span className="text-[#0047FF]">G</span>ood{" "}
        <span className="text-[#B0FF00]">G</span>ame
      </div>
      <div>
        <AuthButton />
      </div>
    </div>
  );
}
