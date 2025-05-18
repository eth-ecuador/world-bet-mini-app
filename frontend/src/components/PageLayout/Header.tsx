"use client";

import Image from "next/image";
import WalletBalance from "../WalletBalance";
import { SearchField } from "@worldcoin/mini-apps-ui-kit-react";

export const Header = () => {
  return (
    <header className="flex w-full bg-[#0a0c12] z-10 px-4 py-4">
      <div className="flex items-center justify-between w-full max-w-[1200px] mx-auto gap-4">
        {/* Logo section */}
        <div className="flex-shrink-0 w-10 h-10">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
        </div>

        {/* Search input - in the middle */}
        <div className="relative flex-1 max-w-[460px]">
          <SearchField
            label="Name, Address or ENS"
            className="bg-opacity-30"
            onChange={() => {}}
          />
        </div>

        {/* Wallet balance */}
        <WalletBalance />
      </div>
    </header>
  );
};
