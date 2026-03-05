import os
from app.config import get_settings
from app.database import engine

settings = get_settings()
print(f"DATABASE_URL from settings: {settings.DATABASE_URL}")
print(f"Engine URL: {engine.url}")

db_file = settings.DATABASE_URL.replace("sqlite:///./", "")
abs_path = os.path.abspath(os.path.join("app", "..", db_file))
print(f"Assumed absolute path: {abs_path}")
print(f"File exists at assumed path: {os.path.exists(abs_path)}")

import sqlite3
if os.path.exists(abs_path):
    conn = sqlite3.connect(abs_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(workout_plans)")
    cols = [row[1] for row in cursor.fetchall()]
    print(f"Columns in {abs_path}: {cols}")
    conn.close()
else:
    print("Could not find database file to check columns.")
