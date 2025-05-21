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
        end_time TEXT,  -- Fecha de fin (nueva)
        venue TEXT,
        description TEXT,
        markets TEXT,  -- JSON
        teams TEXT,    -- JSON (Nuevo campo para equipos)
        status TEXT DEFAULT 'upcoming',
        image_url TEXT,
        stats TEXT  -- JSON,
        highlights_url TEXT  -- Nueva columna para los highlights
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
    
    # Eventos para el domingo y días próximos
    events = []
    
    
    # 3. Nadal vs Djokovic - Equipos y datos
    nadal_djokovic_teams = json.dumps([
        {
            "id": "rafael-nadal-001",
            "name": "Nadal",
            "logo_url": "https://www.thesportsdb.com/images/media/player/thumb/gw8phi1709318258.jpg",
            "is_home": True
        },
        {
            "id": "novak-djokovic-001",
            "name": "Djokovic",
            "logo_url": "https://www.thesportsdb.com/images/media/player/thumb/wvrxm31709318210.jpg",
            "is_home": False
        }
    ])
    
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
    
    nadal_djokovic_end_time = sunday.replace(hour=17, minute=0).isoformat()
    
    events.append((
        str(uuid.uuid4()),
        "Nadal vs Djokovic",
        "tennis",
        "ATP Masters",
        sunday.replace(hour=14, minute=0).isoformat(),
        nadal_djokovic_end_time,  # Fecha de fin
        "Foro Italico, Rome",
        "Rome Masters Final",
        nadal_djokovic_markets,
        nadal_djokovic_teams,  # Equipos
        "upcoming",
        "https://estaticos-cdn.prensaiberica.es/clip/ff190822-e2d5-40ab-9df7-8ccdbd924c45_16-9-discover-aspect-ratio_default_0.jpg",
        nadal_djokovic_stats,
        "https://www.youtube.com/watch?v=0c8RD3fd9hc"  # Añadir enlace de highlight
    ))
    
    # 4. Ferrari vs Red Bull - Equipos y datos
    ferrari_redbull_teams = json.dumps([
        {
            "id": "scuderia-ferrari-001",
            "name": "Ferrari",
            "logo_url": "https://www.thesportsdb.com/images/media/league/badge/aq9ndt1673619381.png",
            "is_home": True
        },
        {
            "id": "red-bull-racing-001",
            "name": "Red Bull",
            "logo_url": "https://r2.thesportsdb.com/images/media/team/badge/nhlev81679826274.png",
            "is_home": False
        }
    ])
    
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
    
    f1_end_time = sunday.replace(hour=15, minute=0).isoformat()
    
    events.append((
        str(uuid.uuid4()),
        "Ferrari vs Red Bull Racing",
        "motorsport",
        "Formula 1",
        sunday.replace(hour=13, minute=0).isoformat(),
        f1_end_time,  # Fecha de fin
        "Circuit de Monaco, Monte Carlo",
        "Monaco Grand Prix",
        f1_markets,
        ferrari_redbull_teams,  # Equipos
        "upcoming",
        "https://mir-s3-cdn-cf.behance.net/project_modules/fs/c39372105002709.5f6f665700bd5.jpg",
        f1_stats
    ))

    
    # 8. Medvedev vs Alcaraz - Equipos y datos
    medvedev_alcaraz_teams = json.dumps([
        {
            "id": "daniil-medvedev-001",
            "name": "Medvedev",
            "logo_url": "https://www.thesportsdb.com/images/media/player/thumb/hlhsx01674816220.jpg",
            "is_home": True
        },
        {
            "id": "carlos-alcaraz-001",
            "name": "Alcaraz",
            "logo_url": "https://www.thesportsdb.com/images/media/player/thumb/q247hy1663175901.jpg",
            "is_home": False
        }
    ])
    
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
    
    medvedev_alcaraz_end_time = (current_date + datetime.timedelta(days=6)).replace(hour=16, minute=30).isoformat()
    
    events.append((
        str(uuid.uuid4()),
        "Medvedev vs Alcaraz",
        "tennis",
        "ATP Masters",
        (current_date + datetime.timedelta(days=6)).replace(hour=13, minute=30).isoformat(),
        medvedev_alcaraz_end_time,  # Fecha de fin
        "Roland Garros, Paris",
        "French Open Quarter-Final",
        medvedev_alcaraz_markets,
        medvedev_alcaraz_teams,  # Equipos
        "upcoming",
        "https://i.ytimg.com/vi/f5Iz697rh0E/sddefault.jpg",
        medvedev_alcaraz_stats,
        "https://www.youtube.com/watch?v=0c8RD3fd9hc"  # Añadir enlace de highlight
    ))
    
    
    
    # 10. Tyson vs Joshua - Equipos y datos
    tyson_joshua_teams = json.dumps([
        {
            "id": "tyson-fury-001",
            "name": "Tyson",
            "logo_url": "https://www.thesportsdb.com/images/media/player/cutout/9bb2pn1706345610.png",
            "is_home": True
        },
        {
            "id": "anthony-joshua-001",
            "name": "Joshua",
            "logo_url": "https://www.thesportsdb.com/images/media/player/cutout/dyfrw01575796518.png",
            "is_home": False
        }
    ])
    
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
    
    tyson_joshua_end_time = (current_date + datetime.timedelta(days=6)).replace(hour=23, minute=30).isoformat()
    
    events.append((
        str(uuid.uuid4()),
        "Tyson vs Joshua",
        "boxing",
        "Heavyweight Championship",
        (current_date + datetime.timedelta(days=6)).replace(hour=22, minute=0).isoformat(),
        tyson_joshua_end_time,  # Fecha de fin
        "Wembley Stadium, London",
        "WBC & WBA Heavyweight Title Fight",
        tyson_joshua_markets,
        tyson_joshua_teams,  # Equipos
        "upcoming",
        "https://www.boxingnews24.com/wp-content/uploads/2022/09/joshua-fury-Boxing-Photos.jpg",
        tyson_joshua_stats,
        "https://www.youtube.com/watch?v=0c8RD3fd9hc"  # Añadir enlace de highlight
    ))
    

    # Actualizar la sentencia INSERT
    cursor.executemany('''
    INSERT OR IGNORE INTO events (
        id, name, sport_type, competition, start_time, end_time, venue, 
        description, markets, teams, status, image_url, stats, highlights_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', events)
    
    conn.commit()
    conn.close()
    
    print("Base de datos poblada con datos de ejemplo")

# Inicializar la base de datos si no existe
if not os.path.exists(DB_PATH):
    print("Creando base de datos...")
    init_db()
    populate_sample_data()