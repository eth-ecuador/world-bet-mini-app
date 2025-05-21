"use client";
import { walletAuth } from "@/auth/wallet";
import { ExtendedButton } from "@/components/ui/extended-button";
import { theme } from "@/lib/config/ui";
import { cn } from "@/lib/utils";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { useCallback, useEffect, useState } from "react";

/**
 * This component is an authentication button with enhanced UX
 */
export const AuthButton = () => {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");
  const { isInstalled } = useMiniKit();

  const onClick = useCallback(async () => {
    if (!isInstalled || status === "pending") {
      return;
    }
    setStatus("pending");
    try {
      await walletAuth();
      setStatus("success");
      // Reset success status after 3 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Wallet authentication button error", error);
      setStatus("failed");
      return;
    }
  }, [isInstalled, status]);

  useEffect(() => {
    const authenticate = async () => {
      if (isInstalled && status === "idle") {
        setStatus("pending");
        try {
          // Auto authentication logic here
          setStatus("idle");
        } catch (error) {
          console.error("Auto wallet authentication error", error);
          setStatus("idle");
        }
      }
    };

    authenticate();
  }, [isInstalled, status]);

  return (
    <div className="flex flex-col items-center" role="region" aria-live="polite">
      <div className="h-6 mb-2 flex items-center justify-center">
        {status === "failed" && (
          <div className={cn("text-sm font-medium", theme.statusColors.error.text, theme.animation.fadeIn)}>
            Error al iniciar sesión
          </div>
        )}
        {status === "success" && (
          <div className={cn("text-sm font-medium", theme.statusColors.success.text, theme.animation.fadeIn)}>
            Sesión exitosa
          </div>
        )}
      </div>
      
      <ExtendedButton
        onClick={onClick}
        disabled={!isInstalled}
        state={status}
        idleText="Ingresar"
        successText="Ingresado"
        failedText="Reintentar"
      />
      
      {!isInstalled && (
        <div className={cn(
          "mt-3 text-xs font-medium px-4 py-2 rounded-full",
          theme.statusColors.warning.text,
          "bg-amber-400/10"
        )}>
          Por favor instala la aplicación para continuar
        </div>
      )}
    </div>
  );
};
