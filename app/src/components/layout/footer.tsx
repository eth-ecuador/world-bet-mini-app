"use client";

import type React from "react";
import { Navigation } from "./navigation";


export const Footer = () => {
  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-10 p-4 bg-gray-950 pt-0">
        <div className="flex flex-col gap-4">
          <Navigation />
        </div>
      </footer>
    </>
  );
};

export default Footer;
