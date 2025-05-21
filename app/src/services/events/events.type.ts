export type Event = {
  id: string;
  name: string;
  sport_type: string;
  competition: string;
  start_time: string;
  teams: {
    id: string;
    name: string;
    logo_url: string;
    is_home: boolean;
  }[];
  main_markets: MainMarket[];
  status: string;
};

export type MainMarket = {
  id: string;
  name: string;
  selections: {
    id: string;
    name: string;
    odds: number;
  }[];
};

/**
 * Response type for the events endpoint
 */
export type GetEventsResponse = {
  events: Event[];
  total_count: number;
  page: number;
};
