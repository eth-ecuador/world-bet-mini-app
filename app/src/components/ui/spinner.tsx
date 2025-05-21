import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const spinnerVariants = cva(
  "relative inline-block",
  {
    variants: {
      size: {
        default: "w-5 h-5",
        sm: "w-4 h-4",
        lg: "w-6 h-6",
      },
      variant: {
        default: "text-white",
        primary: "text-white",
        secondary: "text-secondary-foreground",
        muted: "text-muted-foreground",
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    }
  }
);

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export function Spinner({ size, variant, className }: SpinnerProps) {
  return (
    <div className={cn(spinnerVariants({ size, variant }), className)} aria-hidden="true">
      <div className="absolute top-0 left-0 w-full h-full border-2 border-current opacity-30 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-2 border-current rounded-full border-b-transparent animate-spin"></div>
    </div>
  );
} 