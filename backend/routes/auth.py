from flask import Blueprint, request, jsonify
from utils.auth import get_or_create_user, create_session

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Endpoint para iniciar sesión o registrar un usuario automáticamente.
    Solo requiere el nombre de usuario (dirección Ethereum).
    """
    data = request.get_json()
    
    if not data or not data.get('username'):
        return jsonify({'message': 'Missing username'}), 400
    
    username = data['username']
    
    # Obtener o crear el usuario
    user_id = get_or_create_user(username)
    
    # Crear sesión
    token = create_session(user_id)
    
    return jsonify({
        'session_id': token,
        'user_id': user_id,
        'username': username,
        'expires': 'in 24 hours'
    }), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Endpoint para cerrar sesión de usuario."""
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'message': 'No active session'}), 400
    
    token = auth_header.split(' ')[1]
    
    if token in SESSIONS:
        del SESSIONS[token]
    
    return jsonify({'message': 'Successfully logged out'}), 200