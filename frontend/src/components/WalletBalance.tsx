"use client";

import { useWalletBalance } from "@/hooks/useWalletBalance";
import { Token } from "@worldcoin/mini-apps-ui-kit-react";
import { Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { createPortal } from "react-dom";

export default function WalletBalance() {
  const { data: session } = useSession();
  const address = session?.user.id || "";

  const { balances, isLoading } = useWalletBalance(address);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Prevent body scrolling when modal is open
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

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

  const openModal = () => {
    console.log('Opening wallet modal');
    setShowModal(true);
  };

  const closeModal = () => {
    console.log('Closing wallet modal');
    setShowModal(false);
  };

  const Modal = () => {
    return (
      <div
        className="fixed inset-0 bg-black/80 flex items-center justify-center"
        style={{ 
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
        }}
        onClick={closeModal}
      >
        <div
          className="bg-[#0a0c12] text-white rounded-xl p-5 w-[90%] max-w-[350px] shadow-xl border border-gray-800"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-medium text-lg">Your Balance</h3>
            <button
              onClick={closeModal}
              className="p-1.5 hover:bg-[#1c2030] rounded-full transition-colors"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          {/* Address with copy */}
          <div className="flex items-center justify-between py-3 border-b border-gray-800 mb-4">
            <p className="text-sm text-gray-400">{shortAddress}</p>
            <button
              onClick={copyToClipboard}
              className="p-1.5 rounded-md hover:bg-[#1c2030] transition-colors"
              aria-label="Copy address"
            >
              {copied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} className="text-gray-400" />
              )}
            </button>
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
                  <Token value="USDC" size={32} />
                  <span className="font-medium">USDC</span>
                </div>
                <div className="font-bold text-xl">
                  {balances.USDC !== null ? balances.USDC : "0.00"}
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-[#1c2030] rounded-xl">
                <div className="flex items-center gap-3">
                  <Token value="WLD" size={32} />
                  <span className="font-medium">WLD</span>
                </div>
                <div className="font-bold text-xl">
                  {balances.WLD !== null ? balances.WLD : "0.00"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Preview Button */}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 px-4 py-2 h-10 bg-transparent border border-blue-500 text-white rounded-full hover:bg-[#1c2030]"
        onClick={openModal}
      >
        {isLoading ? (
          <span className="text-xs text-gray-300">Loading...</span>
        ) : (
          <div className="flex items-center gap-2">
            <Token value="USDC" size={20} />
            <span className="text-sm font-medium text-blue-500">
              {balances.USDC || "0.00"}
            </span>
          </div>
        )}
      </Button>

      {/* Modal Portal */}
      {mounted && showModal && createPortal(<Modal />, document.body)}
    </>
  );
}
