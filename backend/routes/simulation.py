# Crear routes/simulation.py

from flask import Blueprint, jsonify, request
from utils.auth import token_required
from services.simulation_service import SimulationService

simulation_bp = Blueprint('simulation', __name__)

@simulation_bp.route('/update-events', methods=['POST'])
@token_required
def update_event_statuses(current_user):
    """Actualiza los estados de los eventos según el tiempo."""
    results = SimulationService.update_event_statuses()
    return jsonify({
        'message': 'Events status updated',
        'live_updated': results['live_updated'],
        'completed_updated': results['completed_updated']
    }), 200

@simulation_bp.route('/simulate-results', methods=['POST'])
@token_required
def simulate_event_results(current_user):
    """Simula resultados para eventos completados."""
    simulated_events = SimulationService.simulate_event_results()
    return jsonify({
        'message': f'{len(simulated_events)} events simulated',
        'simulated_count': len(simulated_events)
    }), 200

@simulation_bp.route('/settle-bets', methods=['POST'])
@token_required
def auto_settle_bets(current_user):
    """Liquida automáticamente las apuestas según los resultados."""
    settled_bets = SimulationService.auto_settle_bets()
    return jsonify({
        'message': f'{len(settled_bets)} bets settled',
        'settled_count': len(settled_bets)
    }), 200

@simulation_bp.route('/run-simulation-cycle', methods=['POST'])
@token_required
def run_simulation_cycle(current_user):
    """Ejecuta un ciclo completo de simulación: actualizar eventos -> simular resultados -> liquidar apuestas."""
    # 1. Actualizar estados de eventos
    status_results = SimulationService.update_event_statuses()
    
    # 2. Simular resultados de eventos
    event_results = SimulationService.simulate_event_results()
    
    # 3. Liquidar apuestas
    bet_results = SimulationService.auto_settle_bets()
    
    return jsonify({
        'message': 'Simulation cycle completed',
        'events_updated': {
            'live': status_results['live_updated'],
            'completed': status_results['completed_updated']
        },
        'events_simulated': len(event_results),
        'bets_settled': len(bet_results)
    }), 200