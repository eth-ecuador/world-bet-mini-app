# wsgi.py
import sys
import os
from pathlib import Path

# Añade el directorio del proyecto al path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Importar la aplicación Flask
from backend.app import app

if __name__ == "__main__":
    app.run()