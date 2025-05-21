"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Event, MainMarket } from "@/services/events/events.type";
import { Pay } from "@/components/payments/pay-button";
import { Token } from "@/components/ui/token";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { getUnoDeeplinkUrl } from "@/lib/swap";
import { useAuthComplete } from "@/hooks/useAuthComplete";
import { OFF_RAMP_WALLET } from "@/lib/config/payments";
import { WalletBalance } from "@/components/wallet/wallet-balance";
import { Check, X } from "lucide-react";

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
  initialSelection?: string;
  bettingAmount: number;
}

// New interface for confirmation modal
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  betDetails: {
    homeTeam: string;
    awayTeam: string;
    selection: string;
    team: string;
    odds: number;
    amount: number;
    potentialWin: string;
  };
}

// New confirmation modal component
function ConfirmationModal({
  isOpen,
  onClose,
  betDetails,
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 gap-0 overflow-hidden sm:max-w-[400px] rounded-xl border border-gray-200 bg-white">
        <DialogHeader className="sr-only">
          <DialogTitle>Confirmación de Apuesta</DialogTitle>
        </DialogHeader>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-gray-100 p-0 flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
          aria-label="Close"
        >
          <X size={18} className="text-gray-500" />
        </button>
        
        {/* Success icon */}
        <div className="pt-8 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check size={32} className="text-green-600" />
          </div>
        </div>
        
        {/* Confirmation message */}
        <div className="p-5 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Apuesta Confirmada!</h3>
          <p className="text-gray-600 mb-4">Tu apuesta ha sido procesada correctamente</p>
        </div>
        
        {/* Bet details */}
        <div className="px-5 pb-4">
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="text-sm text-gray-500 text-center mb-2">
              {betDetails.homeTeam} vs {betDetails.awayTeam}
            </div>
            
            <div className="flex items-center justify-center">
              <div className="px-6 py-2 bg-gray-100 rounded-full">
                <div className="flex items-center space-x-3">
                  <span className="text-base font-semibold text-gray-900">
                    {betDetails.selection}
                  </span>
                  <span className="text-base font-medium text-gray-700">
                    {betDetails.team}
                  </span>
                  <span className="text-base font-semibold text-blue-600">
                    {betDetails.odds.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
              <span className="text-sm font-medium text-gray-600">Monto:</span>
              <span className="text-sm font-semibold text-gray-900">${betDetails.amount.toFixed(2)} USDC</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Potencial:</span>
              <span className="text-sm font-semibold text-green-600">${betDetails.potentialWin} USDC</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-5 border-t border-gray-200">
          <Button 
            onClick={onClose}
            className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Aceptar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function BettingModal({
  isOpen,
  onClose,
  event,
  homeTeam,
  awayTeam,
  odds,
  initialSelection,
  bettingAmount,
}: BettingModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    initialSelection || null
  );
  const [betAmount, setBetAmount] = useState(bettingAmount);
  const [inputValue, setInputValue] = useState(bettingAmount.toFixed(2));
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Add state for confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const { walletAddress, externalApiAuthenticated } = useAuthComplete();
  const address = walletAddress || "";
  const { balances } = useWalletBalance(address);

  const maxBetAmount = balances.USDC ? parseFloat(balances.USDC as string) : 0;
  const wldBalance = balances.WLD ? parseFloat(balances.WLD as string) : 0;

  // Direct sync with betting amount prop
  useEffect(() => {
    console.log("Syncing with new bettingAmount:", bettingAmount);
    const newAmount = Math.min(
      bettingAmount,
      maxBetAmount > 0 ? maxBetAmount : Infinity
    );
    setBetAmount(newAmount);
    setInputValue(newAmount.toFixed(2));
  }, [bettingAmount, maxBetAmount]);

  // Set initial bet amount based on the user's USDC balance and the passed bettingAmount
  useEffect(() => {
    console.log("Modal received bettingAmount:", bettingAmount);

    // If maxBetAmount is available and valid
    if (maxBetAmount > 0) {
      // Use the smaller of defaultAmount or maxBetAmount
      const initialAmount = Math.min(bettingAmount, maxBetAmount);
      setBetAmount(initialAmount);
      setInputValue(initialAmount.toFixed(2));
    } else if (maxBetAmount <= 0 && balances.USDC !== null) {
      setBetAmount(0);
      setInputValue("0.00");
    }
  }, [maxBetAmount, balances.USDC, isOpen]);

  // Set the selected option when initialSelection changes or modal opens
  useEffect(() => {
    if (initialSelection) {
      setSelectedOption(initialSelection);
    }
  }, [initialSelection, isOpen]);

  // Make sure selectedOption is set from initialSelection on mount
  useEffect(() => {
    if (initialSelection && !selectedOption) {
      setSelectedOption(initialSelection);
    }
  }, []);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
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
    // Select all text when focused
    e.target.select();
  };

  // Ensure minimum bet amount when submitting or switching to Pay
  const getValidBetAmount = () => {
    // Minimum bet amount is 1.00
    return Math.max(1, betAmount);
  };

  const getPotentialWin = (): string => {
    if (!selectedOption) return "0.00";

    const selectedOdd =
      selectedOption === "home"
        ? odds.home
        : selectedOption === "draw"
        ? odds.draw
        : odds.away;

    return (getValidBetAmount() * selectedOdd).toFixed(2);
  };

  // Get the selected option details
  const getSelectedDetails = () => {
    switch (selectedOption) {
      case "home":
        return { type: "1", team: homeTeam.name, odds: odds.home };
      case "draw":
        return { type: "X", team: "Empate", odds: odds.draw };
      case "away":
        return { type: "2", team: awayTeam.name, odds: odds.away };
      default:
        return { type: "", team: "", odds: 0 };
    }
  };

  const selected = getSelectedDetails();
  
  // Handle payment completion
  const handlePaymentComplete = () => {
    setPaymentComplete(true);
    onClose(); // Close betting modal
    setShowConfirmation(true); // Show confirmation modal
  };

  const handleBetSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!selectedOption) {
      alert("Por favor selecciona una opción");
      return;
    }

    setIsProcessing(true);

    try {
      // We don't need to call login explicitly - our useAuthComplete hook handles that
      // Just check if we're authenticated
      if (!externalApiAuthenticated) {
        alert("Por favor, inténtalo de nuevo. Error de autenticación.");
        setIsProcessing(false);
        return;
      }

      // Here you would handle the bet submission logic using the API
      // Example:
      // await apiClient.post('/bets', {
      //   eventId: event.id,
      //   selection: selectedOption,
      //   amount: getValidBetAmount()
      // });

      // Simulate API call
      setTimeout(() => {
        setIsProcessing(false);
        handlePaymentComplete();
      }, 1500);
    } catch (error) {
      console.error("Error submitting bet:", error);
      alert("Error al realizar la apuesta. Inténtalo de nuevo.");
      setIsProcessing(false);
    }
  };

  const handleGetUSDC = () => {
    const deeplink = getUnoDeeplinkUrl({
      toToken: "USDC",
      amount: wldBalance > 0 ? wldBalance.toString() : undefined,
    });
    window.location.href = deeplink;
  };

  // Create a title for the dialog based on the teams
  const dialogTitle = `${homeTeam.name} vs ${awayTeam.name}`;
  
  // Bet details for confirmation modal
  const betDetails = {
    homeTeam: homeTeam.name,
    awayTeam: awayTeam.name,
    selection: selected.type,
    team: selected.team,
    odds: selected.odds,
    amount: getValidBetAmount(),
    potentialWin: getPotentialWin(),
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="p-0 gap-0 overflow-hidden sm:max-w-[400px] rounded-xl border border-gray-200 bg-white">
          {/* Add DialogHeader and DialogTitle for accessibility */}
          <DialogHeader className="sr-only">
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-gray-100 p-0 flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
            aria-label="Close"
          >
            <X size={18} className="text-gray-500" />
          </button>

          {/* Match header */}
          <div className="p-4 pt-6 flex flex-col items-center space-y-2 text-center">
            <div className="text-sm text-gray-500">
              {event.competition} •{" "}
              {event.start_time
                ? new Date(event.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "TBD"}
            </div>

            <div className="flex items-center justify-center space-x-8 mt-2">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-14 h-14 relative">
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
                <span className="text-sm font-medium text-gray-900">
                  {homeTeam.name}
                </span>
              </div>

              <div className="text-lg text-gray-500 font-medium">VS</div>

              <div className="flex flex-col items-center space-y-2">
                <div className="w-14 h-14 relative">
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
                <span className="text-sm font-medium text-gray-900">
                  {awayTeam.name}
                </span>
              </div>
            </div>
          </div>

          {/* Bet content */}
          <div className="p-5 space-y-6 border-t border-gray-200">
            {/* Selected bet pill */}
            <div className="flex items-center justify-center">
              <div className="px-6 py-2 bg-gray-100 rounded-full w-fit mx-auto">
                <div className="flex items-center space-x-3">
                  <span className="text-base font-semibold text-gray-900">
                    {selected.type}
                  </span>
                  <span className="text-base font-medium text-gray-700">
                    {selected.team}
                  </span>
                  <span className="text-base font-semibold text-blue-600">
                    {selected.odds.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Amount input */}
            <div className="space-y-4">
              <div className="text-center mb-1">
                <span className="text-sm text-gray-500">Monto de apuesta</span>
              </div>

              <div className="relative">
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  value={inputValue}
                  onChange={handleAmountChange}
                  onBlur={handleInputBlur}
                  onFocus={handleInputFocus}
                  className="text-center text-3xl font-semibold h-14 bg-gray-50 border-gray-200 focus-visible:ring-blue-500 rounded-xl"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
                    <span className="text-xs font-bold text-white">USDC</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center px-1">
                <span className="text-sm text-gray-500">Potencial</span>
                <span className="text-xl font-semibold text-blue-600">
                  ${getPotentialWin()} USDC
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              {maxBetAmount <= 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-full"
                  onClick={handleGetUSDC}
                >
                  Obtener USDC
                </Button>
              ) : (
                <Pay 
                  amount={Math.max(1, parseFloat(betAmount.toFixed(2)))} 
                  onSuccess={handlePaymentComplete}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Modal - shown after payment is complete */}
      <ConfirmationModal 
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        betDetails={betDetails}
      />
    </>
  );
}
