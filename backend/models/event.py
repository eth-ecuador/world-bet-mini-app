from models.database import get_db_connection
import json

class Event:
    @staticmethod
    def get_featured(sport_type=None, date_from=None, date_to=None, limit=10, page=1):
        """Obtiene eventos destacados con filtros opcionales."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Construir la consulta base
        query = "SELECT * FROM events WHERE 1=1"
        params = []
        
        # Añadir filtros
        if sport_type:
            query += " AND sport_type = ?"
            params.append(sport_type)
        
        if date_from:
            query += " AND start_time >= ?"
            params.append(date_from)
        
        if date_to:
            query += " AND start_time <= ?"
            params.append(date_to)
        
        # Añadir ordenamiento y paginación
        query += " ORDER BY start_time ASC"
        
        # Obtener el recuento total
        count_query = query.replace("SELECT *", "SELECT COUNT(*)")
        cursor.execute(count_query, params)
        total_count = cursor.fetchone()[0]
        
        # Aplicar límite
        offset = (page - 1) * limit
        query += f" LIMIT {limit} OFFSET {offset}"
        
        # Ejecutar la consulta principal
        cursor.execute(query, params)
        results = cursor.fetchall()
        
        # Formatear resultados
        events = []
        for row in results:
            row_dict = dict(row)
            markets = json.loads(row_dict['markets'])
            events.append({
                "id": row_dict['id'],
                "name": row_dict['name'],
                "sport_type": row_dict['sport_type'],
                "competition": row_dict['competition'],
                "start_time": row_dict['start_time'],
                "main_markets": [markets[0]] if markets else [],
                "status": row_dict['status'],
                "image_url": row_dict['image_url']
            })
        
        conn.close()
        
        return {
            "events": events,
            "total_count": total_count,
            "page": page
        }
    
    @staticmethod
    def get_by_id(event_id):
        """Obtiene un evento específico por su ID."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM events WHERE id = ?", (event_id,))
        row = cursor.fetchone()
        
        if not row:
            conn.close()
            return None
        
        # Convertir a diccionario
        event = dict(row)
        
        # Convertir campos JSON de texto a diccionarios
        if 'markets' in event and event['markets']:
            event['markets'] = json.loads(event['markets'])
        
        if 'stats' in event and event['stats']:
            event['stats'] = json.loads(event['stats'])
        
        conn.close()
        return event