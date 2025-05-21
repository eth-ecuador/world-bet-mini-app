"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Token } from "@/components/ui/token";
import { theme } from "@/lib/config/ui";
import { cn } from "@/lib/utils";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { Check, Copy, Wallet, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function WalletBalance() {
  const { data: session } = useSession();
  const address = session?.user.id || "";

  const { balances, isLoading } = useWalletBalance(address);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Short address display
  const shortAddress = address
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : "";

    return (
    <>
      {/* Preview Button */}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center justify-center w-10 h-10 p-0 bg-transparent border border-blue-500 text-white rounded-full hover:bg-[#1c2030]"
        onClick={() => setShowModal(true)}
        aria-label="View wallet balance"
      >
        <Wallet size={18} className="text-blue-500" />
      </Button>

      {/* Wallet Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent 
          className="bg-[#0a0c12] text-white border border-gray-800 p-0 sm:rounded-xl max-w-[350px]"
        >
          {/* Custom close button */}
          <div className="absolute right-4 top-4">
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-1.5 hover:bg-[#1c2030] rounded-full transition-colors h-auto w-auto"
            >
              <X size={18} className="text-gray-400" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>

          <DialogHeader className="px-5 pt-5 pb-0">
            <div className="flex items-center">
              <DialogTitle className="text-lg font-medium">Your Balance</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="px-5 pb-5">
          {/* Address with copy */}
          <div className="flex items-center justify-between py-3 border-b border-gray-800 mb-4">
            <p className="text-sm text-gray-400">{shortAddress}</p>
              <Button
                variant="ghost"
                size="sm"
              onClick={copyToClipboard}
                className="p-1.5 rounded-md hover:bg-[#1c2030] transition-colors h-auto"
              aria-label="Copy address"
            >
              {copied ? (
                  <Check size={16} className={cn("text-green-500", theme.animation.fadeIn)} />
              ) : (
                <Copy size={16} className="text-gray-400" />
              )}
              </Button>
          </div>

          {/* Token balances */}
          {isLoading ? (
            <div className="py-4 text-center text-gray-400 text-sm">
              Loading...
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-[#1c2030] rounded-xl">
                <div className="flex items-center gap-3">
                    <Token value="USDC" size="lg" />
                  <span className="font-medium">USDC</span>
                </div>
                <div className="font-bold text-xl">
                  {balances.USDC !== null ? balances.USDC : "0.00"}
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-[#1c2030] rounded-xl">
                <div className="flex items-center gap-3">
                    <Token value="WLD" size="lg" />
                  <span className="font-medium">WLD</span>
                </div>
                <div className="font-bold text-xl">
                  {balances.WLD !== null ? balances.WLD : "0.00"}
                </div>
              </div>
            </div>
          )}
        </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
