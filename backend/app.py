import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pathlib import Path

# Crear la aplicación Flask
app = Flask(__name__)

# Configurar la aplicación desde config.py
try:
    from config import Config
    app.config.from_object(Config)
except ImportError:
    # Configuración básica si no existe config.py
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
    app.config['DEBUG'] = os.environ.get('FLASK_ENV', 'production') != 'production'

# Configurar CORS para permitir solicitudes desde cualquier origen en producción
CORS(app, resources={r"/*": {"origins": "*"}})

# Verificar si estamos en entorno de producción (Render)
is_production = os.environ.get('RENDER', False) or os.environ.get('FLASK_ENV') == 'production'

# Configurar rutas para la base de datos
if is_production:
    # Estamos en Render o producción, usar el directorio persistente si está disponible
    DB_DIR = Path("/opt/render/project/src/backend/database")
else:
    # Entorno local de desarrollo
    current_dir = Path(__file__).resolve().parent
    DB_DIR = current_dir / "database"

# Crear directorio de base de datos si no existe
DB_DIR.mkdir(exist_ok=True)
DB_PATH = DB_DIR / "worldbet.db"

# Ajustar PYTHONPATH para permitir importaciones relativas
import sys
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)
if os.path.dirname(current_dir) not in sys.path:
    sys.path.append(os.path.dirname(current_dir))

# Inicializar la base de datos
from models.database import init_db, populate_sample_data

# Verificar si la base de datos existe
if not os.path.exists(DB_PATH):
    print("Inicializando base de datos...")
    init_db()
    populate_sample_data()

# Ruta de inicio para verificación rápida
@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "World Bet Mini App API",
        "status": "running",
        "version": "1.0.0",
        "environment": "production" if is_production else "development",
        "available_endpoints": [
            "/events/featured",
            "/events/{event_id}",
            "/sports",
            "/competitions",
            "/bets (requires auth)",
            "/auth/login",
            "/auth/logout"
        ]
    })

# Importar y registrar blueprints
from routes.events import events_bp
from routes.bets import bets_bp
from routes.auth import auth_bp
from routes.simulation import simulation_bp

# Registrar blueprints
app.register_blueprint(events_bp, url_prefix='/events')
app.register_blueprint(bets_bp, url_prefix='/bets')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(simulation_bp, url_prefix='/simulation')

# Ruta para listar deportes
from models.sport import Sport
@app.route('/sports', methods=['GET'])
def get_sports_list():
    sports = Sport.get_all()
    return jsonify({"sports": sports})

# Ruta para listar competiciones
from models.competition import Competition
@app.route('/competitions', methods=['GET'])
def get_competitions_list():
    sport_id = request.args.get('sport_id')
    competitions = Competition.get_all(sport_id)
    return jsonify({"competitions": competitions})

# Ruta de estado/salud para monitoreo
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "database": os.path.exists(DB_PATH),
        "timestamp": datetime.datetime.now().isoformat()
    })

# Manejadores de errores
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal server error"}), 500

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"error": "Method not allowed"}), 405

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({"error": "Unauthorized access"}), 401

# Ejecutar la aplicación
if __name__ == '__main__':
    # Obtener puerto del entorno (necesario para Render)
    port = int(os.environ.get("PORT", 5000))
    
    # Iniciar el servidor
    print(f"Starting World Bet Mini App API in {'production' if is_production else 'development'} mode...")
    print(f"Database path: {DB_PATH}")
    print(f"Server running at http://0.0.0.0:{port}")
    
    app.run(debug=not is_production, host='0.0.0.0', port=port)