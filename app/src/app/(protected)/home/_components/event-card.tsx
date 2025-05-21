"use client";

import { useState } from "react";
import Image from "next/image";
import type { Event } from "@/services/events/events.type";
import BettingModal from "./betting-modal";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event?: Event;
  bettingAmount?: number;
}

export default function EventCard({ event, bettingAmount = 20 }: EventCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Handle missing data cases
  if (!event || !event.teams || event.teams.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-4">
          <p className="text-center text-sm text-muted-foreground">
            {!event ? "Event data unavailable" : "Team information unavailable"}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get team data
  const homeTeam = event.teams.find((team) => team.is_home);
  const awayTeam = event.teams.find((team) => !team.is_home);

  if (!homeTeam || !awayTeam) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-4">
          <p className="text-center text-sm text-muted-foreground">
            Team information unavailable
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get odds data
  const hasMarkets = event.main_markets && event.main_markets.length > 0;
  const mainMarket = hasMarkets ? event.main_markets[0] : null;
  const odds = {
    home: mainMarket?.selections?.[0]?.odds || 1.85,
    draw: mainMarket?.selections?.[1]?.odds || 3.4,
    away: mainMarket?.selections?.[2]?.odds || 4.1,
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowModal(true);
  };

  // Format time
  const formattedTime = event.start_time
    ? new Date(event.start_time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "TBD";

  return (
    <Card className="max-w-md mx-auto overflow-hidden w-full shadow-sm">
      {/* Teams */}
      <CardContent className="px-6">
        <div className="flex flex-col items-center mb-2">
          <div className="flex justify-center items-center space-x-3 text-xs text-muted-foreground">
            <span>{event.competition || "League"}</span>
            <span>•</span>
            <span>{formattedTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center w-[40%]">
            <div className="w-12 h-12 relative">
              <Image
                src={homeTeam.logo_url || "/placeholder.svg"}
                alt={homeTeam.name}
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            <p className="text-sm font-medium text-center mt-1 truncate max-w-32">
              {homeTeam.name}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-base font-medium">VS</span>
          </div>

          <div className="flex flex-col items-center w-[40%]">
            <div className="w-12 h-12 relative">
              <Image
                src={awayTeam.logo_url || "/placeholder.svg"}
                alt={awayTeam.name}
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            <p className="text-sm font-medium text-center mt-1 truncate max-w-32">
              {awayTeam.name}
            </p>
          </div>
        </div>

        {/* Betting options */}
        {hasMarkets ? (
          <div className="grid grid-cols-3 gap-2 mt-4">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-16 py-2 hover:border-primary"
              onClick={() => handleOptionSelect("home")}
            >
              <span className="text-xs text-muted-foreground">1</span>
              <span className="text-lg font-semibold">
                {odds.home.toFixed(2)}
              </span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-16 py-2 hover:border-primary"
              onClick={() => handleOptionSelect("draw")}
            >
              <span className="text-xs text-muted-foreground">X</span>
              <span className="text-lg font-semibold">
                {odds.draw.toFixed(2)}
              </span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-16 py-2 hover:border-primary"
              onClick={() => handleOptionSelect("away")}
            >
              <span className="text-xs text-muted-foreground">2</span>
              <span className="text-lg font-semibold">
                {odds.away.toFixed(2)}
              </span>
            </Button>
          </div>
        ) : (
          <div className="rounded-lg p-2 w-full bg-muted text-center text-xs text-muted-foreground mt-4">
            No odds available
          </div>
        )}
      </CardContent>

      {/* Betting Modal */}
      {hasMarkets && (
        <BettingModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            // Optionally reset selection when closing modal
            // setSelectedOption(null);
          }}
          event={event}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          mainMarket={mainMarket}
          odds={odds}
          initialSelection={selectedOption || undefined}
          bettingAmount={bettingAmount}
        />
      )}
    </Card>
  );
}
