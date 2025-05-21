from models.database import get_db_connection

class Competition:
    @staticmethod
    def get_all(sport_id=None):
        """Obtiene todas las competiciones, opcionalmente filtradas por deporte."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if sport_id:
            cursor.execute(
                "SELECT id, name, sport_id, country, active_events_count, icon_url FROM competitions WHERE sport_id = ?",
                (sport_id,)
            )
        else:
            cursor.execute("SELECT id, name, sport_id, country, active_events_count, icon_url FROM competitions")
        
        competitions = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        return competitions