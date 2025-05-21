import { CreateBetResponse } from "@/services/bets/bets.type";
import { GetEventsResponse } from "@/services/events/events.type";
// Mock data for API responses
export const API_MOCKS = {
  EVENTS: {
    FEATURED: {
      events: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "Barcelona vs Real Madrid",
          sport_type: "football",
          competition: "La Liga",
          start_time: "2025-05-18T16:00:00",
          teams: [
            {
              id: "fc-barcelona-001",
              name: "Barcelona",
              logo_url: "/b.png",
              is_home: true,
            },
            {
              id: "real-madrid-001",
              name: "Real Madrid",
              logo_url: "/b.png",
              is_home: false,
            },
          ],
          main_markets: [
            {
              id: "38fe3c80-1651-4d44-8e01-761a44833701",
              name: "Match Winner",
              selections: [
                {
                  id: "9a4d5622-7044-4a9a-b853-4efecfc7a8d9",
                  name: "Barcelona",
                  odds: 2.1,
                },
                {
                  id: "23cd8b9a-eb69-414c-8171-9cacbad4db84",
                  name: "Draw",
                  odds: 3.5,
                },
                {
                  id: "af1a2466-7bed-442c-a5f1-9cda1879fd23",
                  name: "Real Madrid",
                  odds: 3.2,
                },
              ],
            },
          ],
          status: "upcoming",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "Barcelona vs Real Madrid",
          sport_type: "football",
          competition: "La Liga",
          start_time: "2025-05-18T16:00:00",
          teams: [
            {
              id: "fc-barcelona-001",
              name: "Barcelona",
              logo_url: "/b.png",
              is_home: true,
            },
            {
              id: "real-madrid-001",
              name: "Real Madrid",
              logo_url: "/b.png",
              is_home: false,
            },
          ],
          main_markets: [
            {
              id: "38fe3c80-1651-4d44-8e01-761a44833701",
              name: "Match Winner",
              selections: [
                {
                  id: "9a4d5622-7044-4a9a-b853-4efecfc7a8d9",
                  name: "Barcelona",
                  odds: 2.1,
                },
                {
                  id: "23cd8b9a-eb69-414c-8171-9cacbad4db84",
                  name: "Draw",
                  odds: 3.5,
                },
                {
                  id: "af1a2466-7bed-442c-a5f1-9cda1879fd23",
                  name: "Real Madrid",
                  odds: 3.2,
                },
              ],
            },
          ],
          status: "upcoming",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "Barcelona vs Real Madrid",
          sport_type: "football",
          competition: "La Liga",
          start_time: "2025-05-18T16:00:00",
          teams: [
            {
              id: "fc-barcelona-001",
              name: "Barcelona",
              logo_url: "/b.png",
              is_home: true,
            },
            {
              id: "real-madrid-001",
              name: "Real Madrid",
              logo_url: "/b.png",
              is_home: false,
            },
          ],
          main_markets: [
            {
              id: "38fe3c80-1651-4d44-8e01-761a44833701",
              name: "Match Winner",
              selections: [
                {
                  id: "9a4d5622-7044-4a9a-b853-4efecfc7a8d9",
                  name: "Barcelona",
                  odds: 2.1,
                },
                {
                  id: "23cd8b9a-eb69-414c-8171-9cacbad4db84",
                  name: "Draw",
                  odds: 3.5,
                },
                {
                  id: "af1a2466-7bed-442c-a5f1-9cda1879fd23",
                  name: "Real Madrid",
                  odds: 3.2,
                },
              ],
            },
          ],
          status: "upcoming",
        },
      ],
      total_count: 10,
      page: 1,
    } satisfies GetEventsResponse,
  },
  BETS: {
    CREATE: {
      bet_id: "bet-001",
      status: "placed",
      selection_id: "sel-001",
      event_name: "Barcelona vs Real Madrid",
      selection_name: "Barcelona",
      odds: 2.1,
      stake_amount: 50,
      currency: "WLD",
      potential_return: 105,
      commission: {
        standard: 1.5,
        ai_premium: 0.5,
        profit_percentage: 5,
      },
      created_at: new Date().toISOString(),
      estimated_result_time: new Date(Date.now() + 7200000).toISOString(), // 2 hours later
    } satisfies CreateBetResponse,
    LIST: {
      bets: [
        {
          bet_id: "bet-001",
          event_name: "Barcelona vs Real Madrid",
          selection_name: "Barcelona",
          odds: 2.1,
          stake_amount: 50,
          currency: "WLD",
          potential_return: 105,
          status: "active",
          placed_at: new Date(Date.now() - 86400000).toISOString(), // yesterday
          result: null,
          used_ai_recommendation: true,
        },
        {
          bet_id: "bet-002",
          event_name: "Manchester United vs Chelsea",
          selection_name: "Draw",
          odds: 3.2,
          stake_amount: 25,
          currency: "WLD",
          potential_return: 80,
          status: "settled",
          placed_at: new Date(Date.now() - 172800000).toISOString(), // two days ago
          result: "lost",
          used_ai_recommendation: false,
        },
        {
          bet_id: "bet-003",
          event_name: "PSG vs Bayern Munich",
          selection_name: "PSG",
          odds: 2.4,
          stake_amount: 100,
          currency: "WLD",
          potential_return: 240,
          status: "settled",
          placed_at: new Date(Date.now() - 259200000).toISOString(), // three days ago
          result: "won",
          used_ai_recommendation: true,
        },
      ],
      total_count: 5,
      page: 1,
    },
    DETAIL: {
      bet_id: "bet-001",
      event_id: "evt-001",
      event_name: "Barcelona vs Real Madrid",
      event_start_time: new Date(Date.now() + 7200000).toISOString(),
      selection_id: "sel-001",
      selection_name: "Barcelona",
      market_name: "Match Winner",
      odds: 2.1,
      stake_amount: 50,
      currency: "WLD",
      potential_return: 105,
      status: "active",
      placed_at: new Date(Date.now() - 86400000).toISOString(),
      result: null,
      settlement_time: null,
      used_ai_recommendation: true,
      commission: {
        standard: 1.5,
        ai_premium: 0.5,
        total: 2.0,
      },
    },
  },
};
