# Archivo: backend/models/database.py

import sqlite3
import os
import datetime
import uuid
import json
from pathlib import Path

# Obtener la ruta absoluta del directorio actual (donde se encuentra este archivo)
CURRENT_DIR = Path(__file__).resolve().parent
# Subir un nivel para llegar al directorio backend
BASE_DIR = CURRENT_DIR.parent
# Crear el directorio database dentro de backend
DB_DIR = BASE_DIR / "database"
DB_DIR.mkdir(exist_ok=True)

DB_PATH = DB_DIR / "worldbet.db"

def get_db_connection():
    """Crea una conexión a la base de datos SQLite."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Para obtener resultados como diccionarios
    return conn

def init_db():
    """Inicializa la base de datos con el esquema y datos iniciales."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Crear tablas
    cursor.executescript('''
    -- Tabla de deportes
    CREATE TABLE IF NOT EXISTS sports (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        active_events_count INTEGER DEFAULT 0,
        icon_url TEXT
    );
    
    -- Tabla de competiciones
    CREATE TABLE IF NOT EXISTS competitions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sport_id TEXT NOT NULL,
        country TEXT,
        active_events_count INTEGER DEFAULT 0,
        icon_url TEXT,
        FOREIGN KEY (sport_id) REFERENCES sports (id)
    );
    
    -- Tabla de eventos
    CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sport_type TEXT NOT NULL,
        competition TEXT NOT NULL,
        start_time TEXT NOT NULL,
        venue TEXT,
        description TEXT,
        markets TEXT,  -- JSON
        status TEXT DEFAULT 'upcoming',
        image_url TEXT,
        stats TEXT  -- JSON
    );
    
    -- Tabla de usuarios
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );
    
    -- Tabla de apuestas
    CREATE TABLE IF NOT EXISTS bets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        selection_id TEXT NOT NULL,
        event_name TEXT NOT NULL,
        selection_name TEXT NOT NULL,
        odds REAL NOT NULL,
        stake_amount REAL NOT NULL,
        currency TEXT NOT NULL,
        potential_return REAL NOT NULL,
        commission TEXT,  -- JSON
        created_at TEXT NOT NULL,
        estimated_result_time TEXT,
        status TEXT DEFAULT 'placed',
        result TEXT,
        used_ai_recommendation INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );
    ''')
    
    # Insertar usuario de demostración
    cursor.execute('''
    INSERT OR IGNORE INTO users (id, username, password)
    VALUES (?, ?, ?)
    ''', ('user1', 'demouser', 'password123'))
    
    conn.commit()
    conn.close()

def populate_sample_data():
    """Inserta datos de ejemplo en la base de datos."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Fecha actual (17 de mayo de 2025)
    current_date = datetime.datetime.now()
    # Domingo 18 de mayo de 2025
    sunday = current_date + datetime.timedelta(days=1)
    sunday = sunday.replace(hour=16, minute=0, second=0, microsecond=0)
    
    # Insertar deportes
    sports = [
        (str(uuid.uuid4()), "Football", 120, "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Football_in_Bloomington%2C_Indiana%2C_1995.jpg/500px-Football_in_Bloomington%2C_Indiana%2C_1995.jpg"),
        (str(uuid.uuid4()), "Basketball", 80, "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Kent_Benson_attempts_a_hook_shot_over_Ken_Ferdinand.jpg/500px-Kent_Benson_attempts_a_hook_shot_over_Ken_Ferdinand.jpg"),
        (str(uuid.uuid4()), "Tennis", 60, "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/2013_Australian_Open_-_Guillaume_Rufin.jpg/500px-2013_Australian_Open_-_Guillaume_Rufin.jpg"),
        (str(uuid.uuid4()), "Boxing", 25, "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Floyd_Mayweather%2C_Jr._vs._Juan_Manuel_Márquez.jpg/500px-Floyd_Mayweather%2C_Jr._vs._Juan_Manuel_Márquez.jpg"),
        (str(uuid.uuid4()), "Motorsport", 30, "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Logo_de_Motorsport.com_sitio.png/500px-Logo_de_Motorsport.com_sitio.png")
    ]
    
    cursor.executemany('''
    INSERT OR IGNORE INTO sports (id, name, active_events_count, icon_url)
    VALUES (?, ?, ?, ?)
    ''', sports)
    
    # Obtener IDs de deportes
    cursor.execute('SELECT id, name FROM sports')
    sport_ids = {row['name']: row['id'] for row in cursor.fetchall()}
    
    # Insertar competiciones
    competitions = [
        (str(uuid.uuid4()), "La Liga", sport_ids["Football"], "Spain", 10, "https://w7.pngwing.com/pngs/740/650/png-transparent-spain-2011-12-la-liga-2017-18-la-liga-2014-15-la-liga-atletico-madrid-premier-league-sport-sports-liga-thumbnail.png"),
        (str(uuid.uuid4()), "Premier League", sport_ids["Football"], "England", 12, "https://static.vecteezy.com/system/resources/thumbnails/010/994/451/small/premier-league-logo-symbol-with-name-design-england-football-european-countries-football-teams-illustration-with-purple-background-free-vector.jpg"),
        (str(uuid.uuid4()), "Champions League", sport_ids["Football"], "International", 8, "https://st2.depositphotos.com/2124563/8893/i/450/depositphotos_88939068-stock-photo-flag-of-uefa-champions-league.jpg"),
        (str(uuid.uuid4()), "NBA", sport_ids["Basketball"], "USA", 15, "https://static.vecteezy.com/system/resources/thumbnails/015/863/585/small_2x/nba-logo-on-transparent-background-free-vector.jpg"),
        (str(uuid.uuid4()), "Euroleague", sport_ids["Basketball"], "Europe", 10, "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/UEFA_Europa_League_logo_%282024_version%29.svg/1436px-UEFA_Europa_League_logo_%282024_version%29.svg.png"),
        (str(uuid.uuid4()), "ATP Masters", sport_ids["Tennis"], "International", 5, "https://upload.wikimedia.org/wikipedia/en/thumb/3/3f/ATP_Tour_logo.svg/375px-ATP_Tour_logo.svg.png"),
        (str(uuid.uuid4()), "French Open", sport_ids["Tennis"], "France", 20, "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Logo_Roland-Garros.svg/1200px-Logo_Roland-Garros.svg.png"),
        (str(uuid.uuid4()), "Heavyweight Championship", sport_ids["Boxing"], "International", 3, "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/1909/live/b1ff39e0-392d-11ef-bdc5-41d7421c2adf.png"),
        (str(uuid.uuid4()), "Formula 1", sport_ids["Motorsport"], "International", 8, "https://logodownload.org/wp-content/uploads/2016/11/formula-1-logo-0.png")
    ]
    
    cursor.executemany('''
    INSERT OR IGNORE INTO competitions (id, name, sport_id, country, active_events_count, icon_url)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', competitions)
    
    # Eventos para el domingo
    events = []
    
    # 1. Barcelona vs Real Madrid
    barcelona_real_markets = json.dumps([
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
    ])
    
    barcelona_real_stats = json.dumps({
        "team1_form": ["W", "W", "L", "D", "W"],
        "team2_form": ["W", "W", "W", "D", "L"],
        "head_to_head": {
            "total_matches": 245,
            "team1_wins": 96,
            "team2_wins": 95,
            "draws": 54
        }
    })
    
    events.append((
        str(uuid.uuid4()),
        "Barcelona vs Real Madrid",
        "football",
        "La Liga",
        sunday.isoformat(),
        "Camp Nou, Barcelona",
        "El Clásico - Round 25",
        barcelona_real_markets,
        "upcoming",
        "https://www.shutterstock.com/image-photo/barcelona-vs-real-madrid-3d-260nw-2617044757.jpg",
        barcelona_real_stats
    ))
    
    # 2. Lakers vs Celtics
    lakers_celtics_markets = json.dumps([
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
    ])
    
    lakers_celtics_stats = json.dumps({
        "team1_form": ["W", "W", "L", "W", "W"],
        "team2_form": ["L", "W", "W", "W", "L"],
        "head_to_head": {
            "total_matches": 32,
            "team1_wins": 15,
            "team2_wins": 17,
            "draws": 0
        }
    })
    
    events.append((
        str(uuid.uuid4()),
        "Lakers vs Celtics",
        "basketball",
        "NBA",
        sunday.replace(hour=18, minute=30).isoformat(),
        "Staples Center, Los Angeles",
        "NBA Finals Game 3",
        lakers_celtics_markets,
        "upcoming",
        "https://cdn.nba.com/teams/legacy/www.nba.com/celtics/sites/celtics/files/getty-images-1194990159.jpg",
        lakers_celtics_stats
    ))
    
    # Añadir los 8 eventos restantes de manera similar...
    # 3. Nadal vs Djokovic
    nadal_djokovic_markets = json.dumps([
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
    ])
    
    nadal_djokovic_stats = json.dumps({
        "team1_form": ["W", "W", "W", "W", "L"],
        "team2_form": ["W", "L", "W", "W", "W"],
        "head_to_head": {
            "total_matches": 58,
            "team1_wins": 28,
            "team2_wins": 30,
            "draws": 0
        }
    })
    
    events.append((
        str(uuid.uuid4()),
        "Nadal vs Djokovic",
        "tennis",
        "ATP Masters",
        sunday.replace(hour=14, minute=0).isoformat(),
        "Foro Italico, Rome",
        "Rome Masters Final",
        nadal_djokovic_markets,
        "upcoming",
        "https://estaticos-cdn.prensaiberica.es/clip/ff190822-e2d5-40ab-9df7-8ccdbd924c45_16-9-discover-aspect-ratio_default_0.jpg",
        nadal_djokovic_stats
    ))
    
    # 4. Ferrari vs Red Bull
    f1_markets = json.dumps([
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
    ])
    
    f1_stats = json.dumps({
        "team1_form": ["1", "3", "2", "1", "2"],
        "team2_form": ["2", "1", "1", "2", "1"],
        "head_to_head": {
            "total_matches": 23,
            "team1_wins": 9,
            "team2_wins": 14,
            "draws": 0
        }
    })
    
    events.append((
        str(uuid.uuid4()),
        "Ferrari vs Red Bull Racing",
        "motorsport",
        "Formula 1",
        sunday.replace(hour=13, minute=0).isoformat(),
        "Circuit de Monaco, Monte Carlo",
        "Monaco Grand Prix",
        f1_markets,
        "upcoming",
        "https://mir-s3-cdn-cf.behance.net/project_modules/fs/c39372105002709.5f6f665700bd5.jpg",
        f1_stats
    ))
    
    # 5. Man City vs Liverpool
    city_liverpool_markets = json.dumps([
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
    ])
    
    city_liverpool_stats = json.dumps({
        "team1_form": ["W", "W", "W", "D", "W"],
        "team2_form": ["W", "L", "W", "D", "W"],
        "head_to_head": {
            "total_matches": 189,
            "team1_wins": 88,
            "team2_wins": 69,
            "draws": 32
        }
    })
    
    events.append((
        str(uuid.uuid4()),
        "Manchester City vs Liverpool",
        "football",
        "Premier League",
        (current_date + datetime.timedelta(days=3)).replace(hour=15, minute=0).isoformat(),
        "Etihad Stadium, Manchester",
        "Premier League Round 30",
        city_liverpool_markets,
        "upcoming",
        "https://www.shutterstock.com/image-photo/december-30-logo-manchester-city-260nw-1269920779.jpg",
        city_liverpool_stats
    ))
    
    # 6. PSG vs Bayern
    psg_bayern_markets = json.dumps([
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
    ])
    
    psg_bayern_stats = json.dumps({
        "team1_form": ["W", "W", "W", "W", "D"],
        "team2_form": ["W", "W", "W", "L", "W"],
        "head_to_head": {
            "total_matches": 12,
            "team1_wins": 5,
            "team2_wins": 7,
            "draws": 0
        }
    })
    
    events.append((
        str(uuid.uuid4()),
        "PSG vs Bayern Munich",
        "football",
        "Champions League",
        (current_date + datetime.timedelta(days=4)).replace(hour=20, minute=0).isoformat(),
        "Parc des Princes, Paris",
        "Champions League Semi-Final",
        psg_bayern_markets,
        "upcoming",
        "https://cdn2.mediotiempo.com/uploads/media/2021/04/07/bayern-vs-psg-vivo-champions.jpg",
        psg_bayern_stats
    ))
    
    # Continúa con los eventos restantes...
    # 7. Warriors vs Suns
    warriors_suns_markets = json.dumps([
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
    ])
    
    warriors_suns_stats = json.dumps({
        "team1_form": ["W", "W", "W", "L", "W"],
        "team2_form": ["L", "W", "W", "W", "W"],
        "head_to_head": {
            "total_matches": 28,
            "team1_wins": 18,
            "team2_wins": 10,
            "draws": 0
        }
    })
    
    events.append((
        str(uuid.uuid4()),
        "Warriors vs Suns",
        "basketball",
        "NBA",
        (current_date + datetime.timedelta(days=5)).replace(hour=19, minute=0).isoformat(),
        "Chase Center, San Francisco",
        "Western Conference Playoffs",
        warriors_suns_markets,
        "upcoming",
        "https://i.ytimg.com/vi/MI-JqsONHsg/maxresdefault.jpg",
        warriors_suns_stats
    ))
    
    # 8. Medvedev vs Alcaraz
    medvedev_alcaraz_markets = json.dumps([
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
    ])
    
    medvedev_alcaraz_stats = json.dumps({
        "team1_form": ["W", "L", "W", "W", "L"],
        "team2_form": ["W", "W", "W", "W", "W"],
        "head_to_head": {
            "total_matches": 7,
            "team1_wins": 2,
            "team2_wins": 5,
            "draws": 0
        }
    })
    
    events.append((
        str(uuid.uuid4()),
        "Medvedev vs Alcaraz",
        "tennis",
        "ATP Masters",
        (current_date + datetime.timedelta(days=6)).replace(hour=13, minute=30).isoformat(),
        "Roland Garros, Paris",
        "French Open Quarter-Final",
        medvedev_alcaraz_markets,
        "upcoming",
        "https://i.ytimg.com/vi/f5Iz697rh0E/sddefault.jpg",
        medvedev_alcaraz_stats
    ))
    
    # 9. Arsenal vs Tottenham
    arsenal_tottenham_markets = json.dumps([
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
    ])
    
    arsenal_tottenham_stats = json.dumps({
        "team1_form": ["W", "D", "W", "W", "L"],
        "team2_form": ["L", "W", "D", "W", "W"],
        "head_to_head": {
            "total_matches": 192,
            "team1_wins": 80,
            "team2_wins": 60,
            "draws": 52
        }
    })
    
    events.append((
        str(uuid.uuid4()),
        "Arsenal vs Tottenham",
        "football",
        "Premier League",
        (current_date + datetime.timedelta(days=7)).replace(hour=16, minute=30).isoformat(),
        "Emirates Stadium, London",
        "North London Derby",
        arsenal_tottenham_markets,
        "upcoming",
        "https://e0.365dm.com/15/11/2048x1152/super-sunday-arsenal-tottenham_3373187.jpg",
        arsenal_tottenham_stats
    ))
    
    # 10. Tyson vs Joshua
    tyson_joshua_markets = json.dumps([
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
    ])
    
    tyson_joshua_stats = json.dumps({
        "team1_form": ["W", "W", "W", "W", "W"],
        "team2_form": ["W", "L", "W", "W", "W"],
        "head_to_head": {
            "total_matches": 0,
            "team1_wins": 0,
            "team2_wins": 0,
            "draws": 0
        }
    })
    
    events.append((
        str(uuid.uuid4()),
        "Tyson vs Joshua",
        "boxing",
        "Heavyweight Championship",
        (current_date + datetime.timedelta(days=6)).replace(hour=22, minute=0).isoformat(),
        "Wembley Stadium, London",
        "WBC & WBA Heavyweight Title Fight",
        tyson_joshua_markets,
        "upcoming",
        "https://www.boxingnews24.com/wp-content/uploads/2022/09/joshua-fury-Boxing-Photos.jpg",
        tyson_joshua_stats
    ))
    
    # Insertar todos los eventos
    cursor.executemany('''
    INSERT OR IGNORE INTO events (id, name, sport_type, competition, start_time, venue, description, markets, status, image_url, stats)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', events)
    
    conn.commit()
    conn.close()
    
    print("Base de datos poblada con datos de ejemplo")

# Inicializar la base de datos si no existe
if not os.path.exists(DB_PATH):
    print("Creando base de datos...")
    init_db()
    populate_sample_data()