from flask import Blueprint, request, jsonify
from utils.auth import authenticate_user, create_session

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint para iniciar sesión de usuario."""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400
    
    user_id = authenticate_user(data['username'], data['password'])
    
    if not user_id:
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = create_session(user_id)
    
    return jsonify({
        'session_id': token,
        'user_id': user_id,
        'expires': 'in 24 hours'
    }), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Endpoint para cerrar sesión de usuario."""
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'message': 'No active session'}), 400
    
    token = auth_header.split(' ')[1]
    
    # Aquí deberías invalidar el token en el sistema
    from utils.auth import SESSIONS
    if token in SESSIONS:
        del SESSIONS[token]
    
    return jsonify({'message': 'Successfully logged out'}), 200