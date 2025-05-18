"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function EventCard() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [betAmount] = useState(10); // Default bet amount

  const homeTeam = {
    name: "Barcelona",
    image: "/b.png",
  };

  const awayTeam = {
    name: "Real Madrid",
    image: "/b.png",
  };

  const odds = {
    home: 1.0,
    draw: 2.5,
    away: 3.0,
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const getPotentialWin = () => {
    if (!selectedOption) return 0;

    const selectedOdd =
      selectedOption === "home"
        ? odds.home
        : selectedOption === "draw"
        ? odds.draw
        : odds.away;

    return (betAmount * selectedOdd).toFixed(2);
  };

  return (
    <div className="max-w-md mx-auto rounded-xl shadow-md overflow-hidden bg-white">
      <div className="px-6 py-4 pb-2">
        <h2 className="text-lg font-semibold text-center">
          {homeTeam.name} vs {awayTeam.name}
        </h2>
      </div>
      <div className="px-6 pb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <Image
              src={homeTeam.image || "/placeholder.svg"}
              alt={homeTeam.name}
              width={64}
              height={64}
              className="mb-1"
            />
            <span className="text-sm font-medium">{homeTeam.name}</span>
          </div>

          <button 
            className="rounded-full px-6 py-2 text-sm font-medium transition-colors text-black"
            style={{ backgroundColor: "#9AE66E" }}
          >
            Apostar
          </button>

          <div className="flex flex-col items-center">
            <Image
              src={awayTeam.image || "/placeholder.svg"}
              alt={awayTeam.name}
              width={64}
              height={64}
              className="mb-1"
            />
            <span className="text-sm font-medium">{awayTeam.name}</span>
          </div>
        </div>

        <div className="rounded-lg p-3 w-full" style={{ backgroundColor: '#f3f4f6' }}>
          <div className="flex items-center justify-between gap-2">
            <button
              className={cn(
                "rounded-lg p-2 w-full text-center font-medium transition-colors",
                selectedOption === "home" 
                  ? "text-black" 
                  : "text-[#333333]"
              )}
              style={{ 
                backgroundColor: selectedOption === "home" ? '#9AE66E' : 'white'
              }}
              onClick={() => handleOptionSelect("home")}
            >
              {odds.home.toFixed(2)}
            </button>

            <button
              className={cn(
                "rounded-lg p-2 w-full text-center font-medium transition-colors",
                selectedOption === "draw" 
                  ? "text-black" 
                  : "text-[#333333]"
              )}
              style={{ 
                backgroundColor: selectedOption === "draw" ? '#9AE66E' : 'white'
              }}
              onClick={() => handleOptionSelect("draw")}
            >
              X
            </button>

            <button
              className={cn(
                "rounded-lg p-2 w-full text-center font-medium transition-colors",
                selectedOption === "away" 
                  ? "text-black" 
                  : "text-[#333333]"
              )}
              style={{ 
                backgroundColor: selectedOption === "away" ? '#9AE66E' : 'white'
              }}
              onClick={() => handleOptionSelect("away")}
            >
              {odds.away.toFixed(2)}
            </button>
          </div>

          {selectedOption && (
            <div className="mt-3 text-sm text-center">
              <span className="text-[#6b7280]">
                Potential win:{" "}
              </span>
              <span className="font-medium" style={{ color: '#9AE66E' }}>
                ${getPotentialWin()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
