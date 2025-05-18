import { apiClient } from './api';
import { FeaturedEventsParams, FeaturedEventsResponse } from '../types/api';

/**
 * Events API service
 * Implements the /events/featured endpoint
 */
export const eventsService = {
  /**
   * Get featured events with optional filters
   * 
   * Endpoint: GET /events/featured
   * 
   * @param params - Optional query parameters:
   * - sport_type: Filter by sport type (football, tennis, basketball, etc.)
   * - date_from: Filter by start date (YYYY-MM-DD)
   * - date_to: Filter by end date (YYYY-MM-DD)
   * - limit: Number of results to return (default: 10)
   * 
   * @returns Promise with featured events data
   */
  getFeaturedEvents: async (params?: FeaturedEventsParams): Promise<FeaturedEventsResponse> => {
    return apiClient.get<FeaturedEventsResponse>("EVENTS", "FEATURED", params);
  },
  
  /**
   * Get event details by ID
   * @param id - Event ID
   * @returns Event details
   */
  getEventDetails: async (id: string) => {
    return apiClient.get("EVENTS", "DETAIL", {}, {}, { id });
  }
}; 