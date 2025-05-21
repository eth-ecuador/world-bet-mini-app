"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { theme } from "@/lib/config/ui";
import { SPORT_TYPES } from "@/services/events/events.service";

export interface SportsNavProps {
  onSportChange?: (sport: string) => void;
  initialSport?: string;
}

export const SportsNav = ({ onSportChange, initialSport = SPORT_TYPES.FOOTBALL }: SportsNavProps) => {
  const [selectedSport, setSelectedSport] = useState(initialSport);

  const sports = [
    { id: SPORT_TYPES.FOOTBALL, name: "Football", icon: "⚽" },
    { id: SPORT_TYPES.BASKETBALL, name: "Basketball", icon: "🏀" },
    { id: SPORT_TYPES.TENNIS, name: "Tennis", icon: "🎾" },
    { id: SPORT_TYPES.CRICKET, name: "Cricket", icon: "🏏" },
    { id: SPORT_TYPES.VOLLEYBALL, name: "Volleyball", icon: "🏐" },
    { id: SPORT_TYPES.RUGBY, name: "Rugby", icon: "🏉" },
  ];

  // Handle sport selection
  const handleSportSelect = (sportId: string) => {
    setSelectedSport(sportId);
    if (onSportChange) {
      onSportChange(sportId);
    }
  };

  // Initialize with the initial sport
  useEffect(() => {
    if (initialSport && initialSport !== selectedSport) {
      setSelectedSport(initialSport);
    }
  }, [initialSport]);

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
              key={sport.id}
              onClick={() => handleSportSelect(sport.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-200",
                selectedSport === sport.id
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
