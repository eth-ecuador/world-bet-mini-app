from flask import Blueprint, request, jsonify
from utils.auth import token_required
from models.bet import Bet

bets_bp = Blueprint('bets', __name__)

@bets_bp.route('', methods=['POST'])
@token_required
def place_bet(current_user):
    """Endpoint para crear una apuesta simulada."""
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'Invalid request data'}), 400
    
    required_fields = ['selection_id', 'stake_amount', 'currency']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing required field: {field}'}), 400
    
    selection_id = data['selection_id']
    stake_amount = data['stake_amount']
    currency = data['currency']
    use_ai_recommendation = data.get('use_ai_recommendation', False)
    
    bet = Bet.create(current_user, selection_id, stake_amount, currency, use_ai_recommendation)
    
    if not bet:
        return jsonify({'message': 'Invalid selection_id'}), 400
    
    return jsonify(bet), 201

@bets_bp.route('', methods=['GET'])
@token_required
def get_bets(current_user):
    """Endpoint para obtener las apuestas del usuario actual."""
    status = request.args.get('status', 'all')
    limit = int(request.args.get('limit', 10))
    page = int(request.args.get('page', 1))
    
    bets = Bet.get_user_bets(current_user, status, limit, page)
    
    return jsonify(bets), 200

@bets_bp.route('/<bet_id>', methods=['GET'])
@token_required
def get_bet_details(current_user, bet_id):
    """Endpoint para obtener detalles de una apuesta específica."""
    bet = Bet.get_bet_by_id(bet_id)
    
    if not bet:
        return jsonify({'message': 'Bet not found'}), 404
    
    # Verificar que la apuesta pertenece al usuario
    if bet['user_id'] != current_user:
        return jsonify({'message': 'Unauthorized access to this bet'}), 403
    
    return jsonify(bet), 200

@bets_bp.route('/<bet_id>/settle', methods=['POST'])
@token_required
def settle_bet(current_user, bet_id):
    """Endpoint para liquidar una apuesta manualmente (solo para demostración)."""
    data = request.get_json()
    
    if not data or 'outcome' not in data:
        return jsonify({'message': 'Missing outcome parameter'}), 400
    
    outcome = data['outcome']
    if outcome not in ['win', 'loss', 'void', 'half_win', 'half_loss']:
        return jsonify({'message': 'Invalid outcome value'}), 400
    
    # Verificar que el usuario es propietario de la apuesta
    bet = Bet.get_bet_by_id(bet_id)
    if not bet:
        return jsonify({'message': 'Bet not found'}), 404
    
    if bet['user_id'] != current_user:
        return jsonify({'message': 'Unauthorized access to this bet'}), 403
    
    # Liquidar la apuesta
    updated_bet = Bet.settle_bet(bet_id, outcome)
    
    if not updated_bet:
        return jsonify({'message': 'Error settling bet'}), 500
    
    return jsonify(updated_bet), 200

@bets_bp.route('/simulate', methods=['POST'])
@token_required
def simulate_results(current_user):
    """Endpoint para simular resultados de apuestas pendientes."""
    # Para fines de demostración, permitimos que cualquier usuario active la simulación
    # En un sistema real, esto sería un proceso automatizado o restringido a administradores
    
    settled_bets = Bet.simulate_results()
    
    # Filtrar solo las apuestas del usuario actual
    user_settled_bets = [bet for bet in settled_bets if bet['user_id'] == current_user]
    
    return jsonify({
        'message': f'{len(user_settled_bets)} bets settled for current user',
        'total_settled': len(settled_bets),
        'settled_bets': user_settled_bets
    }), 200

@bets_bp.route('/stats', methods=['GET'])
@token_required
def get_user_stats(current_user):
    """Endpoint para obtener estadísticas de apuestas del usuario."""
    stats = Bet.calculate_user_profit(current_user)
    
    return jsonify({
        'user_id': current_user,
        'betting_stats': stats
    }), 200

@bets_bp.route('/active', methods=['GET'])
@token_required
def get_active_bets(current_user):
    """Endpoint para obtener las apuestas activas del usuario actual."""
    limit = int(request.args.get('limit', 10))
    page = int(request.args.get('page', 1))
    
    bets = Bet.get_user_bets(current_user, 'placed', limit, page)
    
    return jsonify(bets), 200

@bets_bp.route('/history', methods=['GET'])
@token_required
def get_bet_history(current_user):
    """Endpoint para obtener el historial de apuestas del usuario actual."""
    limit = int(request.args.get('limit', 10))
    page = int(request.args.get('page', 1))
    
    bets = Bet.get_user_bets(current_user, 'settled', limit, page)
    
    return jsonify(bets), 200