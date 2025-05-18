"use client";
import { OFF_RAMP_WALLET } from "@/config";
import { payToPool } from "@/lib/contracts";
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
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
    "pending" | "success" | "failed" | undefined
  >(undefined);

  const onClickPay = async () => {
    const addressToPay =
      address || (await MiniKit.getUserByUsername("padimaster")).walletAddress;
    setButtonState("pending");

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
    } else {
      setButtonState("failed");
      setTimeout(() => {
        setButtonState(undefined);
      }, 3000);
    }
  };

  return (
    <div className="grid w-full gap-4">
      <LiveFeedback
        label={{
          failed: "El pago ha fallado",
          pending: "Pago en progreso",
          success: "El pago ha sido exitoso",
        }}
        state={buttonState}
        className="w-full"
      >
        <Button
          onClick={onClickPay}
          disabled={buttonState === "pending"}
          size="lg"
          variant="primary"
          className="w-full"
        >
          Pagar
        </Button>
      </LiveFeedback>
    </div>
  );
};
