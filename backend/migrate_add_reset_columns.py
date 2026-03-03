"""
One-time migration script: Adds password_reset_token and password_reset_expires
columns to the users table. Safe to run multiple times (uses IF NOT EXISTS logic).
"""
import sys
import os

# Make sure we can import from the app package
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text
from app.config import get_settings

settings = get_settings()
engine = create_engine(settings.DATABASE_URL)

sql = """
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR,
    ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMPTZ;
"""

with engine.connect() as conn:
    conn.execute(text(sql))
    conn.commit()
    print("✅ Migration complete: password_reset_token and password_reset_expires columns added to users table.")
