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
            # Cargar equipos (nuevo campo)
            teams = json.loads(row_dict['teams']) if row_dict.get('teams') else []
            
            events.append({
                "id": row_dict['id'],
                "name": row_dict['name'],
                "sport_type": row_dict['sport_type'],
                "competition": row_dict['competition'],
                "start_time": row_dict['start_time'],
                "end_time": row_dict.get('end_time'),  # Incluir fecha de fin
                "teams": teams,  # Incluir equipos
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
        
        if 'teams' in event and event['teams']:
            event['teams'] = json.loads(event['teams'])
        
        if 'stats' in event and event['stats']:
            event['stats'] = json.loads(event['stats'])
        
        conn.close()
        return event
    
    @staticmethod
    def get_events_by_sport(sport_type, limit=10, page=1):
        """Obtiene eventos filtrados por tipo de deporte."""
        return Event.get_featured(sport_type=sport_type, limit=limit, page=page)
    
    @staticmethod
    def get_events_by_competition(competition, limit=10, page=1):
        """Obtiene eventos filtrados por competición."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM events WHERE competition = ? ORDER BY start_time ASC"
        params = [competition]
        
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
            teams = json.loads(row_dict['teams']) if row_dict.get('teams') else []
            
            events.append({
                "id": row_dict['id'],
                "name": row_dict['name'],
                "sport_type": row_dict['sport_type'],
                "competition": row_dict['competition'],
                "start_time": row_dict['start_time'],
                "end_time": row_dict.get('end_time'),
                "teams": teams,
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
    def get_live_events(limit=10, page=1):
        """Obtiene eventos en vivo."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM events WHERE status = 'live' ORDER BY start_time ASC"
        params = []
        
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
            teams = json.loads(row_dict['teams']) if row_dict.get('teams') else []
            
            events.append({
                "id": row_dict['id'],
                "name": row_dict['name'],
                "sport_type": row_dict['sport_type'],
                "competition": row_dict['competition'],
                "start_time": row_dict['start_time'],
                "end_time": row_dict.get('end_time'),
                "teams": teams,
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
    def search_events(query_text, limit=10, page=1):
        """Busca eventos que coincidan con el texto de búsqueda."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Usar LIKE para búsqueda básica
        search_param = f"%{query_text}%"
        query = "SELECT * FROM events WHERE name LIKE ? OR description LIKE ? OR competition LIKE ? ORDER BY start_time ASC"
        params = [search_param, search_param, search_param]
        
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
            teams = json.loads(row_dict['teams']) if row_dict.get('teams') else []
            
            events.append({
                "id": row_dict['id'],
                "name": row_dict['name'],
                "sport_type": row_dict['sport_type'],
                "competition": row_dict['competition'],
                "start_time": row_dict['start_time'],
                "end_time": row_dict.get('end_time'),
                "teams": teams,
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
    def update_event_status(event_id, new_status):
        """Actualiza el estado de un evento."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "UPDATE events SET status = ? WHERE id = ?",
            (new_status, event_id)
        )
        
        conn.commit()
        
        # Verificar si se actualizó alguna fila
        success = cursor.rowcount > 0
        
        conn.close()
        return success
    
    @staticmethod
    def get_upcoming_events(days=7, limit=10, page=1):
        """Obtiene eventos próximos en los siguientes X días."""
        import datetime
        
        # Fecha actual
        current_date = datetime.datetime.now().isoformat()
        
        # Fecha límite (X días después)
        future_date = (datetime.datetime.now() + datetime.timedelta(days=days)).isoformat()
        
        return Event.get_featured(
            date_from=current_date,
            date_to=future_date,
            limit=limit,
            page=page
        )