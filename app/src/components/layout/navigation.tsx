"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Home, Trophy, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

/**
 * Navigation with gradient-style active indicators
 * Follows accessibility best practices despite removing text labels
 * Uses motion effects to enhance visual feedback
 */
export const Navigation = () => {
  const pathname = usePathname();
  
  // Determine the active tab based on the current pathname
  const getActiveTab = () => {
    if (pathname === "/" || pathname.includes("/home")) return "home";
    if (pathname.includes("/featured")) return "featured";
    if (pathname.includes("/profile")) return "profile";
    return "home";
  };

  const activeTab = getActiveTab();

  // Animation variants for icons
  const iconVariants = {
    active: { 
      scale: 1.2,
      y: -2,
      transition: { type: "spring", stiffness: 500 }
    },
    inactive: { 
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 500 }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 justify-evenly bg-[#2A2A2A] pb-safe-area shadow-[0_-4px_6px_rgba(0,0,0,0.1)]">
      <div className="h-1 w-full bg-gradient-to-r from-[#0047FF] to-[#B0FF00]"></div>
      
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 p-0 h-16 bg-transparent">
          <Link href="/" className="w-full h-full flex items-center justify-center">
            <TabsTrigger 
              value="home" 
              aria-label="Home"
              className={cn(
                "flex flex-col items-center justify-center h-full w-full rounded-none data-[state=active]:shadow-none",
                "data-[state=active]:bg-transparent"
              )}
            >
              <motion.div
                variants={iconVariants}
                animate={activeTab === "home" ? "active" : "inactive"}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center"
              >
                <Home 
                  className={cn("h-10 w-10", 
                    activeTab === "home" 
                      ? "text-transparent" 
                      : "text-gray-400"
                  )} 
                  style={activeTab === "home" ? {
                    stroke: "url(#blue-green-gradient)",
                    strokeWidth: 2.5
                  } : {}} 
                />
              </motion.div>
            </TabsTrigger>
          </Link>

          <Link href="/featured" className="w-full h-full flex items-center justify-center">
            <TabsTrigger 
              value="featured" 
              aria-label="Featured"
              className={cn(
                "flex flex-col items-center justify-center h-full w-full rounded-none data-[state=active]:shadow-none",
                "data-[state=active]:bg-transparent"
              )}
            >
              <motion.div
                variants={iconVariants}
                animate={activeTab === "featured" ? "active" : "inactive"}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center"
              >
                <Trophy 
                  className={cn("h-10 w-10", 
                    activeTab === "featured" 
                      ? "text-transparent" 
                      : "text-gray-400"
                  )} 
                  style={activeTab === "featured" ? {
                    stroke: "url(#blue-green-gradient)",
                    strokeWidth: 2.5
                  } : {}} 
                />
              </motion.div>
            </TabsTrigger>
          </Link>

          <Link href="/profile" className="w-full h-full flex items-center justify-center">
            <TabsTrigger 
              value="profile" 
              aria-label="Profile"
              className={cn(
                "flex flex-col items-center justify-center h-full w-full rounded-none data-[state=active]:shadow-none",
                "data-[state=active]:bg-transparent"
              )}
            >
              <motion.div
                variants={iconVariants}
                animate={activeTab === "profile" ? "active" : "inactive"}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center"
              >
                <User 
                  className={cn("h-10 w-10", 
                    activeTab === "profile" 
                      ? "text-transparent" 
                      : "text-gray-400"
                  )} 
                  style={activeTab === "profile" ? {
                    stroke: "url(#blue-green-gradient)",
                    strokeWidth: 2.5
                  } : {}} 
                />
              </motion.div>
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
      
      {/* SVG definitions for gradient stroke on icons */}
      <svg width="0" height="0" className="absolute">
        <linearGradient id="blue-green-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0047FF" />
          <stop offset="100%" stopColor="#B0FF00" />
        </linearGradient>
      </svg>
    </div>
  );
};
