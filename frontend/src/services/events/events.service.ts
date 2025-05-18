import { GetEventsResponse } from "./events.type";
import apiClient from "../api-client";
import { AxiosError } from "axios";

// Debug flag - set to true to enable detailed logging
const DEBUG = true;

// Number of retry attempts for failed requests
const MAX_RETRIES = 2;

// Custom timeout for events requests (in milliseconds)
const EVENTS_TIMEOUT = 15000; // 15 seconds

/**
 * Interface for events filter parameters
 */
export interface EventsFilterParams {
  date_from?: string;       // Minimum date in YYYY-MM-DD format
  date_to?: string;         // Maximum date in YYYY-MM-DD format
  limit?: number;           // Maximum number of results (default: 10)
  page?: number;            // Page number for pagination (default: 1)
}

/**
 * Log debug messages if debug mode is enabled
 */
const debugLog = (message: string, data?: Record<string, unknown> | null) => {
  if (DEBUG) {
    console.log(`[Events Service] ${message}`, data || '');
  }
};

/**
 * Build query string from filter parameters
 * Always includes sport_type=football
 */
const buildQueryString = (params?: EventsFilterParams): string => {
  // Start with a new URLSearchParams object
  const queryParams = new URLSearchParams();
  
  // Always include football as the sport type
  queryParams.append('sport_type', 'football');
  
  // Add other filters if provided
  if (params) {
    if (params.date_from) queryParams.append('date_from', params.date_from);
    if (params.date_to) queryParams.append('date_to', params.date_to);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());
  }
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Get featured football events with improved error handling and retry logic
 * @param filters Optional date and pagination filters
 */
export const getEvents = async (filters?: EventsFilterParams): Promise<GetEventsResponse> => {
  let retries = 0;
  
  // Build the query string from filters (always includes football)
  const queryString = buildQueryString(filters);
  const url = `/events/featured${queryString}`;
  
  debugLog('Filter params', {
    ...filters, 
    sport_type: 'football' // Always football
  } as Record<string, unknown>);
  debugLog(`Request URL: ${url}`);
  
  while (retries <= MAX_RETRIES) {
    try {
      debugLog(`Fetching football events (attempt ${retries + 1}/${MAX_RETRIES + 1})...`);
      
      // Use a longer timeout for this specific request
      const { data } = await apiClient.get(url, {
        timeout: EVENTS_TIMEOUT
      });
      
      debugLog("Football events fetched successfully", { count: data?.events?.length });
      return data;
    } catch (error) {
      const axiosError = error as AxiosError;
      
      // Log the error details
      debugLog(`Error fetching events (attempt ${retries + 1})`, {
        code: axiosError.code,
        message: axiosError.message,
        status: axiosError.response?.status,
        url: axiosError.config?.url,
        timeout: axiosError.config?.timeout
      });
      
      // If we've reached max retries, throw the error
      if (retries >= MAX_RETRIES) {
        // For timeout errors, provide a more helpful message
        if (axiosError.code === 'ECONNABORTED') {
          throw new Error(`API request timed out after ${EVENTS_TIMEOUT}ms. The server might be overloaded or unreachable.`);
        }
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, retries) * 1000; // 1s, 2s, 4s, etc.
      debugLog(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      retries++;
    }
  }
  
  // This should never be reached due to the error handling above,
  // but TypeScript requires a return statement
  throw new Error("Failed to fetch events after multiple retries");
};

/**
 * Get a specific event by ID
 */
export const getEventById = async (eventId: string): Promise<GetEventsResponse> => {
  try {
    debugLog(`Fetching event with ID: ${eventId}`);
    const { data } = await apiClient.get(`/events/${eventId}`, {
      timeout: EVENTS_TIMEOUT
    });
    return data;
  } catch (error) {
    const axiosError = error as AxiosError;
    debugLog(`Error fetching event ${eventId}`, {
      code: axiosError.code,
      message: axiosError.message,
      status: axiosError.response?.status
    });
    throw error;
  }
};
