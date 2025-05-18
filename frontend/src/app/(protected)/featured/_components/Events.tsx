import { getEvents, EventsFilterParams } from "@/services/events/events.service";
import { GetEventsResponse } from "@/services/events/events.type";
import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { parseISO, startOfDay, endOfDay } from "date-fns";

interface EventsProps {
  selectedDate?: Date;
}

export default function Events({ selectedDate }: EventsProps) {
  const [eventsData, setEventsData] = useState<GetEventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventsFilterParams>({
    limit: 10,
    page: 1
  });

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
      const currentFilters = { ...filters };
      if (selectedDate) {
        // For date_from use start of day (00:00:00)
        const fromDate = formatDateForAPI(selectedDate, true);
        // For date_to use end of day (23:59:59)
        const toDate = formatDateForAPI(selectedDate, false);
        
        console.log("Using date range for API:", fromDate, "to", toDate);
        
        currentFilters.date_from = fromDate;
        currentFilters.date_to = toDate;
      }
      
      const data = await getEvents(currentFilters);

      if (!data || !data.events) {
        setError("No event data available");
        return;
      }

      setEventsData(data);
      console.log("Football events loaded:", data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  // Fetch events when component mounts, filters change, or selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      console.log("Selected date changed:", selectedDate);
    }
    fetchEvents();
  }, [filters, selectedDate]);

  return (
    <div className="flex flex-col w-full">
      {/* Events Display */}
      {loading && (
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2">Cargando partidos de fútbol...</p>
        </div>
      )}
      
      {error && (
        <div className="p-8 text-center text-red-600">
          {error}
        </div>
      )}
      
      {!loading && !error && (!eventsData || !eventsData.events || eventsData.events.length === 0) && (
        <div className="p-8 text-center">
          No hay partidos de fútbol disponibles para la fecha seleccionada
        </div>
      )}

      <div className="flex flex-col w-full gap-4 justify-center items-center">
        {eventsData?.events?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      
      {/* Load More Button */}
      {!loading && eventsData && eventsData.events && eventsData.events.length > 0 && (
        <div className="flex justify-center mt-4 mb-8">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-green-100 text-green-800 rounded-full font-medium hover:bg-green-200"
          >
            Cargar más partidos
          </button>
        </div>
      )}
    </div>
  );
}
