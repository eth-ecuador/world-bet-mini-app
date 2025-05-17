from models.database import get_db_connection

class Sport:
    @staticmethod
    def get_all():
        """Obtiene todos los deportes de la base de datos."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, name, active_events_count, icon_url FROM sports")
        sports = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        return sports