"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { theme } from "@/lib/config/ui";

export const SportsNav = () => {
  const [selectedSport, setSelectedSport] = useState("Football");

  const sports = [
    { name: "Football", icon: "⚽" },
    { name: "Basketball", icon: "🏀" },
    { name: "Tennis", icon: "🎾" },
    { name: "Cricket", icon: "🏏" },
    { name: "Volleyball", icon: "🏐" },
    { name: "Rugby", icon: "🏉" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-[#2A2A2A] rounded-xl shadow-lg border border-[#F5F5F5]/10 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center overflow-x-auto gap-3 py-2 px-1 no-scrollbar">
          {sports.map((sport) => (
            <motion.button
              key={sport.name}
              onClick={() => setSelectedSport(sport.name)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-200",
                selectedSport === sport.name
                  ? "bg-gradient-to-r from-[#0047FF] to-[#B0FF00] text-black font-medium shadow-md"
                  : "bg-[#1A1A1A] text-[#F5F5F5] hover:bg-[#333333]"
              )}
            >
              <span className="text-lg">{sport.icon}</span>
              <span className="font-medium whitespace-nowrap">{sport.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="h-1 w-full bg-gradient-to-r from-[#0047FF] to-[#B0FF00]"></div>
    </motion.div>
  );
};
