import os
from dotenv import load_dotenv
from pathlib import Path

# Cargar variables de entorno si existe un archivo .env
load_dotenv()

# Rutas de directorios
BASE_DIR = Path(__file__).resolve().parent
DATABASE_DIR = BASE_DIR / 'database'
DATABASE_DIR.mkdir(exist_ok=True)
DATABASE_PATH = DATABASE_DIR / 'worldbet.db'

class Config:
    """Configuración global de la aplicación."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    DEBUG = os.getenv('DEBUG', 'True') == 'True'
    ENV = os.getenv('FLASK_ENV', 'development')
    DATABASE_URI = str(DATABASE_PATH)