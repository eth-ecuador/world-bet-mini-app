"use client";
import clsx from "clsx";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { SearchField, Token } from "@worldcoin/mini-apps-ui-kit-react";

/**
 * This component is a simple page layout component to help with design consistency
 * Feel free to modify this component to fit your needs
 */
export const Page = (props: { children: ReactNode; className?: string }) => {
  return (
    <div className={twMerge(clsx("flex h-dvh flex-col", props.className))}>
      <Header />
      <Main>{props.children}</Main>
      <Footer />
    </div>
  );
};

export const Header = () => {
  return (
    <header className="flex w-full bg-black z-10 px-4 py-3">
      {/* All elements in one row */}
      <div className="flex items-center justify-between w-full gap-3">
        {/* Logo section */}
        <div className="flex-shrink-0">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
        </div>

        {/* Search input - in the middle */}
        <div className="flex-1 max-w-[200px]">
          <SearchField
            label="Buscar equipo"
            onChange={function Kik() {}}
            className="w-full"
          />
        </div>

        {/* Wallet balance */}
        <div className="flex items-center rounded-full bg-[#F3F4F4] p-2 pr-4">
          <Token value="WLD" size={32} variant="monochrome" />
          <div className="text-sm font-medium text-black">200</div>
        </div>
      </div>
    </header>
  );
};

const Main = (props: { children: ReactNode; className?: string }) => {
  return (
    <main
      className={twMerge(
        clsx("grow overflow-y-auto p-6 pt-3", props.className)
      )}
    >
      {props.children}
    </main>
  );
};

const Footer = (props: { className?: string }) => {
  return (
    <footer
      className={twMerge("px-6 pb-[35px]", clsx(props.className))}
    ></footer>
  );
};
