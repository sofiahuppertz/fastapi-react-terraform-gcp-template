import os
from dotenv import load_dotenv

load_dotenv()

# Simple configuration - just get what you need
DB_URL = os.getenv("DB_URL", "postgresql://user:password@localhost/dbname")

# API Configuration
API_VERSION = os.getenv("API_VERSION", "1.0.0")
SERVICE_NAME = os.getenv("SERVICE_NAME", "backend-api")

