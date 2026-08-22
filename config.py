import os
from dotenv import load_dotenv

load_dotenv()

# MySQL Database Configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "cs2_weaponpaints")

# Steam Web API Key & URLs
# Obtenha sua chave gratuita em: https://steamcommunity.com/dev/apikey
STEAM_API_KEY = os.getenv("STEAM_API_KEY", "")
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Security / JWT Secret Key
JWT_SECRET = os.getenv("JWT_SECRET", "change-this-to-a-secure-random-secret-key")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30
