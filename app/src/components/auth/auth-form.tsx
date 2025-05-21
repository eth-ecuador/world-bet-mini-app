"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ExtendedButton } from "@/components/ui/extended-button";
import { theme } from "@/lib/config/ui";
import { cn } from "@/lib/utils";
import { walletAuth } from "@/auth/wallet";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";

export default function LoginForm() {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");
  const { isInstalled } = useMiniKit();

  const handleAuth = useCallback(async () => {
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
      console.error("Wallet authentication error", error);
      setStatus("failed");
    }
  }, [isInstalled, status]);

  // Auto authentication check on mount
  useEffect(() => {
    const authenticate = async () => {
      if (isInstalled && status === "idle") {
        setStatus("pending");
        try {
          // Auto authentication logic here if needed
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md relative"
    >
      <div className="absolute -top-12 left-1/2 -translate-x-1/2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0047FF] to-[#B0FF00] flex items-center justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#F5F5F5] text-2xl font-bold">
            SPORT
          </div>
        </motion.div>
      </div>

      <div className="bg-[#2A2A2A] rounded-3xl overflow-hidden shadow-2xl border border-[#F5F5F5]/10">
        <div className="p-8 pt-16">
          <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-[#F5F5F5]/60 text-center mb-8">
            Sign in to continue to SportsFusion
          </p>

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
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <ExtendedButton
                onClick={handleAuth}
                disabled={!isInstalled}
                state={status}
                idleText="Sign In"
                successText="Signed In"
                failedText="Retry"
                className="w-full min-w-[220px]"
              />
            </motion.div>
            
            {!isInstalled && (
              <div className={cn(
                "mt-3 text-xs font-medium px-4 py-2 rounded-full",
                theme.statusColors.warning.text,
                "bg-amber-400/10"
              )}>
                Please install the application to continue
              </div>
            )}
          </div>
        </div>

        <div className="h-2 w-full bg-gradient-to-r from-[#0047FF] to-[#B0FF00]"></div>
      </div>
    </motion.div>
  );
}
