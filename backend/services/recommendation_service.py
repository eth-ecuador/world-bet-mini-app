from models.recommendation import Recommendation
from models.bet import Bet
import random
# Añade esta línea al principio del archivo, junto con las otras importaciones:
import json

class RecommendationService:
    @staticmethod
    def get_recommendations_for_user(user_id, limit=5):
        """
        Obtiene recomendaciones personalizadas para un usuario.
        
        Args:
            user_id: ID del usuario
            limit: Número máximo de recomendaciones
            
        Returns:
            Lista de recomendaciones
        """
        # Obtener recomendaciones del modelo
        recommendations = Recommendation.generate_recommendations(user_id, limit)
        
        # Enriquecer cada recomendación con un análisis
        for rec in recommendations:
            rec['analysis'] = RecommendationService.generate_analysis(rec)
        
        return recommendations
    
    @staticmethod
    def generate_analysis(recommendation):
        """
        Genera un análisis textual para una recomendación.
        
        Args:
            recommendation: Datos de la recomendación
            
        Returns:
            Texto de análisis
        """
        # Frases basadas en el nivel de confianza
        conf = recommendation['confidence']
        
        if conf >= 40:
            confidence_phrase = "Esta apuesta muestra un valor excepcional."
        elif conf >= 30:
            confidence_phrase = "Esta apuesta muestra un gran valor."
        elif conf >= 20:
            confidence_phrase = "Esta apuesta tiene un buen valor."
        elif conf >= 10:
            confidence_phrase = "Esta apuesta tiene un valor moderado."
        else:
            confidence_phrase = "Esta apuesta tiene un ligero valor positivo."
        
        # Frases basadas en las cuotas
        odds = recommendation['odds']
        if odds < 1.5:
            odds_phrase = "Las cuotas son bajas pero la probabilidad de éxito es alta."
        elif odds < 3.0:
            odds_phrase = "Las cuotas ofrecen un equilibrio entre riesgo y recompensa."
        else:
            odds_phrase = "Las cuotas son altas, ofreciendo una gran recompensa potencial a pesar del riesgo."
        
        analysis = f"{confidence_phrase} {odds_phrase} Nuestro análisis sugiere que las cuotas actuales de {odds} subestiman las posibilidades reales de esta selección."
        
        return analysis
    
    @staticmethod
    def get_recommendation_for_event(event_id, user_id=None):
        """
        Obtiene la mejor recomendación para un evento específico.
        
        Args:
            event_id: ID del evento
            user_id: ID del usuario (opcional, para personalización)
            
        Returns:
            La mejor selección recomendada o None
        """
        from models.event import Event
        
        # Obtener datos del evento
        event = Event.get_by_id(event_id)
        if not event:
            return None
        
        # Analizar todas las selecciones
        best_selection = None
        best_value = 0
        
        for market in event['markets']:
            for selection in market['selections']:
                # Estimar probabilidad real
                estimated_prob = Recommendation.estimate_real_probability(selection, event)
                
                # Calcular valor esperado
                value = Recommendation.calculate_value_bet(selection['odds'], estimated_prob)
                
                # Actualizar la mejor selección si tiene mejor valor
                if value > best_value:
                    best_value = value
                    confidence = (value - 1.0) * 100 if value > 1.0 else 0
                    best_selection = {
                        "market_name": market['name'],
                        "selection_id": selection['id'],
                        "selection_name": selection['name'],
                        "odds": selection['odds'],
                        "confidence": min(round(confidence, 1), 99.9),
                        "value": round(value, 2)
                    }
        
        # Si encontramos una selección con valor positivo
        if best_selection and best_selection['value'] > 1.0:
            best_selection['analysis'] = RecommendationService.generate_analysis(best_selection)
            return best_selection
        
        return None
    
    @staticmethod
    def apply_recommendation_to_bet(bet_data, user_id):
        """
        Aplica recomendaciones a una apuesta antes de colocarla.
        
        Args:
            bet_data: Datos de la apuesta (selection_id, stake_amount, etc.)
            user_id: ID del usuario
            
        Returns:
            Datos de apuesta enriquecidos con recomendaciones
        """
        # Si la apuesta ya indica que no quiere usar recomendación IA
        if 'use_ai_recommendation' in bet_data and not bet_data['use_ai_recommendation']:
            return bet_data
        
        # 1. Buscar el evento basado en selection_id
        from models.database import get_db_connection
        conn = get_db_connection()
        cursor = conn.cursor()
        
        selection_id = bet_data['selection_id']
        
        # Buscar en todos los eventos para encontrar uno con esta selección
        cursor.execute("SELECT * FROM events")
        events = cursor.fetchall()
        
        event_id = None
        for event in events:
            markets = json.loads(event['markets'])
            for market in markets:
                for selection in market['selections']:
                    if selection['id'] == selection_id:
                        event_id = event['id']
                        break
                if event_id:
                    break
            if event_id:
                break
        
        conn.close()
        
        if not event_id:
            # No pudimos encontrar el evento, devolver los datos originales
            return bet_data
        
        # 2. Obtener recomendación para este evento
        recommendation = RecommendationService.get_recommendation_for_event(event_id, user_id)
        
        # 3. Si hay una recomendación y es para otra selección, sugerir cambio
        if recommendation and recommendation['selection_id'] != selection_id:
            bet_data['ai_suggestion'] = {
                "message": f"Hemos analizado tu apuesta y hay una selección con mejor valor: {recommendation['selection_name']} ({recommendation['odds']}) en el mercado {recommendation['market_name']}.",
                "reason": recommendation['analysis'],
                "alternative_selection_id": recommendation['selection_id']
            }
        elif recommendation and recommendation['selection_id'] == selection_id:
            # La selección actual es la recomendada, reforzar la decisión
            bet_data['ai_confirmation'] = {
                "message": f"¡Excelente elección! Esta selección tiene un buen valor.",
                "confidence": recommendation['confidence'],
                "analysis": recommendation['analysis']
            }
        
        return bet_data

# Añade este nuevo endpoint al final del archivo, antes de la última línea
@recommendations_bp.route('/force-recommendation', methods=['GET'])
@token_required
def force_recommendation(current_user):
    """Endpoint para forzar recomendaciones ignorando algunos criterios estrictos."""
    from models.database import get_db_connection
    import json
    import random
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Obtener eventos próximos
    cursor.execute("""
    SELECT id, name, sport_type, competition, markets, start_time 
    FROM events 
    WHERE status = 'upcoming' 
    ORDER BY start_time ASC
    LIMIT 20
    """)
    
    events = cursor.fetchall()
    forced_recommendations = []
    
    for event in events:
        event_dict = dict(event)
        event_id = event_dict['id']
        markets = json.loads(event_dict['markets'])
        
        # Elegir una selección aleatoria con buena cuota
        for market in markets:
            best_selection = None
            best_odds = 0
            
            for selection in market['selections']:
                # Buscar la selección con mejor cuota
                if selection['odds'] > best_odds and selection['odds'] < 5.0:
                    best_odds = selection['odds']
                    best_selection = selection
            
            if best_selection:
                # Crear una recomendación forzada con esta selección
                confidence = random.uniform(15.0, 35.0)  # Confianza simulada
                
                recommendation = {
                    "event_id": event_id,
                    "event_name": event_dict['name'],
                    "sport_type": event_dict['sport_type'],
                    "competition": event_dict['competition'],
                    "market_name": market['name'],
                    "selection_id": best_selection['id'],
                    "selection_name": best_selection['name'],
                    "odds": best_selection['odds'],
                    "confidence": round(confidence, 1),
                    "value": round(1.0 + (confidence / 100), 2),
                    "analysis": f"Esta selección ofrece un buen valor con una cuota de {best_selection['odds']}. Nuestra confianza es moderada a alta basada en el análisis estadístico."
                }
                
                forced_recommendations.append(recommendation)
                break  # Solo una recomendación por evento
    
    # Tomar las mejores recomendaciones hasta el límite
    limit = int(request.args.get('limit', 5))
    recommendations = sorted(forced_recommendations, key=lambda x: x['value'], reverse=True)[:limit]
    
    conn.close()
    
    return jsonify({
        'user_id': current_user,
        'recommendations_count': len(recommendations),
        'recommendations': recommendations,
        'notice': 'Estas son recomendaciones forzadas para demostración'
    }), 200