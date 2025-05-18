import { useState, useEffect, useCallback } from "react";
import { eventsService } from "../services/events";
import { FeaturedEventsParams, FeaturedEventsResponse, SportEvent } from "../types/api";

/**
 * Hook to fetch and manage featured events
 * @param initialParams - Initial query parameters
 */
export const useFeaturedEvents = (initialParams?: FeaturedEventsParams) => {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<FeaturedEventsParams | undefined>(initialParams);

  const fetchEvents = useCallback(async (fetchParams?: FeaturedEventsParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedParams = { ...params, ...fetchParams };
      const response = await eventsService.getFeaturedEvents(mergedParams);
      
      setEvents(response.events);
      setTotalCount(response.total_count);
      setPage(response.page);
      
      // Update params with the ones that were actually used
      setParams(mergedParams);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch events"));
    } finally {
      setLoading(false);
    }
  }, [params]);

  // Fetch events when params change
  useEffect(() => {
    fetchEvents();
  }, [JSON.stringify(initialParams)]);

  const updateFilters = useCallback((newFilters: Partial<FeaturedEventsParams>) => {
    setParams(prev => ({ ...prev, ...newFilters }));
    fetchEvents({ ...params, ...newFilters });
  }, [params, fetchEvents]);

  return {
    events,
    totalCount,
    page,
    loading,
    error,
    params,
    updateFilters,
    refetch: () => fetchEvents(),
  };
}; 