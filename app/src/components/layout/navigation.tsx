"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Bank, Home, User } from "iconoir-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * This component uses Shadcn UI for navigation between pages
 * Bottom navigation is the most common navigation pattern in Mini Apps
 * Follows mobile-first design patterns for mini apps
 */
export const Navigation = () => {
  const pathname = usePathname();
  
  // Determine the active tab based on the current pathname
  const getActiveTab = () => {
    if (pathname === "/") return "home";
    if (pathname.includes("/featured")) return "featured";
    if (pathname.includes("/profile")) return "profile";
    return "home";
  };

  const activeTab = getActiveTab();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background pb-safe-area">
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 p-0 h-16">
          <Link href="/" className="w-full h-full">
            <TabsTrigger 
              value="home" 
              className={cn(
                "flex flex-col items-center justify-center space-y-1 h-full rounded-none data-[state=active]:shadow-none",
                "text-xs font-normal",
                "data-[state=active]:bg-transparent data-[state=active]:text-primary"
              )}
            >
              <Home className={cn("h-5 w-5", activeTab === "home" ? "text-primary" : "text-muted-foreground")} />
              <span>Home</span>
            </TabsTrigger>
          </Link>

          <Link href="/featured" className="w-full h-full">
            <TabsTrigger 
              value="featured" 
              className={cn(
                "flex flex-col items-center justify-center space-y-1 h-full rounded-none data-[state=active]:shadow-none",
                "text-xs font-normal",
                "data-[state=active]:bg-transparent data-[state=active]:text-primary"
              )}
            >
              <Bank className={cn("h-5 w-5", activeTab === "featured" ? "text-primary" : "text-muted-foreground")} />
              <span>Featured</span>
            </TabsTrigger>
          </Link>

          <Link href="/profile" className="w-full h-full">
            <TabsTrigger 
              value="profile" 
              className={cn(
                "flex flex-col items-center justify-center space-y-1 h-full rounded-none data-[state=active]:shadow-none",
                "text-xs font-normal",
                "data-[state=active]:bg-transparent data-[state=active]:text-primary"
              )}
            >
              <User className={cn("h-5 w-5", activeTab === "profile" ? "text-primary" : "text-muted-foreground")} />
              <span>Profile</span>
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </div>
  );
};
