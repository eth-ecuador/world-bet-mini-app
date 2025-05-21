/**
 * Central configuration for UI components
 * This helps maintain consistent styles across the application
 */

export const theme = {
  button: {
    // Common style overrides for all buttons
    baseStyles: "rounded-full font-medium shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
    sizes: {
      default: "h-12 px-5",
      sm: "h-10 px-4 text-sm",
      lg: "h-[52px] min-w-[180px] px-6",
    },
    focused: "focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-blue-400",
  },
  
  statusColors: {
    // Colors for different application states
    info: {
      bg: "bg-blue-600",
      hover: "hover:bg-blue-700",
      text: "text-blue-600",
      border: "border-blue-600",
      bgLight: "bg-blue-100",
    },
    success: {
      bg: "bg-green-600",
      hover: "hover:bg-green-700",
      text: "text-green-600",
      border: "border-green-600",
      bgLight: "bg-green-100",
    },
    warning: {
      bg: "bg-amber-500",
      hover: "hover:bg-amber-600",
      text: "text-amber-500",
      border: "border-amber-500",
      bgLight: "bg-amber-100",
    },
    error: {
      bg: "bg-red-600",
      hover: "hover:bg-red-700",
      text: "text-red-600",
      border: "border-red-600",
      bgLight: "bg-red-100",
    },
  },
  
  animation: {
    // Reusable animation classes
    fadeIn: "animate-in fade-in duration-300",
    scaleIn: "animate-in zoom-in duration-300",
    pulseLight: "animate-pulse opacity-70",
  },
  
  spacing: {
    // Consistent spacing values
    container: "px-4 sm:px-6 lg:px-8",
    section: "py-8 md:py-12 lg:py-16",
    gap: {
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
  },
}; 