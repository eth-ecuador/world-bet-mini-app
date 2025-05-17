from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config

# Crear la aplicación Flask
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Ruta de inicio para verificación rápida
@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "World Bet Mini App API",
        "status": "running",
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

# Importar blueprints
from routes.events import events_bp
from routes.bets import bets_bp
from routes.auth import auth_bp

# Registrar blueprints
app.register_blueprint(events_bp, url_prefix='/events')
app.register_blueprint(bets_bp, url_prefix='/bets')
app.register_blueprint(auth_bp, url_prefix='/auth')

# Ruta para listar deportes
from utils.mock_data import get_sports
@app.route('/sports', methods=['GET'])
def get_sports_list():
    return jsonify({"sports": get_sports()})

# Ruta para listar competiciones
from utils.mock_data import get_competitions
@app.route('/competitions', methods=['GET'])
def get_competitions_list():
    sport_id = request.args.get('sport_id')
    return jsonify({"competitions": get_competitions(sport_id)})

# Manejadores de errores
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal server error"}), 500

# Ejecutar la aplicación
if __name__ == '__main__':
    print("Starting World Bet Mini App API...")
    print("Server running at http://localhost:5000")
    app.run(debug=app.config.get('DEBUG', True), host='0.0.0.0', port=5000)