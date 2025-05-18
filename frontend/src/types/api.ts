export interface SportEvent {
  id: string;
  name: string;
  sport_type: string;
  competition: string;
  start_time: string; // ISO8601 timestamp
  main_markets: Market[];
  status: 'upcoming' | 'live' | 'finished' | string;
  image_url: string;
}

export interface Market {
  id: string;
  name: string;
  selections: Selection[];
}

export interface Selection {
  id: string;
  name: string;
  odds: number;
}

export interface FeaturedEventsResponse {
  events: SportEvent[];
  total_count: number;
  page: number;
}

export interface FeaturedEventsParams {
  sport_type?: string;
  date_from?: string; // YYYY-MM-DD
  date_to?: string; // YYYY-MM-DD
  limit?: number;
} 