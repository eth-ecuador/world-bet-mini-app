import jwt
import datetime
import uuid
from functools import wraps
from flask import request, jsonify, current_app
from models.database import get_db_connection

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

def get_or_create_user(username):
    """
    Obtiene un usuario existente o crea uno nuevo si no existe.
    
    Args:
        username: Dirección Ethereum u otro identificador de usuario
        
    Returns:
        ID del usuario (existente o recién creado)
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Buscar el usuario
    cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    
    if user:
        # Usuario encontrado, devolver su ID
        user_id = user['id']
    else:
        # Usuario no encontrado, crear uno nuevo
        user_id = str(uuid.uuid4())  # Generar ID único
        cursor.execute(
            "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
            (user_id, username, "")  # Contraseña vacía ya que no la usamos
        )
        conn.commit()
    
    conn.close()
    return user_id

def create_session(user_id):
    """Crea una sesión para el usuario autenticado."""
    token = generate_token(user_id)
    SESSIONS[token] = user_id
    return token