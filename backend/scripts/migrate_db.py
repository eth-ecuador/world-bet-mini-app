# Archivo: backend/scripts/migrate_db.py

import sys
import os
import sqlite3
import json
import datetime
from pathlib import Path

# Añadir el directorio padre al path para poder importar módulos
sys.path.append(str(Path(__file__).resolve().parent.parent))

from models.database import get_db_connection

def migrate_database():
    """Actualiza la estructura de la base de datos para incluir los nuevos campos."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verificar si las columnas ya existen
    cursor.execute("PRAGMA table_info(events)")
    columns = [col[1] for col in cursor.fetchall()]
    
    # Añadir las nuevas columnas si no existen
    if 'end_time' not in columns:
        print("Añadiendo columna 'end_time'...")
        cursor.execute("ALTER TABLE events ADD COLUMN end_time TEXT")
    
    if 'teams' not in columns:
        print("Añadiendo columna 'teams'...")
        cursor.execute("ALTER TABLE events ADD COLUMN teams TEXT")
    
    conn.commit()
    
    # Actualizar eventos existentes para añadir valores por defecto
    cursor.execute("SELECT id, name, start_time FROM events WHERE teams IS NULL OR end_time IS NULL")
    events_to_update = cursor.fetchall()
    
    for event in events_to_update:
        event_id = event[0]
        event_name = event[1]
        start_time = event[2]
        
        # Crear equipos basados en el nombre del evento
        teams = []
        if " vs " in event_name:
            team_names = event_name.split(" vs ")
            teams = [
                {
                    "id": f"{team_names[0].lower().replace(' ', '-')}-001",
                    "name": team_names[0],
                    "logo_url": f"/{team_names[0][0].lower()}.png",
                    "is_home": True
                },
                {
                    "id": f"{team_names[1].lower().replace(' ', '-')}-001",
                    "name": team_names[1],
                    "logo_url": f"/{team_names[1][0].lower()}.png",
                    "is_home": False
                }
            ]
        
        # Calcular end_time (2 horas después de start_time)
        try:
            dt_start = datetime.datetime.fromisoformat(start_time)
            dt_end = dt_start + datetime.timedelta(hours=2)
            end_time = dt_end.isoformat()
        except:
            # Si hay algún problema con el formato de fecha, usar None
            end_time = None
        
        # Actualizar el evento
        cursor.execute(
            "UPDATE events SET teams = ?, end_time = ? WHERE id = ?",
            (json.dumps(teams) if teams else None, end_time, event_id)
        )
        print(f"Actualizado evento: {event_name}")
    
    conn.commit()
    conn.close()
    
    print(f"Se actualizaron {len(events_to_update)} eventos")
    print("Migración completada")

if __name__ == "__main__":
    migrate_database()