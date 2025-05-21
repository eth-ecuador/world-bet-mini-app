"use client";
import { OFF_RAMP_WALLET } from "@/lib/config/payments";
import { ExtendedButton } from "@/components/ui/extended-button";
import { theme } from "@/lib/config/ui";
import { cn } from "@/lib/utils";
import { payToPool } from "@/lib/contracts";
import { MiniKit, Tokens, tokenToDecimals } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";

/**
 * This component is used to pay a user
 * The payment command simply does an ERC20 transfer
 * But, it also includes a reference field that you can search for on-chain
 */
export const Pay = ({
  address = OFF_RAMP_WALLET,
  amount = 0.6,
  onSuccess,
}: {
  address?: string;
  amount?: number;
  onSuccess?: () => void;
}) => {
  const [buttonState, setButtonState] = useState<
    "idle" | "pending" | "success" | "failed"
  >("idle");
  const [paymentAmount, setPaymentAmount] = useState(amount);
  
  // Update payment amount when prop changes
  useEffect(() => {
    console.log("Payment amount updated:", amount);
    setPaymentAmount(amount);
  }, [amount]);

  const onClickPay = async () => {
    // Ensure we're using the latest amount
    const currentAmount = paymentAmount;
    console.log("Initiating payment with amount:", currentAmount);

    // Safety check - don't proceed with zero amount
    if (currentAmount <= 0) {
      console.error("Payment error: Amount must be greater than 0");
      setButtonState("failed");
      setTimeout(() => {
        setButtonState("idle");
      }, 3000);
      return;
    }

    const addressToPay =
      address || (await MiniKit.getUserByUsername("padimaster")).walletAddress;
    setButtonState("pending");

    try {
      const res = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: currentAmount,
          recipient: addressToPay
        })
      });
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      
      const { id } = await res.json();

      // For debugging on mobile
      console.log("Payment request created with ID:", id);
      console.log("Sending payment to:", addressToPay);
      console.log("Amount in USDC:", currentAmount);

      const result = await MiniKit.commandsAsync.pay({
        reference: id,
        to: addressToPay,
        tokens: [
          {
            symbol: Tokens.USDCE,
            token_amount: tokenToDecimals(currentAmount, Tokens.USDCE).toString(),
          },
        ],
        description: "Apuesta deportiva",
      });

      console.log("Payment result:", result.finalPayload);

      // Only proceed with pool transaction if payment was successful
      if (result.finalPayload.status === "success") {
        try {
          const poolResult = await MiniKit.commandsAsync.sendTransaction({
            transaction: payToPool(BigInt(currentAmount)),
          });
          console.log("Pool transaction result:", poolResult.finalPayload);
        } catch (poolError) {
          console.error("Pool transaction error:", poolError);
          // Continue with success status even if pool transaction fails
        }

        setButtonState("success");
        // It's important to actually check the transaction result on-chain
        // You should confirm the reference id matches for security
        // Read more here: https://docs.world.org/mini-apps/commands/pay#verifying-the-payment
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          // Slight delay to ensure the success state is visible
          setTimeout(() => {
            onSuccess();
          }, 1000);
        } else {
          // Reset to idle after 3 seconds if no callback
          setTimeout(() => {
            setButtonState("idle");
          }, 3000);
        }
      } else {
        console.error("Payment failed:", result.finalPayload);
        setButtonState("failed");
        setTimeout(() => {
          setButtonState("idle");
        }, 3000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setButtonState("failed");
      setTimeout(() => {
        setButtonState("idle");
      }, 3000);
    }
  };

  return (
    <div className="grid w-full gap-4">
      <div className="relative w-full">
        {buttonState === "failed" && (
          <div className={cn("absolute -top-8 left-0 right-0 text-center text-sm font-medium", theme.statusColors.error.text, theme.animation.fadeIn)}>
            El pago ha fallado
          </div>
        )}
        {buttonState === "success" && (
          <div className={cn("absolute -top-8 left-0 right-0 text-center text-sm font-medium", theme.statusColors.success.text, theme.animation.fadeIn)}>
            El pago ha sido exitoso
          </div>
        )}
        {buttonState === "pending" && (
          <div className={cn("absolute -top-8 left-0 right-0 text-center text-sm font-medium", theme.statusColors.info.text, theme.animation.fadeIn)}>
            Pago en progreso
          </div>
        )}
        
        <ExtendedButton
          onClick={onClickPay}
          state={buttonState}
          idleText={`Pagar ${paymentAmount.toFixed(2)} USDC`}
          pendingText="Procesando..."
          successText="¡Pago Exitoso!"
          failedText="Reintentar"
          className="w-full h-14 text-lg font-medium rounded-full shadow-sm"
          size="lg"
        />
      </div>
    </div>
  );
};
