import sqlite3
import os

db_path = "arogyamitra.db"

if not os.path.exists(db_path):
    print(f"Error: {db_path} not found.")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def add_columns_if_missing(table_name, new_columns):
    cursor.execute(f"PRAGMA table_info({table_name})")
    existing_columns = [row[1] for row in cursor.fetchall()]
    print(f"Checking table '{table_name}'...")

    for col_name, col_type in new_columns:
        if col_name not in existing_columns:
            print(f"  Adding column {col_name} to {table_name}...")
            try:
                cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {col_name} {col_type}")
                print(f"  Column {col_name} added successfully.")
            except Exception as e:
                print(f"  Error adding {col_name} to {table_name}: {e}")
        else:
            print(f"  Column {col_name} already exists in {table_name}.")

# Users table
add_columns_if_missing("users", [
    ("height", "REAL"),
    ("weight", "REAL"),
    ("fitness_level", "TEXT DEFAULT 'beginner'"),
    ("fitness_goal", "TEXT"),
    ("workout_preference", "TEXT DEFAULT 'GYM'"),
    ("muscle_split", "INTEGER DEFAULT 1"),
    ("diet_preference", "TEXT")
])

# Workout Plans table
add_columns_if_missing("workout_plans", [
    ("start_date", "TIMESTAMP"),
    ("end_date", "TIMESTAMP"),
    ("is_active", "BOOLEAN DEFAULT 1")
])

# Exercises table
add_columns_if_missing("exercises", [
    ("scheduled_date", "TIMESTAMP"),
    ("is_completed", "BOOLEAN DEFAULT 0"),
    ("completed_at", "TIMESTAMP")
])

# Meal Records table
add_columns_if_missing("meal_records", [
    ("scheduled_date", "TIMESTAMP"),
    ("is_eaten", "BOOLEAN DEFAULT 0")
])

# Create Exercise Library table if not exists
print("Ensuring 'exercise_library' table exists...")
cursor.execute("""
CREATE TABLE IF NOT EXISTS exercise_library (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    muscle_group TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    description TEXT,
    difficulty TEXT,
    metadata_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()
conn.close()
print("Migration completed.")
