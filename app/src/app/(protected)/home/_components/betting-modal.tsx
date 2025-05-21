"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  bettingAmount?: number;
}

export default function BettingModal({
  isOpen,
  onClose,
  event,
  homeTeam,
  awayTeam,
  mainMarket,
  odds,
  initialSelection,
  bettingAmount = 20
}: BettingModalProps) {
  const paymentWallet = OFF_RAMP_WALLET || "0x1fb249bfa4ffB9fa98529692889d38359a57294D";
  const [selectedOption, setSelectedOption] = useState<string | null>(initialSelection || null);
  const [betAmount, setBetAmount] = useState(bettingAmount);
  const [inputValue, setInputValue] = useState(bettingAmount.toFixed(2));
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { walletAddress, externalApiAuthenticated } = useAuthComplete();
  const address = walletAddress || "";
  const { balances } = useWalletBalance(address);

  // Calculate max bet amount (USDC balance minus 0.2)
  const maxBetAmount = balances.USDC ? parseFloat(balances.USDC) - 0.2 : 0;
  const wldBalance = balances.WLD ? parseFloat(balances.WLD) - 0.2 : 0;

  // Set initial bet amount based on the user's USDC balance and the passed bettingAmount
  useEffect(() => {
    // Use the passed bettingAmount if available
    const defaultAmount = bettingAmount;
    
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
  }, [maxBetAmount, balances.USDC, bettingAmount]);
  
  // Set the selected option when initialSelection changes or modal opens
  useEffect(() => {
    if (initialSelection) {
      setSelectedOption(initialSelection);
    }
  }, [initialSelection, isOpen]);

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
        alert(`¡Apuesta realizada! ${selectedOption} - $${getValidBetAmount().toFixed(2)}`);
        onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-base font-medium">Realizar apuesta</DialogTitle>
            {isOpen && <WalletBalance />}
          </div>
        </DialogHeader>

        <Separator />

        <form onSubmit={handleBetSubmit} className="space-y-4 p-4">
          {/* Match Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 relative">
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
              <span className="text-muted-foreground">vs</span>
              <div className="w-8 h-8 relative">
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
            </div>
            <span className="text-xs text-muted-foreground">
              {event.competition || "Unknown"} • 
              {event.start_time
                ? new Date(event.start_time).toLocaleTimeString([], { 
                    hour: "2-digit", 
                    minute: "2-digit" 
                  })
                : "TBD"}
            </span>
          </div>

          {/* Selected Bet */}
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground">Tu apuesta</p>
                <p className="font-medium">
                  {selected.type} • {selected.team}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Cuota</p>
                <p className="font-medium">{selected.odds.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount" className="text-xs">
                Monto de apuesta
              </Label>
              {maxBetAmount > 0 && (
                <p className="text-xs text-muted-foreground">
                  Max: {maxBetAmount.toFixed(2)}
                </p>
              )}
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
                className="pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground flex items-center">
                <Token value="USDC" size="sm" />
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Ganancia potencial</span>
              <span className="font-medium text-green-600">${getPotentialWin()}</span>
            </div>
          </div>

          {/* Get USDC Button */}
          {maxBetAmount <= 0 && (
            <Button
              type="button"
              variant="outline"
              className="w-full text-blue-600 bg-blue-100 hover:bg-blue-200 border-blue-200"
              onClick={handleGetUSDC}
            >
              Obtener USDC
            </Button>
          )}

          <DialogFooter className="pt-2">
            {selectedOption && maxBetAmount > 0 ? (
              <Pay address={paymentWallet} amount={getValidBetAmount()} />
            ) : (
              <Button
                type="submit"
                className="w-full"
                disabled={isProcessing || !selectedOption || betAmount <= 0 || maxBetAmount <= 0}
              >
                {isProcessing ? (
                  <span className="flex items-center">Procesando...</span>
                ) : maxBetAmount <= 0 ? (
                  <span className="flex items-center">
                    Primero obtén USDC
                  </span>
                ) : (
                  <span className="flex items-center">
                    Realizar Apuesta <Check className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
