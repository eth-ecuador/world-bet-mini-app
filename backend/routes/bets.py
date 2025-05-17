from flask import Blueprint, request, jsonify
from utils.auth import token_required
from models.bet import Bet

bets_bp = Blueprint('bets', __name__)

@bets_bp.route('', methods=['POST'])
@token_required
def place_bet(current_user):
    """Endpoint para crear una apuesta."""
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