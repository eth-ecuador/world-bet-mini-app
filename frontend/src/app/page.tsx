import { AuthButton } from "../components/AuthButton";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center h-screen bg-[#222222]">
      <div className="text-white text-4xl font-bold">
        <span className="text-[#B0FF00]">G</span>ood{" "}
        <span className="text-[#B0FF00]">G</span>ame
      </div>
      <div>
        <AuthButton />
      </div>
    </div>
  );
}
