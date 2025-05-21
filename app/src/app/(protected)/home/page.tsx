"use client";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import { format, addDays, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Events from "./_components/events";
import AmountSelector from "@/components/payments/amount-selector";
import { SportsNav } from "@/components/layout/spots-nav";
import { motion } from "framer-motion";
import { SPORT_TYPES } from "@/services/events/events.service";

// Memoize Events component to prevent unnecessary re-renders
const MemoizedEvents = memo(Events);

export default function HomePage() {
  // Parse the initial date
  const parseInitialDate = () => {
    try {
      // You can set this to a specific date for testing
      // For example: return parseISO("2025-05-18T16:00:00");
      return new Date(); // Default to today
    } catch (error) {
      console.error("Error parsing initial date:", error);
      return new Date(); // Fallback to today
    }
  };

  const today = parseInitialDate();
  const [selectedDate, setSelectedDate] = useState(today);
  const [startDate] = useState(today);
  const [bettingAmount, setBettingAmount] = useState(10);
  const [selectedSport, setSelectedSport] = useState(SPORT_TYPES.FOOTBALL);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate 5 days starting from startDate
  const days = Array.from({ length: 5 }, (_, i) => addDays(startDate, i));

  // Handle date selection with proper parsing
  const handleDateSelect = (day: Date) => {
    console.log("Selected day:", day);
    setSelectedDate(day);
  };

  // Handle sport selection
  const handleSportChange = useCallback((sportType: string) => {
    console.log("Selected sport:", sportType);
    setSelectedSport(sportType);
    // Scroll to top when sport changes
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  // Scroll to top when date changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [selectedDate]);

  // Handle amount change with useCallback to keep function reference stable
  const handleAmountChange = useCallback((amount: number) => {
    console.log("Amount changed:", amount);
    setBettingAmount(amount);
  }, []);

  // Get sport name for display
  const getSportName = () => {
    switch(selectedSport) {
      case SPORT_TYPES.FOOTBALL: return "Fútbol";
      case SPORT_TYPES.BASKETBALL: return "Baloncesto";
      case SPORT_TYPES.TENNIS: return "Tenis";
      case SPORT_TYPES.CRICKET: return "Cricket";
      case SPORT_TYPES.VOLLEYBALL: return "Voleibol";
      case SPORT_TYPES.RUGBY: return "Rugby";
      default: return "Deportes";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-4 py-3 bg-[#1A1A1A] shadow-md container mx-auto">
        {/* Updated Sports Navigation */}
        <div className="mb-6">
          <SportsNav 
            onSportChange={handleSportChange} 
            initialSport={selectedSport} 
          />
        </div>

        {/* Date selector */}
        <div className="flex justify-between mt-4">
          {days.map((day) => (
            <motion.button
              key={day.toString()}
              onClick={() => handleDateSelect(day)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <span className="text-xs font-medium mb-1 text-gray-400">
                {format(day, "EEE", { locale: es }).toUpperCase()}
              </span>

              {/* Date circle */}
              <div
                className={cn(
                  "flex h-14 w-14 flex-col items-center justify-center rounded-full text-lg font-medium transition-all shadow-sm",
                  isSameDay(day, selectedDate)
                    ? "bg-gradient-to-r from-[#0047FF] to-[#B0FF00] text-[#1A1A1A] shadow-lg shadow-[#0047FF]/20 font-semibold"
                    : "bg-[#2A2A2A] text-gray-300 hover:bg-gray-700",
                  isToday(day) &&
                    !isSameDay(day, selectedDate) &&
                    "ring-2 ring-[#0047FF]/30"
                )}
              >
                {format(day, "d", { locale: es })}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Amount Selector - sticky below fixed header */}
      <div className="sticky top-16 z-20 bg-[#1A1A1A] p-4 shadow-lg">
        <AmountSelector
          onAmountChange={handleAmountChange}
          initialAmount={bettingAmount}
          minAmount={1}
          currency="USDC"
        />
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-[#0047FF] to-[#B0FF00]"></div>

      {/* Content area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto bg-gray-950 p-4 space-y-2 w-full"
      >
        <div className="flex items-center justify-center">
          <h2 className="text-xl font-semibold text-white text-center">
            {getSportName()} - Pronosticar
          </h2>
        </div>

        {/* Pass selectedDate, sportType and bettingAmount to Events component */}
        <MemoizedEvents
          selectedDate={selectedDate}
          bettingAmount={bettingAmount}
          sportType={selectedSport}
        />
      </div>
    </div>
  );
}
