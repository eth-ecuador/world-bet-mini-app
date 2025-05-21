"use client";

import { getEvents, EventsFilterParams, SPORT_TYPES } from "@/services/events/events.service";
import { GetEventsResponse } from "@/services/events/events.type";
import React, { useEffect, useState, memo } from "react";
import EventCard from "./event-card";
import { parseISO, startOfDay, endOfDay } from "date-fns";

// Memoize EventCard to prevent unnecessary re-renders
const MemoizedEventCard = memo(EventCard);

interface EventsProps {
  selectedDate: Date;
  bettingAmount: number;
  sportType?: string;
}

export default function Events({ selectedDate, bettingAmount, sportType = SPORT_TYPES.FOOTBALL }: EventsProps) {
  const [eventsData, setEventsData] = useState<GetEventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventsFilterParams>({
    limit: 10,
    page: 1,
    sport_type: sportType
  });

  // Update filters when sport type changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      sport_type: sportType
    }));
  }, [sportType]);

  // Load more events
  const loadMore = () => {
    setFilters(prev => ({
      ...prev,
      page: (prev.page || 1) + 1,
      limit: (prev.limit || 10) + 10
    }));
  };

  // Format date for API request with ISO format including time (YYYY-MM-DDThh:mm:ss)
  const formatDateForAPI = (date: Date | string, isStartOfDay = true): string => {
    try {
      // If it's already a string in ISO format, parse it first
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      
      // Get start or end of day based on the parameter
      const targetDate = isStartOfDay ? startOfDay(dateObj) : endOfDay(dateObj);
      
      // Return the full ISO string (YYYY-MM-DDThh:mm:ss)
      return targetDate.toISOString().slice(0, 19);
    } catch (error) {
      console.error("Error formatting date:", error);
      // Return today as fallback
      return new Date().toISOString().slice(0, 19);
    }
  };

  // Fetch events with current filters
  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // If selectedDate is provided, format it with ISO time for the API
      const currentFilters = { 
        ...filters,
        sport_type: sportType // Ensure current sport type is used
      };
      
      if (selectedDate) {
        // For date_from use start of day (00:00:00)
        const fromDate = formatDateForAPI(selectedDate, true);
        // For date_to use end of day (23:59:59)
        const toDate = formatDateForAPI(selectedDate, false);
        
        console.log(`Using date range for ${sportType} API:`, fromDate, "to", toDate);
        
        currentFilters.date_from = fromDate;
        currentFilters.date_to = toDate;
      }
      
      const data = await getEvents(currentFilters);

      if (!data || !data.events) {
        setError(`No ${sportType} event data available`);
        return;
      }

      setEventsData(data);
      console.log(`${sportType} events loaded:`, data);
    } catch (error) {
      console.error(`Error fetching ${sportType} events:`, error);
      setError(`Failed to load ${sportType} events`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events when component mounts, filters change, selectedDate changes, or sportType changes
  useEffect(() => {
    if (selectedDate) {
      console.log(`Selected date for ${sportType}:`, selectedDate);
    }
    fetchEvents();
  }, [filters, selectedDate, sportType]);

  // Get the appropriate sport icon
  const getSportIcon = () => {
    switch(sportType) {
      case SPORT_TYPES.FOOTBALL: return "⚽";
      case SPORT_TYPES.BASKETBALL: return "🏀";
      case SPORT_TYPES.TENNIS: return "🎾";
      case SPORT_TYPES.CRICKET: return "🏏";
      case SPORT_TYPES.VOLLEYBALL: return "🏐";
      case SPORT_TYPES.RUGBY: return "🏉";
      default: return "🏆";
    }
  };

  // Get appropriate sport display name
  const getSportName = () => {
    switch(sportType) {
      case SPORT_TYPES.FOOTBALL: return "fútbol";
      case SPORT_TYPES.BASKETBALL: return "baloncesto";
      case SPORT_TYPES.TENNIS: return "tenis";
      case SPORT_TYPES.CRICKET: return "cricket";
      case SPORT_TYPES.VOLLEYBALL: return "voleibol";
      case SPORT_TYPES.RUGBY: return "rugby";
      default: return "deporte";
    }
  };

  return (
    <div className="flex flex-col w-full container mx-auto px-4 pt-2 pb-8">
      {/* Events Display */}
      {loading && (
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2">Cargando partidos de {getSportName()}...</p>
        </div>
      )}
      
      {error && (
        <div className="p-8 text-center text-red-600">
          {error}
        </div>
      )}
      
      {!loading && !error && (!eventsData || !eventsData.events || eventsData.events.length === 0) && (
        <div className="p-8 text-center flex flex-col items-center">
          <span className="text-4xl mb-2">{getSportIcon()}</span>
          <p>No hay partidos de {getSportName()} disponibles para la fecha seleccionada</p>
        </div>
      )}

      <div className="flex flex-col w-full gap-4 justify-center items-center">
        {eventsData?.events?.map((event) => (
          <MemoizedEventCard key={event.id} event={event} bettingAmount={bettingAmount} />
        ))}
      </div>
    </div>
  );
}
