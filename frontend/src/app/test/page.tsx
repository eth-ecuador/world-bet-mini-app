"use client";
import { useState, useRef, useEffect } from "react";
import { format, addDays, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import EventCard from "./_components/EventCard";

interface Event {
  id: string;
  date: Date;
  title: string;
  time: string;
  location: string;
  description: string;
  image: string;
}

export default function Events() {
  const events: Event[] = [
    {
      id: "1",
      date: new Date(),
      title: "Barcelona vs Real Madrid",
      time: "10:00",
      location: "Camp Nou",
      description: "Barcelona vs Real Madrid",
      image: "/b.png",
    },
  ];

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [startDate] = useState(today);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate 5 days starting from startDate
  const days = Array.from({ length: 5 }, (_, i) => addDays(startDate, i));

  // Filter events for the selected date
  const selectedEvents = events.filter((event) =>
    isSameDay(event.date, selectedDate)
  );

  // Scroll to top when date changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [selectedDate]);

  return (
    <div className="sticky top-0 z-10 px-4 py-3 border-b border-gray-800 shadow-md">
      <div className="flex justify-between">
        {days.map((day) => (
          <button
            key={day.toString()}
            onClick={() => setSelectedDate(day)}
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

      <div
        ref={scrollRef}
        className="flex-1 overflow-auto bg-gray-950 px-4 py-3 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {format(selectedDate, "EEEE, d 'de' MMMM", {
              locale: es,
            }).toUpperCase()}
          </h2>
        </div>

        {selectedEvents.length > 0 ? (
          <div className="space-y-3 pb-4">
            {selectedEvents.map((event) => (
              <EventCard key={event.id} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 mt-8 bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <div className="text-gray-400 text-center">
              <p className="mb-2">No hay eventos programados para este día</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
