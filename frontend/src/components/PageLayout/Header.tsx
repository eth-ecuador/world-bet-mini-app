"use client";

import { Search, Wallet } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex w-full bg-black z-10 px-4 py-3">
      {/* All elements in one row */}
      <div className="flex items-center justify-between w-full gap-3">
        {/* Logo section */}
        <div className="flex-shrink-0">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
        </div>

        {/* Search input - in the middle */}
        <div className="relative flex-1 max-w-[200px]">
          <Input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 h-9 bg-gray-800 border-gray-700 text-white"
            aria-label="Search input"
          />
          <Search
            size={16}
            className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>

        {/* Wallet balance */}
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 px-3 py-1 h-9 bg-gray-800 border-gray-700 text-white"
        >
          <Wallet size={16} />
          <span className="text-sm font-medium">200 WLD</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
