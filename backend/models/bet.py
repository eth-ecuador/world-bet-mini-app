from models.database import get_db_connection
import json
import datetime
import uuid

class Bet:
    @staticmethod
    def create(user_id, selection_id, stake_amount, currency, use_ai_recommendation):
        """Crea una nueva apuesta."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Buscar la selección en los eventos
        cursor.execute("SELECT * FROM events")
        events = cursor.fetchall()
        
        selection = None
        event = None
        event_name = ""
        selection_name = ""
        odds = 0
        
        for evt in events:
            evt_dict = dict(evt)
            markets = json.loads(evt_dict['markets'])
            for market in markets:
                for sel in market['selections']:
                    if sel['id'] == selection_id:
                        selection = sel
                        event = evt_dict
                        event_name = evt_dict['name']
                        selection_name = sel['name']
                        odds = sel['odds']
                        break
                if selection:
                    break
            if selection:
                break
        
        if not selection:
            conn.close()
            return None
        
        bet_id = str(uuid.uuid4())
        potential_return = stake_amount * odds
        
        commission = {
            "standard": round(stake_amount * 0.03, 2),
            "ai_premium": round(stake_amount * 0.01, 2) if use_ai_recommendation else 0,
            "profit_percentage": 5
        }
        
        # Insertar apuesta
        cursor.execute('''
        INSERT INTO bets (
            id, user_id, selection_id, event_name, selection_name, odds, 
            stake_amount, currency, potential_return, commission, 
            created_at, estimated_result_time, status, used_ai_recommendation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            bet_id, user_id, selection_id, event_name, selection_name, odds,
            stake_amount, currency, potential_return, json.dumps(commission),
            datetime.datetime.now().isoformat(), event['start_time'], 'placed',
            1 if use_ai_recommendation else 0
        ))
        
        conn.commit()
        
        # Recuperar la apuesta creada
        cursor.execute("SELECT * FROM bets WHERE id = ?", (bet_id,))
        bet_row = cursor.fetchone()
        bet = dict(bet_row)
        bet['commission'] = json.loads(bet['commission'])
        
        conn.close()
        return bet
    
    @staticmethod
    def get_user_bets(user_id, status="all", limit=10, page=1):
        """Obtiene las apuestas de un usuario con filtros opcionales."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM bets WHERE user_id = ?"
        params = [user_id]
        
        if status != "all":
            query += " AND status = ?"
            params.append(status)
        
        # Obtener el recuento total
        count_query = query.replace("SELECT *", "SELECT COUNT(*)")
        cursor.execute(count_query, params)
        total_count = cursor.fetchone()[0]
        
        # Aplicar ordenamiento y paginación
        query += " ORDER BY created_at DESC"
        offset = (page - 1) * limit
        query += f" LIMIT {limit} OFFSET {offset}"
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        
        # Formatear resultados
        bets = []
        for row in results:
            bet = dict(row)
            if 'commission' in bet and bet['commission']:
                bet['commission'] = json.loads(bet['commission'])
            bets.append({
                "bet_id": bet['id'],
                "event_name": bet['event_name'],
                "selection_name": bet['selection_name'],
                "odds": bet['odds'],
                "stake_amount": bet['stake_amount'],
                "currency": bet['currency'],
                "potential_return": bet['potential_return'],
                "status": bet['status'],
                "placed_at": bet['created_at'],
                "result": bet['result'],
                "used_ai_recommendation": bool(bet['used_ai_recommendation'])
            })
        
        conn.close()
        
        return {
            "bets": bets,
            "total_count": total_count,
            "page": page
        }