"use client";
import { OFF_RAMP_WALLET } from "@/lib/config/payments";
import { ExtendedButton } from "@/components/ui/extended-button";
import { theme } from "@/lib/config/ui";
import { cn } from "@/lib/utils";
import { payToPool } from "@/lib/contracts";
import { MiniKit, Tokens, tokenToDecimals } from "@worldcoin/minikit-js";
import { useState } from "react";

/**
 * This component is used to pay a user
 * The payment command simply does an ERC20 transfer
 * But, it also includes a reference field that you can search for on-chain
 */
export const Pay = ({
  address = OFF_RAMP_WALLET,
  amount = 0.6,
}: {
  address?: string;
  amount?: number;
}) => {
  const [buttonState, setButtonState] = useState<
    "idle" | "pending" | "success" | "failed"
  >("idle");

  const onClickPay = async () => {
    const addressToPay =
      address || (await MiniKit.getUserByUsername("padimaster")).walletAddress;
    setButtonState("pending");

    try {
      const res = await fetch("/api/initiate-payment", {
        method: "POST",
      });
      const { id } = await res.json();

      const result = await MiniKit.commandsAsync.pay({
        reference: id,
        to: addressToPay,
        tokens: [
          {
            symbol: Tokens.USDCE,
            token_amount: tokenToDecimals(amount, Tokens.USDCE).toString(),
          },
        ],
        description: "Pago",
      });

      const poolResult = await MiniKit.commandsAsync.sendTransaction({
        transaction: payToPool(BigInt(amount)),
      });

      console.log(poolResult.finalPayload);
      if (result.finalPayload.status === "success") {
        setButtonState("success");
        // It's important to actually check the transaction result on-chain
        // You should confirm the reference id matches for security
        // Read more here: https://docs.world.org/mini-apps/commands/pay#verifying-the-payment
        
        // Reset to idle after 3 seconds
        setTimeout(() => {
          setButtonState("idle");
        }, 3000);
      } else {
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
          idleText="Pagar"
          pendingText="Procesando..."
          successText="¡Pago Exitoso!"
          failedText="Reintentar"
          className="w-full"
          size="lg"
        />
      </div>
    </div>
  );
};
