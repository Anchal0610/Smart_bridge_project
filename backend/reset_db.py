import os
from app.database import engine, Base
from app.models.user import User
from app.models.fitness import WorkoutPlan, Exercise, NutritionPlan, MealRecord, HealthAssessment, ExerciseLibrary
from create_dummy_user import create_dummy_user
from seed_library import seed_exercise_library

def reset_database():
    db_path = "arogyamitra.db"
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Deleted {db_path}")

    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)

    print("Creating dummy user...")
    create_dummy_user()

    print("Seeding exercise library...")
    seed_exercise_library()

    print("Database reset and seeded successfully!")

if __name__ == "__main__":
    reset_database()
