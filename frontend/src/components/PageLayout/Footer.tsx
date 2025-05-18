"use client";

import type React from "react";
import { Navigation } from "../Navigation";
import { Separator } from "../ui/separator";

export const Footer = () => {
  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-10 p-4">
        <div className="flex flex-col gap-4">
          <Separator />
          <Navigation />
        </div>
      </footer>
    </>
  );
};

export default Footer;
