"use client";

import { useState } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Event, MainMarket } from "@/services/events/events.type";
import { OFF_RAMP_WALLET } from "@/config";
import { Pay } from "@/components/Pay";

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  homeTeam: {
    id: string;
    name: string;
    logo_url: string;
    is_home: boolean;
  };
  awayTeam: {
    id: string;
    name: string;
    logo_url: string;
    is_home: boolean;
  };
  mainMarket: MainMarket | null;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}

export default function BettingModal({
  isOpen,
  onClose,
  event,
  homeTeam,
  awayTeam,
  mainMarket,
  odds,
}: BettingModalProps) {
  const paymentWallet =
    OFF_RAMP_WALLET || "0x1fb249bfa4ffB9fa98529692889d38359a57294D";
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(10); // Default bet amount

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

  const handleBetSubmit = () => {
    if (!selectedOption) {
      alert("Por favor selecciona una opción");
      return;
    }

    // Here you would handle the bet submission logic
    alert(`¡Apuesta realizada! ${selectedOption} - $${betAmount}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        backdropFilter: "blur(3px)",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl flex flex-col w-[90%] max-w-[400px] max-h-[80vh] p-4 pb-8"
        style={{
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 pb-4 border-b">
          <h3 className="text-xl font-semibold">Realizar apuesta</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 rounded-full w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <ScrollArea className="flex-1 h-full" type="always">
          <div className="p-6">
            <div className="mb-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-16 h-16 relative mb-2">
                    <Image
                      src={homeTeam.logo_url || "/placeholder.svg"}
                      alt={homeTeam.name}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-center">
                    {homeTeam.name}
                  </span>
                </div>

                <div className="mx-2 text-xs text-gray-500">
                  <div>
                    {event.start_time
                      ? new Date(event.start_time).toLocaleDateString()
                      : "TBD"}
                  </div>
                  <div className="mt-1">{event.competition || "Unknown"}</div>
                </div>

                <div className="flex flex-col items-center flex-1">
                  <div className="w-16 h-16 relative mb-2">
                    <Image
                      src={awayTeam.logo_url || "/placeholder.svg"}
                      alt={awayTeam.name}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-center">
                    {awayTeam.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-gray-700 mb-2 font-medium">
                Mercado: {mainMarket?.name || "Ganador del partido"}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleOptionSelect("home")}
                  style={{
                    backgroundColor:
                      selectedOption === "home" ? "#9AE66E" : "#f3f4f6",
                    color: selectedOption === "home" ? "black" : "#4B5563",
                  }}
                  className="p-3 rounded-lg font-medium text-sm transition-colors"
                >
                  <div>{homeTeam.name}</div>
                  <div className="text-xs mt-1">{odds.home.toFixed(2)}</div>
                </button>

                <button
                  onClick={() => handleOptionSelect("draw")}
                  style={{
                    backgroundColor:
                      selectedOption === "draw" ? "#9AE66E" : "#f3f4f6",
                    color: selectedOption === "draw" ? "black" : "#4B5563",
                  }}
                  className="p-3 rounded-lg font-medium text-sm transition-colors"
                >
                  <div>Empate</div>
                  <div className="text-xs mt-1">{odds.draw.toFixed(2)}</div>
                </button>

                <button
                  onClick={() => handleOptionSelect("away")}
                  style={{
                    backgroundColor:
                      selectedOption === "away" ? "#9AE66E" : "#f3f4f6",
                    color: selectedOption === "away" ? "black" : "#4B5563",
                  }}
                  className="p-3 rounded-lg font-medium text-sm transition-colors"
                >
                  <div>{awayTeam.name}</div>
                  <div className="text-xs mt-1">{odds.away.toFixed(2)}</div>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2 font-medium">Monto (WLD):</p>
              <div className="relative mb-2">
                <input
                  type="number"
                  min="1"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg text-center font-medium text-lg"
                  style={{ borderColor: "#e5e7eb" }}
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setBetAmount(Math.max(1, betAmount - 5))}
                  style={{ backgroundColor: "#f3f4f6" }}
                  className="py-2 rounded-md font-medium text-sm"
                >
                  -5
                </button>
                <button
                  onClick={() => setBetAmount(betAmount + 5)}
                  style={{ backgroundColor: "#f3f4f6" }}
                  className="py-2 rounded-md font-medium text-sm"
                >
                  +5
                </button>
                <button
                  onClick={() => setBetAmount(betAmount + 10)}
                  style={{ backgroundColor: "#f3f4f6" }}
                  className="py-2 rounded-md font-medium text-sm"
                >
                  +10
                </button>
                <button
                  onClick={() => setBetAmount(betAmount + 50)}
                  style={{ backgroundColor: "#f3f4f6" }}
                  className="py-2 rounded-md font-medium text-sm"
                >
                  +50
                </button>
              </div>
            </div>

            {selectedOption && (
              <div
                className="mb-5 p-4 rounded-lg"
                style={{ backgroundColor: "#f8fafc" }}
              >
                <div className="flex justify-between">
                  <span className="text-gray-700">Tu apuesta:</span>
                  <span className="font-medium">{betAmount} WLD</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-700">Ganancia potencial:</span>
                  <span style={{ color: "#9AE66E" }} className="font-medium">
                    {getPotentialWin()} WLD
                  </span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {selectedOption ? (
          <Pay address={paymentWallet} amount={betAmount} />
        ) : (
          <div className="p-6 pt-3 border-t">
            <button
              onClick={handleBetSubmit}
              style={{
                backgroundColor: selectedOption ? "#9AE66E" : "#f3f4f6",
                color: selectedOption ? "black" : "#9ca3af",
              }}
              className="w-full py-3 rounded-lg font-medium transition-colors"
            >
              Seleccionar un resultado
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
