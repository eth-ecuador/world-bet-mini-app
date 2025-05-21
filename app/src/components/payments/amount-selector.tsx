"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { theme } from "@/lib/config/ui";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export interface AmountSelectorProps {
  /** Initial amount value */
  initialAmount?: number;
  /** Callback when amount changes */
  onAmountChange?: (amount: number) => void;
  /** Minimum allowed amount */
  minAmount?: number;
  /** Maximum allowed amount override (if not provided, wallet balance will be used) */
  maxAmount?: number;
  /** Currency symbol/code to display */
  currency?: string;
  /** CSS class name */
  className?: string;
}

export default function AmountSelector({
  initialAmount = 20,
  onAmountChange,
  minAmount = 0,
  maxAmount = 100,
  currency = "USDC",
  className,
}: AmountSelectorProps) {
  // Get wallet address from session
  const { data: session } = useSession();
  const walletAddress = session?.user?.walletAddress || "";

  // Get wallet balance
  const { balances, isLoading } = useWalletBalance(walletAddress);

  // Calculate max amount based on wallet balance or override
  const walletBalance = currency === "WLD";

  const [amount, setAmount] = useState(Math.min(initialAmount, maxAmount));
  const [inputValue, setInputValue] = useState(
    Math.min(initialAmount, maxAmount).toString()
  );
  const [isEditing, setIsEditing] = useState(false);
  const [debouncedAmount, setDebouncedAmount] = useState(amount);

  // Update amount and inputValue when maxAmount changes
  useEffect(() => {
    const clampedAmount = Math.min(amount, maxAmount);
    if (clampedAmount !== amount) {
      setAmount(clampedAmount);
      setInputValue(clampedAmount.toString());
    }
  }, [maxAmount, amount]);

  useEffect(() => {
    const clampedAmount = Math.min(initialAmount, maxAmount);
    setAmount(clampedAmount);
    setInputValue(clampedAmount.toString());
  }, [initialAmount, maxAmount]);

  // Debounce the amount changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(amount);
    }, 100); // 100ms debounce time
    
    return () => clearTimeout(timer);
  }, [amount]);
  
  // Only call onAmountChange when debouncedAmount changes
  useEffect(() => {
    onAmountChange?.(debouncedAmount);
  }, [debouncedAmount, onAmountChange]);

  const handleSliderChange = useCallback((value: number[]) => {
    const newAmount = value[0];
    setAmount(newAmount);
    setInputValue(newAmount.toString());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsEditing(true);

    // Allow empty input for better UX while typing
    if (value === "") {
      setInputValue("");
      return;
    }

    // Only allow numeric input
    if (!/^\d*$/.test(value)) {
      return;
    }

    setInputValue(value);

    const numValue = Number.parseInt(value, 10);

    // Check if it's a valid number and within range
    if (!isNaN(numValue)) {
      const clampedValue = Math.min(Math.max(minAmount, numValue), maxAmount);
      setAmount(clampedValue);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    // If input is empty on blur, reset to current amount
    if (inputValue === "") {
      setInputValue(amount.toString());
    } else {
      // Ensure the value is within bounds when user finishes editing
      const numValue = Number.parseInt(inputValue, 10);
      if (!isNaN(numValue)) {
        const clampedValue = Math.min(Math.max(minAmount, numValue), maxAmount);
        setAmount(clampedValue);
        setInputValue(clampedValue.toString());
      } else {
        setInputValue(amount.toString());
      }
    }
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  const isMinAmount = amount === minAmount;
  const isMaxAmount = amount === maxAmount;

  // Calculate percentage for gradient coloring
  const percentage = ((amount - minAmount) / (maxAmount - minAmount)) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full max-w-sm mx-auto", className)}
    >
      <div className="bg-[#2A2A2A] rounded-xl p-6 border border-[#F5F5F5]/10 transition-all duration-200 hover:border-[#F5F5F5]/20 shadow-md overflow-hidden">
        <div className="text-center mb-4">
          <div className="relative inline-flex items-center group">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              aria-label={`Amount in ${currency}`}
              className={cn(
                "text-white text-4xl font-bold tracking-wide bg-transparent text-center focus:outline-none transition-colors",
                isEditing
                  ? "border-b-2 border-gradient-to-r from-[#0047FF] to-[#B0FF00]"
                  : "border-b-2 border-transparent",
                "focus:ring-0"
              )}
              style={{ maxWidth: `${Math.max(inputValue.length, 2) + 1}ch` }}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <span className="text-white text-4xl font-bold tracking-wide ml-2">
              {currency}
            </span>
          </div>
        </div>

        <div className="relative mt-8">
          {isLoading && (
            <div className="absolute -top-4 w-full text-center text-xs text-gray-400">
              Cargando...
            </div>
          )}
          
          {/* Custom slider track with gradient */}
          <div className="relative h-2 rounded-full bg-[#1A1A1A] mb-4">
            <div 
              className="absolute h-full rounded-full bg-gradient-to-r from-[#0047FF] to-[#B0FF00]"
              style={{ width: `${percentage}%` }}
            ></div>
            
            {/* Slider thumb */}
            <div 
              className="absolute w-5 h-5 rounded-full bg-white border-2 border-[#0047FF] shadow-md cursor-pointer transform -translate-y-1/2 -translate-x-1/2 top-1/2"
              style={{ left: `${percentage}%` }}
            ></div>
          </div>
          
          <Slider
            value={[amount]}
            max={maxAmount}
            min={minAmount}
            step={1}
            onValueChange={handleSliderChange}
            className="mt-2 [&_[data-slot=slider-track]]:bg-transparent [&_[data-slot=slider-range]]:bg-transparent [&_[data-slot=slider-thumb]]:opacity-0"
            aria-label={`Amount slider from ${minAmount} to ${maxAmount} ${currency}`}
          />
          
          <div className="flex justify-between mt-2">
            <div
              className={cn(
                "text-sm font-medium transition-colors",
                isMinAmount ? "text-white" : "text-gray-400"
              )}
            >
              MIN
            </div>
            <div
              className={cn(
                "text-sm font-medium transition-colors",
                isMaxAmount 
                  ? "bg-gradient-to-r from-[#0047FF] to-[#B0FF00] text-transparent bg-clip-text font-bold" 
                  : "text-gray-400"
              )}
            >
              MAX
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
