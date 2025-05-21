"use client";

import { Input } from "@/components/ui/input";
import { WalletBalance } from "@/components/wallet/wallet-balance";
import { Search } from "iconoir-react";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 flex w-full bg-[#1A1A1A] z-30 p-4 h-16">
      <div className="flex items-center justify-between w-full max-w-[1200px] mx-auto gap-4">
        {/* Logo section */}
        <div className="flex-shrink-0 w-10 h-10">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
        </div>

        {/* Search input - in the middle */}
        <div className="relative flex-1 max-w-[460px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Input 
              placeholder="Buscar"
              className="text-gray-800 pl-9 h-10 bg-white border-gray-300 rounded-xl shadow-sm focus-visible:ring-blue-500 focus-visible:border-blue-500"
            />
          </div>
        </div>

        {/* Wallet balance */}
        <WalletBalance />
      </div>
    </header>
  );
};
