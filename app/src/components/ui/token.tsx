import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const tokenVariants = cva(
  "flex items-center justify-center rounded-full bg-gradient-to-br font-bold text-white",
  {
    variants: {
      size: {
        sm: "h-5 w-5 text-[8px]",
        default: "h-8 w-8 text-xs",
        lg: "h-12 w-12 text-sm",
      },
      variant: {
        USDC: "from-blue-500 to-blue-700 border border-blue-400/30",
        WLD: "from-purple-500 to-indigo-700 border border-purple-400/30",
        ETH: "from-gray-500 to-gray-700 border border-gray-400/30",
        MATIC: "from-purple-500 to-violet-700 border border-purple-400/30",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "USDC",
    },
  }
);

type TokenSymbol = "USDC" | "WLD" | "ETH" | "MATIC";

export interface TokenProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof tokenVariants>, "variant"> {
  value: string;
  variant?: TokenSymbol;
}

export function Token({ 
  className, 
  value, 
  size, 
  variant,
  ...props 
}: TokenProps) {
  // Use token symbol for both display and as variant if valid
  const symbol = value.toUpperCase();
  // Use either the provided variant or try to use the value as a variant, defaulting to USDC
  const tokenVariant = (variant || (["USDC", "WLD", "ETH", "MATIC"].includes(symbol) ? symbol : "USDC")) as TokenSymbol;

  return (
    <div
      className={cn(tokenVariants({ size, variant: tokenVariant }), className)}
      {...props}
    >
      {symbol}
    </div>
  );
} 