"use client";

import { useState } from "react";
import Image from "next/image";
import { Event } from "@/services/events/events.type";
import BettingModal from "./BettingModal";

interface EventCardProps {
  event?: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Check if event data exists
  if (!event) {
    return (
      <div className="max-w-md mx-auto rounded-xl shadow-md overflow-hidden bg-white p-6">
        <p className="text-center">Event data unavailable</p>
      </div>
    );
  }

  // Check if teams array exists and has entries
  if (!event.teams || event.teams.length === 0) {
    return (
      <div className="max-w-md mx-auto rounded-xl shadow-md overflow-hidden bg-white p-6">
        <h2 className="text-lg font-semibold text-center mb-2">
          {event.name || "Unnamed Event"}
        </h2>
        <p className="text-center text-gray-500">
          Team information unavailable
        </p>
      </div>
    );
  }

  // Add null checks for event and event.teams
  const homeTeam = event.teams.find((team) => team.is_home);
  const awayTeam = event.teams.find((team) => !team.is_home);
  if (!homeTeam || !awayTeam) {
    return (
      <div className="max-w-md mx-auto rounded-xl shadow-md overflow-hidden bg-white p-6">
        <h2 className="text-lg font-semibold text-center mb-2">
          {event.name || "Unnamed Event"}
        </h2>
        <p className="text-center text-gray-500">
          Team information unavailable
        </p>
      </div>
    );
  }

  // Find the main market for match winner (assuming first market is match winner)
  const hasMarkets = event.main_markets && event.main_markets.length > 0;
  const mainMarket = hasMarkets ? event.main_markets[0] : null;
  const odds = {
    home: mainMarket?.selections?.[0]?.odds || 1.8,
    draw: mainMarket?.selections?.[1]?.odds || 2.5,
    away: mainMarket?.selections?.[2]?.odds || 3.0,
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

    return selectedOdd.toFixed(2);
  };

  return (
    <div className="max-w-md mx-auto rounded-xl shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow">
      <div className="px-6 py-4 pb-2 border-b">
        <h2 className="text-lg font-semibold text-center">
          {homeTeam.name} vs {awayTeam.name}
        </h2>
        <p className="text-xs text-center text-gray-500 mt-1">
          {event.start_time
            ? `${new Date(event.start_time).toLocaleDateString()} • ${new Date(
                event.start_time
              ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            : "TBD"}{" "}
          • {event.competition || "Unknown"}
        </p>
      </div>
      <div className="px-6 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 relative mb-2 rounded-full bg-gray-50 p-2 border overflow-hidden">
              <Image
                src={homeTeam.logo_url || "/placeholder.svg"}
                alt={homeTeam.name}
                fill
                className="object-contain p-1"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            <span className="text-sm font-medium max-w-24 truncate">
              {homeTeam.name}
            </span>
          </div>

          <button
            className="rounded-full px-6 py-2 text-sm font-medium transition-all text-black hover:shadow-md hover:opacity-90 active:opacity-100 active:transform active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            style={{
              backgroundColor: hasMarkets ? "#9AE66E" : "#f3f4f6",
              color: hasMarkets ? "black" : "#4B5563",
            }}
            onClick={() => setShowModal(true)}
            disabled={!hasMarkets}
          >
            {hasMarkets ? "Apostar" : "No disponible"}
          </button>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 relative mb-2 rounded-full bg-gray-50 p-2 border overflow-hidden">
              <Image
                src={awayTeam.logo_url || "/placeholder.svg"}
                alt={awayTeam.name}
                fill
                className="object-contain p-1"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            <span className="text-sm font-medium max-w-24 truncate">
              {awayTeam.name}
            </span>
          </div>
        </div>

        {hasMarkets ? (
          <div className="rounded-lg p-4 w-full bg-gray-50 border">
            <div className="flex items-center justify-between gap-3">
              <button
                className={`rounded-lg p-3 w-full text-center font-medium transition-all ${
                  selectedOption === "home"
                    ? "text-black shadow-md transform scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
                style={{
                  backgroundColor: selectedOption === "home" ? "#9AE66E" : "",
                }}
                onClick={() => handleOptionSelect("home")}
              >
                {odds.home.toFixed(2)}
              </button>

              <button
                className={`rounded-lg p-3 w-full text-center font-medium transition-all ${
                  selectedOption === "draw"
                    ? "text-black shadow-md transform scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
                style={{
                  backgroundColor: selectedOption === "draw" ? "#9AE66E" : "",
                }}
                onClick={() => handleOptionSelect("draw")}
              >
                X
              </button>

              <button
                className={`rounded-lg p-3 w-full text-center font-medium transition-all ${
                  selectedOption === "away"
                    ? "text-black shadow-md transform scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
                style={{
                  backgroundColor: selectedOption === "away" ? "#9AE66E" : "",
                }}
                onClick={() => handleOptionSelect("away")}
              >
                {odds.away.toFixed(2)}
              </button>
            </div>

            {selectedOption && (
              <div className="mt-3 text-sm flex justify-between items-center">
                <span className="text-gray-500">Ganancia potencial:</span>
                <span className="text-emerald-600 font-bold">
                  ${getPotentialWin()}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg p-4 w-full bg-gray-100 text-center text-gray-500">
            Betting markets not available
          </div>
        )}
      </div>

      {/* Betting Modal */}
      {hasMarkets && (
        <BettingModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          event={event}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          mainMarket={mainMarket}
          odds={odds}
        />
      )}
    </div>
  );
}
