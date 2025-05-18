"use client";
import { useState, useRef, useEffect } from "react";
import { format, addDays, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Events from "./_components/Events";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate 5 days starting from startDate
  const days = Array.from({ length: 5 }, (_, i) => addDays(startDate, i));

  // Handle date selection with proper parsing
  const handleDateSelect = (day: Date) => {
    console.log("Selected day:", day);
    setSelectedDate(day);
  };

  // Scroll to top when date changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [selectedDate]);

  return (
    <div className="flex flex-col h-full">
      {/* Date selector */}
      <div className="sticky top-0 z-10 px-4 py-3 border-b border-gray-800 shadow-md container mx-auto">
        <div className="flex justify-between">
          {days.map((day) => (
            <button
              key={day.toString()}
              onClick={() => handleDateSelect(day)}
              className="flex flex-col items-center"
            >
              <span className="text-xs font-medium mb-1 text-gray-400">
                {format(day, "EEE", { locale: es }).toUpperCase()}
              </span>

              {/* Date circle */}
              <div
                className={cn(
                  "flex h-14 w-14 flex-col items-center justify-center rounded-full text-lg font-medium transition-all",
                  isSameDay(day, selectedDate)
                    ? "bg-[#9AE66E] text-gray-900 shadow-lg shadow-[#9AE66E]/20"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700",
                  isToday(day) &&
                    !isSameDay(day, selectedDate) &&
                    "ring-2 ring-[#9AE66E]/30"
                )}
              >
                {format(day, "d", { locale: es })}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto bg-gray-950 p-4 space-y-4 w-full"
      >
        <div className="flex items-center justify-center">
          <h2 className="text-xl font-semibold text-white text-center">
            {format(selectedDate, "EEEE, d 'de' MMMM", {
              locale: es,
            }).toUpperCase()}
          </h2>
        </div>

        {/* Pass selectedDate to Events component */}
        <Events selectedDate={selectedDate} />
      </div>
    </div>
  );
}
