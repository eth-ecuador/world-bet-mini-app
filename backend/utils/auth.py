import jwt
import datetime
from functools import wraps
from flask import request, jsonify, current_app

# Simulación de usuarios
USERS = {
    "user1": {
        "id": "user1",
        "username": "demouser",
        "password": "password123"  # En un entorno real, esto estaría hasheado
    }
}

# Sesiones activas simuladas
SESSIONS = {}

def generate_token(user_id):
    """Genera un token JWT para el usuario."""
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    """Decorador para verificar el token JWT en las rutas protegidas."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = payload['sub']
            
            if token not in SESSIONS or SESSIONS[token] != current_user:
                return jsonify({'message': 'Invalid or expired token'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

def authenticate_user(username, password):
    """Autentica a un usuario con nombre de usuario y contraseña."""
    for user_id, user in USERS.items():
        if user['username'] == username and user['password'] == password:
            return user_id
    return None

def create_session(user_id):
    """Crea una sesión para el usuario autenticado."""
    token = generate_token(user_id)
    SESSIONS[token] = user_id
    return token