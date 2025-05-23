"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Event, MainMarket } from "@/services/events/events.type";
import { OFF_RAMP_WALLET } from "@/config";
import { Pay } from "@/components/Pay";
import { Token } from "@worldcoin/mini-apps-ui-kit-react";
import WalletBalance from "@/components/WalletBalance";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { getUnoDeeplinkUrl } from "@/lib/swap";
import { useAuthComplete } from "@/hooks/useAuthComplete";

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
  const [betAmount, setBetAmount] = useState(0); // Initialize to 0
  const [inputValue, setInputValue] = useState("0.00"); // Initialize to 0.00
  
  const { walletAddress, externalApiAuthenticated } = useAuthComplete();
  const address = walletAddress || "";
  const { balances } = useWalletBalance(address);

  // Calculate max bet amount (USDC balance minus 0.2)
  const maxBetAmount = balances.USDC ? parseFloat(balances.USDC) - 0.2 : 0;
  const wldBalance = balances.WLD ? parseFloat(balances.WLD) - 0.2 : 0;

  // Set initial bet amount based on the user's USDC balance
  useEffect(() => {
    // Default amount we want to use (10.0)
    const defaultAmount = 10.0;
    
    // If maxBetAmount is available and valid
    if (maxBetAmount > 0) {
      // Use the smaller of defaultAmount or maxBetAmount
      const initialAmount = Math.min(defaultAmount, maxBetAmount);
      setBetAmount(initialAmount);
      setInputValue(initialAmount.toFixed(2));
    } else if (maxBetAmount <= 0 && balances.USDC !== null) {
      // If there's a balance but it's too low, set to 0
      setBetAmount(0);
      setInputValue("0.00");
    }
  }, [maxBetAmount, balances.USDC]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const incrementAmount = () => {
    // Ensure we don't exceed max bet amount
    const newAmount = Math.min(
      parseFloat((betAmount + 1).toFixed(2)),
      Math.max(0, maxBetAmount)
    );
    setBetAmount(newAmount);
    setInputValue(newAmount.toFixed(2));
  };

  const decrementAmount = () => {
    if (betAmount > 1) {
      const newAmount = parseFloat((betAmount - 1).toFixed(2));
      setBetAmount(newAmount);
      setInputValue(newAmount.toFixed(2));
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow the user to type freely, but only permit numeric inputs and max one decimal point
    if (value === "" || /^(\d+)?\.?(\d{0,2})?$/.test(value)) {
      setInputValue(value);

      // Only update the actual bet amount if it's a valid number
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        // Ensure the bet amount doesn't exceed the max bet amount
        const limitedValue = Math.min(numericValue, Math.max(0, maxBetAmount));
        setBetAmount(limitedValue);
        if (limitedValue !== numericValue) {
          setInputValue(limitedValue.toFixed(2));
        }
      } else if (value === "" || value === ".") {
        setBetAmount(0);
      }
    }
  };

  const handleInputBlur = () => {
    // Format the display value when the input loses focus
    if (inputValue === "" || parseFloat(inputValue) === 0) {
      setInputValue("0.00");
    } else {
      setInputValue(betAmount.toFixed(2));
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Optional: Select all text when focused
    e.target.select();
  };

  // Ensure minimum bet amount when submitting or switching to Pay
  const getValidBetAmount = () => {
    // Minimum bet amount is 1.00
    return Math.max(1, betAmount);
  };

  const getPotentialWin = () => {
    if (!selectedOption) return 0;

    const selectedOdd =
      selectedOption === "home"
        ? odds.home
        : selectedOption === "draw"
        ? odds.draw
        : odds.away;

    return (getValidBetAmount() * selectedOdd).toFixed(2);
  };

  const handleBetSubmit = async () => {
    if (!selectedOption) {
      alert("Por favor selecciona una opción");
      return;
    }

    try {
      // We don't need to call login explicitly - our useAuthComplete hook handles that
      // Just check if we're authenticated
      if (!externalApiAuthenticated) {
        alert("Por favor, inténtalo de nuevo. Error de autenticación.");
        return;
      }
      
      // Here you would handle the bet submission logic using the API
      // Example:
      // await apiClient.post('/bets', {
      //   eventId: event.id,
      //   selection: selectedOption,
      //   amount: getValidBetAmount()
      // });
      
      alert(
        `¡Apuesta realizada! ${selectedOption} - $${getValidBetAmount().toFixed(
          2
        )}`
      );
      onClose();
    } catch (error) {
      console.error("Error submitting bet:", error);
      alert("Error al realizar la apuesta. Inténtalo de nuevo.");
    }
  };

  const handleGetUSDC = () => {
    const deeplink = getUnoDeeplinkUrl({
      toToken: "USDC",
      amount: wldBalance > 0 ? wldBalance.toString() : undefined,
    });
    window.location.href = deeplink;
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
        className="bg-white rounded-2xl flex flex-col w-[90%] max-w-[400px] max-h-[90vh] overflow-hidden"
        style={{
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold">Realizar apuesta</h3>
          {isOpen && <WalletBalance />}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <ScrollArea
          className="flex-1 overflow-auto"
          style={{ height: "calc(90vh - 180px)" }}
        >
          <div className="p-5">
            <div className="mb-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col items-center flex-1">
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
                  <span className="text-sm font-medium text-center max-w-24 truncate">
                    {homeTeam.name}
                  </span>
                </div>

                <div className="mx-4 px-4 py-2 rounded-full bg-gray-50 text-xs text-gray-500 text-center">
                  <div className="font-medium">
                    {event.start_time
                      ? new Date(event.start_time).toLocaleDateString()
                      : "TBD"}
                  </div>
                  <div className="mt-1">{event.competition || "Unknown"}</div>
                </div>

                <div className="flex flex-col items-center flex-1">
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
                  <span className="text-sm font-medium text-center max-w-24 truncate">
                    {awayTeam.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-gray-700 mb-3 font-medium">
                Mercado: {mainMarket?.name || "Ganador del partido"}
              </p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleOptionSelect("home")}
                  className={`p-3 rounded-xl font-medium text-sm transition-all ${
                    selectedOption === "home"
                      ? "text-black shadow-md transform scale-105 border-2"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border"
                  }`}
                  style={{
                    backgroundColor: selectedOption === "home" ? "#9AE66E" : "",
                    borderColor:
                      selectedOption === "home" ? "#5ec929" : "#e5e7eb",
                  }}
                >
                  <div className="truncate">{homeTeam.name}</div>
                  <div
                    className={`mt-1 ${
                      selectedOption === "home"
                        ? "font-bold text-base"
                        : "text-xs"
                    }`}
                  >
                    {odds.home.toFixed(2)}
                  </div>
                </button>

                <button
                  onClick={() => handleOptionSelect("draw")}
                  className={`p-3 rounded-xl font-medium text-sm transition-all ${
                    selectedOption === "draw"
                      ? "text-black shadow-md transform scale-105 border-2"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border"
                  }`}
                  style={{
                    backgroundColor: selectedOption === "draw" ? "#9AE66E" : "",
                    borderColor:
                      selectedOption === "draw" ? "#5ec929" : "#e5e7eb",
                  }}
                >
                  <div>Empate</div>
                  <div
                    className={`mt-1 ${
                      selectedOption === "draw"
                        ? "font-bold text-base"
                        : "text-xs"
                    }`}
                  >
                    {odds.draw.toFixed(2)}
                  </div>
                </button>

                <button
                  onClick={() => handleOptionSelect("away")}
                  className={`p-3 rounded-xl font-medium text-sm transition-all ${
                    selectedOption === "away"
                      ? "text-black shadow-md transform scale-105 border-2"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border"
                  }`}
                  style={{
                    backgroundColor: selectedOption === "away" ? "#9AE66E" : "",
                    borderColor:
                      selectedOption === "away" ? "#5ec929" : "#e5e7eb",
                  }}
                >
                  <div className="truncate">{awayTeam.name}</div>
                  <div
                    className={`mt-1 ${
                      selectedOption === "away"
                        ? "font-bold text-base"
                        : "text-xs"
                    }`}
                  >
                    {odds.away.toFixed(2)}
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <p className="text-gray-700 font-medium">Monto:</p>
                {maxBetAmount > 0 && (
                  <p className="text-xs text-gray-500">
                    Max: {maxBetAmount.toFixed(2)} USDC
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="relative">
                  <div
                    className="flex items-center rounded-xl overflow-hidden border focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent shadow-sm"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <button
                      onClick={decrementAmount}
                      className="p-3 bg-gray-50 text-gray-700 font-bold text-xl border-r hover:bg-gray-100 transition-colors flex items-center justify-center w-12"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      −
                    </button>
                    <div className="flex items-center justify-center flex-1">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={inputValue}
                        onChange={handleAmountChange}
                        onBlur={handleInputBlur}
                        onFocus={handleInputFocus}
                        className="w-full p-3 text-center font-medium text-lg border-none focus:outline-none"
                      />
                      <div className="mr-3">
                        <Token value="USDC" size={24} />
                      </div>
                    </div>
                    <button
                      onClick={incrementAmount}
                      className="p-3 bg-gray-50 text-gray-700 font-bold text-xl border hover:bg-gray-100 transition-colors flex items-center justify-center w-12"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleGetUSDC}
                  className="mt-3 w-full py-2 rounded-xl font-medium text-sm bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors border border-blue-200"
                >
                  Obtener USDC
                </button>
              </div>
            </div>

            {selectedOption && (
              <div
                className="mb-5 p-4 rounded-xl border"
                style={{
                  backgroundColor: "#f0fff4",
                  borderColor: "#d1fac8",
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Tu apuesta:</span>
                  <div
                    className="font-medium flex items-center gap-1 bg-white px-3 py-1 rounded-full border"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    {betAmount.toFixed(2)}
                    <Token value="USDC" size={20} />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-gray-700">Ganancia potencial:</span>
                  <div
                    className="font-bold flex items-center gap-1 bg-white px-3 py-1 rounded-full border"
                    style={{ color: "#059669", borderColor: "#d1fac8" }}
                  >
                    <span className="text-lg">{getPotentialWin()}</span>
                    <Token value="USDC" size={20} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {selectedOption ? (
          <div className="p-5 border-t sticky bottom-0 bg-white">
            {maxBetAmount <= 0 ? (
              <button
                onClick={handleGetUSDC}
                className="w-full p-3 rounded-xl font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Primero obtén USDC
              </button>
            ) : (
              <Pay address={paymentWallet} amount={getValidBetAmount()} />
            )}
          </div>
        ) : (
          <div className="p-5 border-t sticky bottom-0 bg-white">
            <button
              onClick={handleBetSubmit}
              disabled={!selectedOption}
              className={`w-full p-3 rounded-xl font-medium transition-all ${
                selectedOption
                  ? "text-black hover:shadow-md active:transform active:scale-95"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              style={{
                backgroundColor: selectedOption ? "#9AE66E" : "",
                border: selectedOption ? "2px solid #5ec929" : "none",
              }}
            >
              Seleccionar un resultado
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
