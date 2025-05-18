// Mock data for API responses
export const API_MOCKS = {
  EVENTS: {
    FEATURED: {
      events: [
        {
          id: "evt-001",
          name: "Barcelona vs Real Madrid",
          sport_type: "football",
          competition: "La Liga",
          start_time: new Date().toISOString(),
          main_markets: [
            {
              id: "mkt-001",
              name: "Match Winner",
              selections: [
                { id: "sel-001", name: "Barcelona", odds: 2.1 },
                { id: "sel-002", name: "Draw", odds: 3.5 },
                { id: "sel-003", name: "Real Madrid", odds: 3.2 },
              ]
            }
          ],
          status: "upcoming",
          image_url: "https://example.com/images/elclasico.jpg"
        },
        {
          id: "evt-002",
          name: "Manchester City vs Liverpool",
          sport_type: "football",
          competition: "Premier League",
          start_time: new Date(Date.now() + 86400000).toISOString(), // tomorrow
          main_markets: [
            {
              id: "mkt-002",
              name: "Match Winner",
              selections: [
                { id: "sel-004", name: "Manchester City", odds: 1.9 },
                { id: "sel-005", name: "Draw", odds: 3.7 },
                { id: "sel-006", name: "Liverpool", odds: 3.8 },
              ]
            }
          ],
          status: "upcoming",
          image_url: "https://example.com/images/mancity-liverpool.jpg"
        },
        {
          id: "evt-003",
          name: "Nadal vs Djokovic",
          sport_type: "tennis",
          competition: "Roland Garros",
          start_time: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
          main_markets: [
            {
              id: "mkt-003",
              name: "Match Winner",
              selections: [
                { id: "sel-007", name: "Rafael Nadal", odds: 2.2 },
                { id: "sel-008", name: "Novak Djokovic", odds: 1.7 },
              ]
            }
          ],
          status: "upcoming",
          image_url: "https://example.com/images/nadal-djokovic.jpg"
        }
      ],
      total_count: 42,
      page: 1
    },
    DETAIL: {
      id: "evt-001",
      name: "Barcelona vs Real Madrid",
      sport_type: "football",
      competition: "La Liga",
      start_time: new Date().toISOString(),
      venue: "Camp Nou, Barcelona",
      description: "El Clásico - Round 25",
      markets: [
        {
          id: "mkt-001",
          name: "Match Winner",
          selections: [
            { id: "sel-001", name: "Barcelona", odds: 2.1 },
            { id: "sel-002", name: "Draw", odds: 3.5 },
            { id: "sel-003", name: "Real Madrid", odds: 3.2 },
          ]
        },
        {
          id: "mkt-004",
          name: "Both Teams to Score",
          selections: [
            { id: "sel-009", name: "Yes", odds: 1.7 },
            { id: "sel-010", name: "No", odds: 2.1 },
          ]
        },
        {
          id: "mkt-005",
          name: "Over/Under 2.5 Goals",
          selections: [
            { id: "sel-011", name: "Over 2.5", odds: 1.8 },
            { id: "sel-012", name: "Under 2.5", odds: 2.0 },
          ]
        }
      ],
      status: "upcoming",
      image_url: "https://example.com/images/elclasico.jpg",
      stats: {
        team1_form: ["W", "W", "L", "D", "W"],
        team2_form: ["W", "W", "W", "D", "L"],
        head_to_head: {
          total_matches: 245,
          team1_wins: 96,
          team2_wins: 95,
          draws: 54
        }
      }
    }
  },
  SPORTS: {
    LIST: {
      sports: [
        {
          id: "spt-001",
          name: "Football",
          active_events_count: 120,
          icon_url: "https://example.com/icons/football.svg"
        },
        {
          id: "spt-002",
          name: "Tennis",
          active_events_count: 80,
          icon_url: "https://example.com/icons/tennis.svg"
        },
        {
          id: "spt-003",
          name: "Basketball",
          active_events_count: 65,
          icon_url: "https://example.com/icons/basketball.svg"
        },
        {
          id: "spt-004",
          name: "Formula 1",
          active_events_count: 12,
          icon_url: "https://example.com/icons/formula1.svg"
        },
        {
          id: "spt-005",
          name: "Boxing",
          active_events_count: 8,
          icon_url: "https://example.com/icons/boxing.svg"
        }
      ]
    }
  },
  COMPETITIONS: {
    LIST: {
      competitions: [
        {
          id: "comp-001",
          name: "La Liga",
          sport_id: "spt-001",
          country: "Spain",
          active_events_count: 10,
          icon_url: "https://example.com/icons/laliga.svg"
        },
        {
          id: "comp-002",
          name: "Premier League",
          sport_id: "spt-001",
          country: "England",
          active_events_count: 12,
          icon_url: "https://example.com/icons/premier.svg"
        },
        {
          id: "comp-003",
          name: "Roland Garros",
          sport_id: "spt-002",
          country: "France",
          active_events_count: 32,
          icon_url: "https://example.com/icons/rolandgarros.svg"
        },
        {
          id: "comp-004",
          name: "NBA",
          sport_id: "spt-003",
          country: "USA",
          active_events_count: 24,
          icon_url: "https://example.com/icons/nba.svg"
        }
      ]
    }
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
        profit_percentage: 5
      },
      created_at: new Date().toISOString(),
      estimated_result_time: new Date(Date.now() + 7200000).toISOString() // 2 hours later
    },
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
          used_ai_recommendation: true
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
          used_ai_recommendation: false
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
          used_ai_recommendation: true
        }
      ],
      total_count: 5,
      page: 1
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
        total: 2.0
      }
    }
  }
}; 