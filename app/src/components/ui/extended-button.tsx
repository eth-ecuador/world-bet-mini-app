import { ButtonProps, Button } from "@/components/ui/button";
import { CheckIcon, ErrorIcon, LoginIcon } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/spinner";
import { theme } from "@/lib/config/ui";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export type ButtonState = "idle" | "pending" | "success" | "failed";

export interface ExtendedButtonProps extends Omit<ButtonProps, "children"> {
  state?: ButtonState;
  idleText: string;
  pendingText?: string;
  successText?: string;
  failedText?: string;
  showIcon?: boolean;
}

/**
 * Extended button component that handles different states with consistent styling
 */
export const ExtendedButton = forwardRef<HTMLButtonElement, ExtendedButtonProps>(
  ({ 
    state = "idle", 
    idleText, 
    pendingText = "", 
    successText = "Success", 
    failedText = "Retry", 
    showIcon = true, 
    className,
    variant = "primary",
    size = "lg",
    ...props 
  }, ref) => {
    // State-dependent configuration
    const getStateConfig = () => {
      switch (state) {
        case "idle":
          return {
            text: idleText,
            icon: showIcon ? <LoginIcon className="mr-2" /> : null,
            ariaLabel: idleText,
            stateClass: ""
          };
        case "pending":
          return {
            text: pendingText,
            icon: <Spinner className="mr-2" />,
            ariaLabel: "Loading, please wait",
            stateClass: ""
          };
        case "success":
          return {
            text: successText,
            icon: showIcon ? <CheckIcon className="mr-2" /> : null,
            ariaLabel: "Success",
            stateClass: cn(theme.statusColors.success.bg, theme.statusColors.success.hover)
          };
        case "failed":
          return {
            text: failedText,
            icon: showIcon ? <ErrorIcon className="mr-2" /> : null,
            ariaLabel: "Error, please retry",
            stateClass: cn(theme.statusColors.error.bg, theme.statusColors.error.hover)
          };
      }
    };

    const config = getStateConfig();
    
    // Additional styles based on state
    const stateStyles = cn(
      theme.button.baseStyles,
      theme.button.focused,
      config.stateClass
    );

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        aria-label={config.ariaLabel}
        disabled={state === "pending" || props.disabled}
        className={cn(stateStyles, className)}
        {...props}
      >
        <span className="flex items-center justify-center">
          {config.icon}
          {(state !== "pending" || pendingText) && (
            <span className="transition-opacity duration-200">
              {config.text}
            </span>
          )}
        </span>
      </Button>
    );
  }
);

ExtendedButton.displayName = "ExtendedButton"; 