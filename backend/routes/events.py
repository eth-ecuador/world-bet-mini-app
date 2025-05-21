from flask import Blueprint, request, jsonify
from models.event import Event

events_bp = Blueprint('events', __name__)

@events_bp.route('/featured', methods=['GET'])
def featured_events():
    """Endpoint para listar eventos deportivos destacados."""
    sport_type = request.args.get('sport_type')
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    limit = int(request.args.get('limit', 10))
    page = int(request.args.get('page', 1))
    
    result = Event.get_featured(sport_type, date_from, date_to, limit, page)
    return jsonify(result), 200

@events_bp.route('/<event_id>', methods=['GET'])
def get_event(event_id):
    """Endpoint para obtener un evento específico por ID."""
    event = Event.get_by_id(event_id)
    
    if not event:
        return jsonify({'message': 'Event not found'}), 404
    
    return jsonify(event), 200