# En backend/scripts/add_highlights.py
import sys
import os
import sqlite3
from pathlib import Path

# Añadir el directorio padre al path para poder importar módulos
sys.path.append(str(Path(__file__).resolve().parent.parent))

from models.database import get_db_connection

def add_highlights_column():
    """Añade la columna highlights_url a la tabla events si no existe."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verificar si la columna ya existe
    cursor.execute("PRAGMA table_info(events)")
    columns = [col[1] for col in cursor.fetchall()]
    
    # Añadir la columna si no existe
    if 'highlights_url' not in columns:
        print("Añadiendo columna 'highlights_url' a la tabla events...")
        cursor.execute("ALTER TABLE events ADD COLUMN highlights_url TEXT")
        conn.commit()
        print("Columna añadida correctamente")
    else:
        print("La columna 'highlights_url' ya existe en la tabla events")
    
    # Actualizar eventos existentes con enlaces de highlights
    # Aquí puedes añadir enlaces específicos para eventos existentes
    highlights_data = [
        ('Lakers vs Celtics', 'https://www.youtube.com/watch?v=hUbrUO5xFrM'),
        ('Nadal vs Djokovic', 'https://www.youtube.com/watch?v=X8VH-Tb5BM4'),
        ('Ferrari vs Red Bull Racing', 'https://www.youtube.com/watch?v=IfNYcNZZCLI'),
        ('Warriors vs Suns', 'https://www.youtube.com/watch?v=X7BLBkCfGh0'),
        ('Medvedev vs Alcaraz', 'https://www.youtube.com/watch?v=d3LPhPDLKA4'),
        ('Arsenal vs Tottenham', 'https://www.youtube.com/watch?v=SXm5pG2abw0'),
        ('Tyson vs Joshua', 'https://www.youtube.com/watch?v=nPp8ynCLiQQ')
    ]
    
    updated_count = 0
    for event_name, highlights_url in highlights_data:
        cursor.execute(
            "UPDATE events SET highlights_url = ? WHERE name = ? AND highlights_url IS NULL",
            (highlights_url, event_name)
        )
        updated_count += cursor.rowcount
    
    conn.commit()
    print(f"Actualizados {updated_count} eventos con enlaces de highlights")
    
    conn.close()

if __name__ == "__main__":
    add_highlights_column()