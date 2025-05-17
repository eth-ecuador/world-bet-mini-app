import uuid
import datetime
import random

# Fecha actual (17 de mayo de 2025)
current_date = datetime.datetime.now()
# Domingo 18 de mayo de 2025
sunday = current_date + datetime.timedelta(days=1)
sunday = sunday.replace(hour=16, minute=0, second=0, microsecond=0)

# Simulación de datos de deportes
SPORTS = [
    {
        "id": str(uuid.uuid4()),
        "name": "Football",
        "active_events_count": 120,
        "icon_url": "https://example.com/icons/football.png"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Basketball",
        "active_events_count": 80,
        "icon_url": "https://example.com/icons/basketball.png"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Tennis",
        "active_events_count": 60,
        "icon_url": "https://example.com/icons/tennis.png"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Boxing",
        "active_events_count": 25,
        "icon_url": "https://example.com/icons/boxing.png"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Motorsport",
        "active_events_count": 30,
        "icon_url": "https://example.com/icons/motorsport.png"
    }
]

# ID para referencias
FOOTBALL_ID = SPORTS[0]["id"]
BASKETBALL_ID = SPORTS[1]["id"]
TENNIS_ID = SPORTS[2]["id"]
BOXING_ID = SPORTS[3]["id"]
MOTORSPORT_ID = SPORTS[4]["id"]

# Competiciones simuladas
COMPETITIONS = {
    "football": [
        {
            "id": str(uuid.uuid4()),
            "name": "La Liga",
            "sport_id": FOOTBALL_ID,
            "country": "Spain",
            "active_events_count": 10,
            "icon_url": "https://example.com/icons/laliga.png"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Premier League",
            "sport_id": FOOTBALL_ID,
            "country": "England",
            "active_events_count": 12,
            "icon_url": "https://example.com/icons/premier.png"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Champions League",
            "sport_id": FOOTBALL_ID,
            "country": "International",
            "active_events_count": 8,
            "icon_url": "https://example.com/icons/champions.png"
        }
    ],
    "basketball": [
        {
            "id": str(uuid.uuid4()),
            "name": "NBA",
            "sport_id": BASKETBALL_ID,
            "country": "USA",
            "active_events_count": 15,
            "icon_url": "https://example.com/icons/nba.png"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Euroleague",
            "sport_id": BASKETBALL_ID,
            "country": "Europe",
            "active_events_count": 10,
            "icon_url": "https://example.com/icons/euroleague.png"
        }
    ],
    "tennis": [
        {
            "id": str(uuid.uuid4()),
            "name": "ATP Masters",
            "sport_id": TENNIS_ID,
            "country": "International",
            "active_events_count": 5,
            "icon_url": "https://example.com/icons/atp.png"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "French Open",
            "sport_id": TENNIS_ID,
            "country": "France",
            "active_events_count": 20,
            "icon_url": "https://example.com/icons/frenchopen.png"
        }
    ],
    "boxing": [
        {
            "id": str(uuid.uuid4()),
            "name": "Heavyweight Championship",
            "sport_id": BOXING_ID,
            "country": "International",
            "active_events_count": 3,
            "icon_url": "https://example.com/icons/heavyweight.png"
        }
    ],
    "motorsport": [
        {
            "id": str(uuid.uuid4()),
            "name": "Formula 1",
            "sport_id": MOTORSPORT_ID,
            "country": "International",
            "active_events_count": 8,
            "icon_url": "https://example.com/icons/f1.png"
        }
    ]
}

# Eventos simulados
EVENTS = [
    # Eventos para el domingo 18 de mayo (mañana)
    {
        "id": str(uuid.uuid4()),
        "name": "Barcelona vs Real Madrid",
        "sport_type": "football",
        "competition": "La Liga",
        "start_time": sunday.isoformat(),
        "venue": "Camp Nou, Barcelona",
        "description": "El Clásico - Round 25",
        "markets": [
            {
                "id": str(uuid.uuid4()),
                "name": "Match Winner",
                "selections": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Barcelona",
                        "odds": 2.1
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Draw",
                        "odds": 3.5
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Real Madrid",
                        "odds": 3.2
                    }
                ]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Both Teams to Score",
                "selections": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Yes",
                        "odds": 1.7
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "No",
                        "odds": 2.1
                    }
                ]
            }
        ],
        "status": "upcoming",
        "image_url": "https://example.com/images/barca-real.jpg",
        "stats": {
            "team1_form": ["W", "W", "L", "D", "W"],
            "team2_form": ["W", "W", "W", "D", "L"],
            "head_to_head": {
                "total_matches": 245,
                "team1_wins": 96,
                "team2_wins": 95,
                "draws": 54
            }
        }
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Lakers vs Celtics",
        "sport_type": "basketball",
        "competition": "NBA",
        "start_time": sunday.replace(hour=18, minute=30).isoformat(),
        "venue": "Staples Center, Los Angeles",
        "description": "NBA Finals Game 3",
        "markets": [
            {
                "id": str(uuid.uuid4()),
                "name": "Match Winner",
                "selections": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Lakers",
                        "odds": 1.8
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Celtics",
                        "odds": 2.1
                    }
                ]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Total Points",
                "selections": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Over 215.5",
                        "odds": 1.9
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Under 215.5",
                        "odds": 1.9
                    }
                ]
            }
        ],
        "status": "upcoming",
        "image_url": "https://example.com/images/lakers-celtics.jpg",
        "stats": {
            "team1_form": ["W", "W", "L", "W", "W"],
            "team2_form": ["L", "W", "W", "W", "L"],
            "head_to_head": {
                "total_matches": 32,
                "team1_wins": 15,
                "team2_wins": 17,
                "draws": 0
            }
        }
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Nadal vs Djokovic",
        "sport_type": "tennis",
        "competition": "ATP Masters",
        "start_time": sunday.replace(hour=14, minute=0).isoformat(),
        "venue": "Foro Italico, Rome",
        "description": "Rome Masters Final",
        "markets": [
            {
                "id": str(uuid.uuid4()),
                "name": "Match Winner",
                "selections": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Nadal",
                        "odds": 2.2
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Djokovic",
                        "odds": 1.7
                    }
                ]
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Set Betting",
                "selections": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Nadal 2-0",
                        "odds": 3.5
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Nadal 2-1",
                        "odds": 4.2
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Djokovic 2-0",
                        "odds": 2.7
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Djokovic 2-1",
                        "odds": 3.8
                    }
                ]
            }
        ],
        "status": "upcoming",
        "image_url": "https://example.com/images/nadal-djokovic.jpg",
        "stats": {
            "team1_form": ["W", "W", "W", "W", "L"],
            "team2_form": ["W", "L", "W", "W", "W"],
            "head_to_head": {
                "total_matches": 58,
                "team1_wins": 28,
                "team2_wins": 30,
                "draws": 0
            }
        }
    },
    
    # Eventos para próximos 7 días
    {
        "id": str(uuid.uuid4()),
        "name": "Manchester City vs Liverpool",
        "sport_type": "football",
        "competition": "Premier League",
        "start_time": (current_date + datetime.timedelta(days=3)).replace(hour=15, minute=0).isoformat(),
        "venue": "Etihad Stadium, Manchester",
        "description": "Premier League Round 30",
        "markets": [
            {
                "id": str(uuid.uuid4()),
                "name": "Match Winner",
                "selections": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Manchester City",
                        "odds": 1.9
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Draw",
                        "odds": 3.8
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Liverpool",
                        "odds": 4.2
                    }
                ]
            }
        ],
        "status": "upcoming",
        "image_url": "https://example.com/images/city-liverpool.jpg",
        "stats": {
            "team1_form": ["W", "W", "W", "D", "W"],
            "team2_form": ["W", "L", "W", "D", "W"],
            "head_to_head": {
                "total_matches": 189,
                "team1_wins": 88,
                "team2_wins": 69,
                "draws": 32
            }
        }
    },
    {
        "id": str(uuid.uuid4()),
        "name": "PSG vs Bayern Munich",
        "sport_type": "football",
        "competition": "Champions League",
        "start_time": (current_date + datetime.timedelta(days=4)).replace(hour=20, minute=0).isoformat(),
        "venue": "Parc des Princes, Paris",
        "description": "Champions League Semi-Final",
        "markets": [
            {
                "id": str(uuid.uuid4()),
                "name": "Match Winner",
                "selections": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "PSG",
                        "odds": 2.6
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Draw",
                        "odds": 3.4
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Bayern Munich",
                        "odds": 2.8
                    }
                ]
            }
        ],
        "status": "upcoming",
        "image_url": "https://example.com/images/psg-bayern.jpg",
        "stats": {
            "team1_form": ["W", "W", "W", "W", "D"],
            "team2_form": ["W", "W", "W", "L", "W"],
            "head_to_head": {
                "total_matches": 12,
                "team1_wins": 5,
                "team2_wins": 7,
                "draws": 0
            }
        }
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Warriors vs Suns",
        "sport_type": "basketball",
        "competition": "NBA",
        "start_time": (current_date + datetime.timedelta(days=5)).replace(hour=19, minute=0).isoformat(),
        "venue": "Chase Center, San Francisco",
        "description": "Western Conference Playoffs",
        "markets": [
            {
                "id": str(uuid.uuid4()),
                "name": "Match Winner",
                "selections": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Warriors",
                        "odds": 1.6
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Suns",
                        "odds": 2.4
                    }
                ]
            }
        ],
        "status": "upcoming",
        "image_url": "https://example.com/images/warriors-suns.jpg",
        "stats": {
            "team1_form": ["W", "W", "W", "L", "W"],
            "team2_form": ["L", "W", "W", "W", "W"],
            "head_to_head": {
                "total_matches": 28,
                "team1_wins": 18,
                "team2_wins": 10,
                "draws": 0
            }
        }
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Medvedev vs Alcaraz",
        "sport_type": "tennis",
        "competition": "ATP Masters",
        "start_time": (current_date + datetime.timedelta(days=6)).replace(hour=13, minute=30).isoformat(),
        "venue": "Roland Garros, Paris",
        "description": "French Open Quarter-Final",
        "markets": [
            {
                "id": str(uuid.uuid4()),
                "name": "Match Winner",
                "selections": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Medvedev",
                        "odds": 3.1
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Alcaraz",
                        "odds": 1.4
                    }
                ]
            }
        ],
        "status": "upcoming",
        "image_url": "https://example.com/images/medvedev-alcaraz.jpg",
        "stats": {
            "team1_form": ["W", "L", "W", "W", "L"],
            "team2_form": ["W", "W", "W", "W", "W"],
            "head_to_head": {
                "total_matches": 7,
                "team1_wins": 2,
                "team2_wins": 5,
                "draws": 0
            }
        }
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Arsenal vs Tottenham",
        "sport_type": "football",
        "competition": "Premier League",
        "start_time": (current_date + datetime.timedelta(days=7)).replace(hour=16, minute=30).isoformat(),
        "venue": "Emirates Stadium, London",
        "description": "North London Derby",
        "markets": [
            {
                "id": str(uuid.uuid4()),
                "name": "Match Winner",
                "selections": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Arsenal",
                        "odds": 2.0
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Draw",
                        "odds": 3.4
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Tottenham",
                        "odds": 3.8
                    }
                ]
            }
        ],
        "status": "upcoming",
        "image_url": "https://example.com/images/arsenal-tottenham.jpg",
        "stats": {
            "team1_form": ["W", "D", "W", "W", "L"],
            "team2_form": ["L", "W", "D", "W", "W"],
            "head_to_head": {
                "total_matches": 192,
                "team1_wins": 80,
                "team2_wins": 60,
                "draws": 52
            }
        }
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Tyson vs Joshua",
        "sport_type": "boxing",
        "competition": "Heavyweight Championship",
        "start_time": (current_date + datetime.timedelta(days=6)).replace(hour=22, minute=0).isoformat(),
        "venue": "Wembley Stadium, London",
        "description": "WBC & WBA Heavyweight Title Fight",
        "markets": [
            {
                "id": str(uuid.uuid4()),
                "name": "Fight Outcome",
                "selections": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Tyson Win",
                        "odds": 1.9
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Joshua Win",
                        "odds": 2.1
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Draw",
                        "odds": 15.0
                    }
                ]
            }
        ],
        "status": "upcoming",
        "image_url": "https://example.com/images/tyson-joshua.jpg",
        "stats": {
            "team1_form": ["W", "W", "W", "W", "W"],
            "team2_form": ["W", "L", "W", "W", "W"],
            "head_to_head": {
                "total_matches": 0,
                "team1_wins": 0,
                "team2_wins": 0,
                "draws": 0
            }
        }
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Ferrari vs Red Bull Racing",
        "sport_type": "motorsport",
        "competition": "Formula 1",
        "start_time": sunday.replace(hour=13, minute=0).isoformat(),
        "venue": "Circuit de Monaco, Monte Carlo",
        "description": "Monaco Grand Prix",
        "markets": [
            {
                "id": str(uuid.uuid4()),
                "name": "Race Winner",
                "selections": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Leclerc (Ferrari)",
                        "odds": 2.5
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Verstappen (Red Bull)",
                        "odds": 1.8
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Hamilton (Mercedes)",
                        "odds": 4.2
                    }
                ]
            }
        ],
        "status": "upcoming",
        "image_url": "https://example.com/images/monaco-gp.jpg",
        "stats": {
            "team1_form": ["1", "3", "2", "1", "2"],
            "team2_form": ["2", "1", "1", "2", "1"],
            "head_to_head": {
                "total_matches": 23,
                "team1_wins": 9,
                "team2_wins": 14,
                "draws": 0
            }
        }
    }
]

# Apuestas simuladas
BETS = {}

def get_sports():
    """Devuelve la lista de deportes disponibles."""
    return SPORTS

def get_competitions(sport_id=None):
    """Devuelve las competiciones disponibles, opcionalmente filtradas por deporte."""
    if sport_id:
        return [comp for sport_comps in COMPETITIONS.values() for comp in sport_comps if comp["sport_id"] == sport_id]
    return [comp for sport_comps in COMPETITIONS.values() for comp in sport_comps]

def get_featured_events(sport_type=None, date_from=None, date_to=None, limit=10):
    """Devuelve los eventos destacados con posibilidad de filtrado."""
    filtered_events = EVENTS
    
    if sport_type:
        filtered_events = [event for event in filtered_events if event["sport_type"] == sport_type]
    
    if date_from:
        date_from_dt = datetime.datetime.fromisoformat(date_from)
        filtered_events = [event for event in filtered_events if datetime.datetime.fromisoformat(event["start_time"]) >= date_from_dt]
    
    if date_to:
        date_to_dt = datetime.datetime.fromisoformat(date_to)
        filtered_events = [event for event in filtered_events if datetime.datetime.fromisoformat(event["start_time"]) <= date_to_dt]
    
    # Limitar y formatear para respuesta
    limited_events = filtered_events[:limit]
    
    return {
        "events": [
            {
                "id": event["id"],
                "name": event["name"],
                "sport_type": event["sport_type"],
                "competition": event["competition"],
                "start_time": event["start_time"],
                "main_markets": [event["markets"][0]] if event["markets"] else [],
                "status": event["status"],
                "image_url": event["image_url"]
            } for event in limited_events
        ],
        "total_count": len(filtered_events),
        "page": 1
    }

def get_event_by_id(event_id):
    """Devuelve la información detallada de un evento específico por ID."""
    for event in EVENTS:
        if event["id"] == event_id:
            return event
    return None

def create_bet(user_id, selection_id, stake_amount, currency, use_ai_recommendation):
    """Crea una apuesta simulada."""
    # Encontrar la selección y el evento
    selection = None
    event = None
    event_name = ""
    selection_name = ""
    odds = 0
    
    for evt in EVENTS:
        for market in evt["markets"]:
            for sel in market["selections"]:
                if sel["id"] == selection_id:
                    selection = sel
                    event = evt
                    event_name = evt["name"]
                    selection_name = sel["name"]
                    odds = sel["odds"]
                    break
            if selection:
                break
        if selection:
            break
    
    if not selection:
        return None
    
    bet_id = str(uuid.uuid4())
    potential_return = stake_amount * odds
    
    commission = {
        "standard": round(stake_amount * 0.03, 2),
        "ai_premium": round(stake_amount * 0.01, 2) if use_ai_recommendation else 0,
        "profit_percentage": 5
    }
    
    bet = {
        "bet_id": bet_id,
        "status": "placed",
        "selection_id": selection_id,
        "event_name": event_name,
        "selection_name": selection_name,
        "odds": odds,
        "stake_amount": stake_amount,
        "currency": currency,
        "potential_return": potential_return,
        "commission": commission,
        "created_at": datetime.datetime.now().isoformat(),
        "estimated_result_time": event["start_time"] if event else (datetime.datetime.now() + datetime.timedelta(days=1)).isoformat(),
        "user_id": user_id,
        "result": None,
        "used_ai_recommendation": use_ai_recommendation
    }
    
    if user_id not in BETS:
        BETS[user_id] = []
    
    BETS[user_id].append(bet)
    return bet

def get_user_bets(user_id, status="all", limit=10, page=1):
    """Obtiene las apuestas de un usuario, opcionalmente filtradas por estado."""
    if user_id not in BETS:
        return {"bets": [], "total_count": 0, "page": page}
    
    user_bets = BETS[user_id]
    
    if status != "all":
        user_bets = [bet for bet in user_bets if bet["status"] == status]
    
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    
    return {
        "bets": [
            {
                "bet_id": bet["bet_id"],
                "event_name": bet["event_name"],
                "selection_name": bet["selection_name"],
                "odds": bet["odds"],
                "stake_amount": bet["stake_amount"],
                "currency": bet["currency"],
                "potential_return": bet["potential_return"],
                "status": bet["status"],
                "placed_at": bet["created_at"],
                "result": bet["result"],
                "used_ai_recommendation": bet["used_ai_recommendation"]
            } for bet in user_bets[start_idx:end_idx]
        ],
        "total_count": len(user_bets),
        "page": page
    }