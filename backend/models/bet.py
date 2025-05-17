from models.database import get_db_connection
import json
import datetime
import uuid
import random

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
    
    @staticmethod
    def get_bet_by_id(bet_id):
        """
        Obtiene una apuesta por su ID.
        
        Args:
            bet_id: ID de la apuesta
        
        Returns:
            La apuesta o None si no se encuentra
        """
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM bets WHERE id = ?", (bet_id,))
        bet_row = cursor.fetchone()
        
        if not bet_row:
            conn.close()
            return None
        
        bet = dict(bet_row)
        if bet['commission']:
            bet['commission'] = json.loads(bet['commission'])
        
        conn.close()
        return bet
    
    @staticmethod
    def settle_bet(bet_id, outcome):
        """
        Liquida una apuesta marcándola como finalizada y estableciendo su resultado.
        
        Args:
            bet_id: ID de la apuesta a liquidar
            outcome: Resultado ('win', 'loss', 'void', 'half_win', 'half_loss')
        
        Returns:
            La apuesta actualizada o None si no se encuentra
        """
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Primero verificamos que la apuesta exista y no esté ya liquidada
        cursor.execute("SELECT * FROM bets WHERE id = ?", (bet_id,))
        bet_row = cursor.fetchone()
        
        if not bet_row:
            conn.close()
            return None
        
        bet = dict(bet_row)
        
        if bet['status'] == 'settled':
            conn.close()
            return bet  # Ya está liquidada
        
        # Actualizar la apuesta
        cursor.execute("""
        UPDATE bets 
        SET status = 'settled', result = ?
        WHERE id = ?
        """, (outcome, bet_id))
        
        conn.commit()
        
        # Obtener la apuesta actualizada
        cursor.execute("SELECT * FROM bets WHERE id = ?", (bet_id,))
        updated_bet = dict(cursor.fetchone())
        
        if updated_bet['commission']:
            updated_bet['commission'] = json.loads(updated_bet['commission'])
        
        conn.close()
        return updated_bet
    
    @staticmethod
    def simulate_results():
        """
        Simula resultados para apuestas pendientes con eventos que ya deberían haber terminado.
        
        Returns:
            Lista de apuestas liquidadas
        """
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Obtener apuestas pendientes cuyo tiempo estimado de resultado ya pasó
        current_time = datetime.datetime.now().isoformat()
        cursor.execute("""
        SELECT * FROM bets 
        WHERE status = 'placed' AND estimated_result_time < ?
        """, (current_time,))
        
        pending_bets = [dict(row) for row in cursor.fetchall()]
        settled_bets = []
        
        for bet in pending_bets:
            # Simular resultado (50% probabilidad de ganar, 50% de perder)
            outcome = 'win' if random.random() > 0.5 else 'loss'
            
            # Actualizar en la base de datos
            cursor.execute("""
            UPDATE bets 
            SET status = 'settled', result = ?
            WHERE id = ?
            """, (outcome, bet['id']))
            
            bet['status'] = 'settled'
            bet['result'] = outcome
            if bet['commission']:
                bet['commission'] = json.loads(bet['commission'])
            
            settled_bets.append(bet)
        
        conn.commit()
        conn.close()
        
        return settled_bets
    
    @staticmethod
    def calculate_user_profit(user_id):
        """
        Calcula el beneficio total de un usuario basado en sus apuestas liquidadas.
        
        Args:
            user_id: ID del usuario
        
        Returns:
            Dict con estadísticas de beneficios
        """
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
        SELECT * FROM bets 
        WHERE user_id = ? AND status = 'settled'
        """, (user_id,))
        
        settled_bets = [dict(row) for row in cursor.fetchall()]
        
        total_staked = 0
        total_returned = 0
        total_profit = 0
        win_count = 0
        loss_count = 0
        
        for bet in settled_bets:
            total_staked += bet['stake_amount']
            
            if bet['result'] == 'win':
                win_count += 1
                total_returned += bet['potential_return']
                total_profit += bet['potential_return'] - bet['stake_amount']
            elif bet['result'] == 'loss':
                loss_count += 1
                # No hay retorno, la pérdida es el monto apostado
                total_profit -= bet['stake_amount']
            elif bet['result'] == 'void':
                # En caso de anulación, se devuelve el monto apostado
                total_returned += bet['stake_amount']
            elif bet['result'] == 'half_win':
                win_count += 0.5
                loss_count += 0.5
                # Gana la mitad, retorno = stake + (potential_return - stake) / 2
                half_profit = (bet['potential_return'] - bet['stake_amount']) / 2
                total_returned += bet['stake_amount'] + half_profit
                total_profit += half_profit
            elif bet['result'] == 'half_loss':
                win_count += 0.5
                loss_count += 0.5
                # Pierde la mitad, retorno = stake / 2
                total_returned += bet['stake_amount'] / 2
                total_profit -= bet['stake_amount'] / 2
        
        conn.close()
        
        # Calcular estadísticas
        total_bets = len(settled_bets)
        win_rate = (win_count / total_bets * 100) if total_bets > 0 else 0
        roi = (total_profit / total_staked * 100) if total_staked > 0 else 0
        
        return {
            'user_id': user_id,
            'total_bets': total_bets,
            'win_count': win_count,
            'loss_count': loss_count,
            'win_rate': round(win_rate, 2),
            'total_staked': round(total_staked, 2),
            'total_returned': round(total_returned, 2),
            'total_profit': round(total_profit, 2),
            'roi': round(roi, 2)  # Return on Investment (%)
        }