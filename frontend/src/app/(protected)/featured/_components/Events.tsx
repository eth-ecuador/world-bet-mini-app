import { getEvents } from "@/services/events/events.service";
import { GetEventsResponse } from "@/services/events/events.type";
import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Events() {
  const [eventsData, setEventsData] = useState<GetEventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();

        if (!data || !data.events) {
          setError("No event data available");
          return;
        }

        setEventsData(data);
        console.log("Events loaded:", data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading events...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!eventsData || !eventsData.events || eventsData.events.length === 0) {
    return <div className="p-8 text-center">No hay eventos disponibles</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] p-4">
      <ScrollArea className="h-full w-full rounded-md">
        <div className="space-y-6 max-w-4xl mx-auto px-4 pb-8">
          {eventsData.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
