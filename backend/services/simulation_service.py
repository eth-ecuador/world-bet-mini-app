# Crear services/simulation_service.py

import random
import datetime
import json
from models.database import get_db_connection

class SimulationService:
    @staticmethod
    def update_event_statuses():
        """
        Actualiza los estados de los eventos según su tiempo de inicio.
        
        Events que deberían haber comenzado -> 'live'
        Events que deberían haber terminado -> 'completed'
        
        Returns:
            Dict con contadores de eventos actualizados
        """
        conn = get_db_connection()
        cursor = conn.cursor()
        
        current_time = datetime.datetime.now().isoformat()
        
        # Eventos que deberían haber comenzado (asumiendo que duran 2 horas)
        event_duration = datetime.timedelta(hours=2)
        
        # Actualizar a 'live'
        cursor.execute("""
        UPDATE events 
        SET status = 'live' 
        WHERE status = 'upcoming' AND start_time <= ? AND 
              datetime(start_time, '+2 hours') > ?
        """, (current_time, current_time))
        
        live_count = cursor.rowcount
        
        # Actualizar a 'completed'
        cursor.execute("""
        UPDATE events 
        SET status = 'completed' 
        WHERE status IN ('upcoming', 'live') AND 
              datetime(start_time, '+2 hours') <= ?
        """, (current_time,))
        
        completed_count = cursor.rowcount
        
        conn.commit()
        conn.close()
        
        return {
            'live_updated': live_count,
            'completed_updated': completed_count
        }
    
    @staticmethod
    def simulate_event_results():
        """
        Simula resultados para eventos marcados como 'completed'.
        Actualiza las selecciones ganadoras en los mercados.
        
        Returns:
            Lista de eventos con resultados simulados
        """
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Obtener eventos completados sin resultados
        cursor.execute("""
        SELECT * FROM events 
        WHERE status = 'completed'
        """)
        
        completed_events = [dict(row) for row in cursor.fetchall()]
        simulated_events = []
        
        for event in completed_events:
            # Cargar mercados
            markets = json.loads(event['markets'])
            event_id = event['id']
            
            # Simular un ganador para cada mercado
            for market in markets:
                # Seleccionar un resultado aleatorio
                winner_index = random.randint(0, len(market['selections']) - 1)
                
                # Marcar la selección ganadora
                for i, selection in enumerate(market['selections']):
                    selection['result'] = 'win' if i == winner_index else 'loss'
            
            # Guardar resultados simulados
            updated_markets = json.dumps(markets)
            cursor.execute("""
            UPDATE events 
            SET markets = ? 
            WHERE id = ?
            """, (updated_markets, event_id))
            
            # Añadir a la lista de eventos simulados
            event['markets'] = markets
            simulated_events.append(event)
        
        conn.commit()
        conn.close()
        
        return simulated_events
    
    @staticmethod
    def auto_settle_bets():
        """
        Liquida automáticamente las apuestas según los resultados de los eventos.
        
        Returns:
            Lista de apuestas liquidadas
        """
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Obtener todas las apuestas pendientes
        cursor.execute("SELECT * FROM bets WHERE status = 'placed'")
        pending_bets = [dict(row) for row in cursor.fetchall()]
        
        # Obtener todos los eventos completados
        cursor.execute("SELECT * FROM events WHERE status = 'completed'")
        completed_events = {row['id']: dict(row) for row in cursor.fetchall()}
        
        settled_bets = []
        
        for bet in pending_bets:
            selection_id = bet['selection_id']
            event_found = False
            selection_result = None
            
            # Buscar la selección en los eventos completados
            for event_id, event in completed_events.items():
                markets = json.loads(event['markets'])
                for market in markets:
                    for selection in market['selections']:
                        if selection['id'] == selection_id:
                            event_found = True
                            selection_result = selection.get('result')
                            break
                    if event_found:
                        break
                if event_found:
                    break
            
            # Si encontramos el evento y tiene resultado, liquidar la apuesta
            if event_found and selection_result:
                outcome = 'win' if selection_result == 'win' else 'loss'
                
                cursor.execute("""
                UPDATE bets 
                SET status = 'settled', result = ? 
                WHERE id = ?
                """, (outcome, bet['id']))
                
                bet['status'] = 'settled'
                bet['result'] = outcome
                settled_bets.append(bet)
        
        conn.commit()
        conn.close()
        
        return settled_bets