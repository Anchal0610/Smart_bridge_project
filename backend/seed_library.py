from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User # Added to resolve relationship mapping
from app.models.fitness import ExerciseLibrary
import json

def seed_exercise_library():
    db = SessionLocal()
    try:
        exercises = [
            # Chest
            {
                "name": "Flat Bench Press",
                "muscle_group": "Chest",
                "video_url": "https://www.youtube.com/watch?v=rT7DgCr-3pg",
                "difficulty": "Intermediate",
                "description": "A classic chest exercise that targets the pectoralis major."
            },
            {
                "name": "Incline Dumbbell Press",
                "muscle_group": "Chest",
                "video_url": "https://www.youtube.com/watch?v=0G2_XV7slIs",
                "difficulty": "Beginner",
                "description": "Targets the upper chest and shoulders."
            },
            {
                "name": "Pushups",
                "muscle_group": "Chest",
                "video_url": "https://www.youtube.com/watch?v=IODxDxX7oi4",
                "difficulty": "Beginner",
                "description": "Fundamental bodyweight exercise for chest and core."
            },
            # Back
            {
                "name": "Barbell Rows",
                "muscle_group": "Back",
                "video_url": "https://www.youtube.com/watch?v=9efgcAjQW7E",
                "difficulty": "Intermediate",
                "description": "Great for building thickness in the back."
            },
            {
                "name": "Pull-ups",
                "muscle_group": "Back",
                "video_url": "https://www.youtube.com/watch?v=eGo4IYlbE5g",
                "difficulty": "Intermediate",
                "description": "The gold standard for vertical pulling and back width."
            },
            {
                "name": "Lat Pulldowns",
                "muscle_group": "Back",
                "video_url": "https://www.youtube.com/watch?v=CAwf7n6Luuc",
                "difficulty": "Beginner",
                "description": "Targets the latissimus dorsi muscles."
            },
            # Shoulders
            {
                "name": "Overhead Press",
                "muscle_group": "Shoulders",
                "video_url": "https://www.youtube.com/watch?v=_RlRD5yKrH0",
                "difficulty": "Intermediate",
                "description": "Builds massive shoulder strength and stability."
            },
            {
                "name": "Lateral Raises",
                "muscle_group": "Shoulders",
                "video_url": "https://www.youtube.com/watch?v=PzsOxWzOkas",
                "difficulty": "Beginner",
                "description": "Specific horizontal move to target side delts."
            },
            # Legs
            {
                "name": "Squats",
                "muscle_group": "Legs",
                "video_url": "https://www.youtube.com/watch?v=gcNh17Ckjgg",
                "difficulty": "Beginner",
                "description": "The king of all leg exercises."
            },
            {
                "name": "Deadlifts",
                "muscle_group": "Legs",
                "video_url": "https://www.youtube.com/watch?v=op9kVnSso6Q",
                "difficulty": "Advanced",
                "description": "Total body power mover, focuses on posterior chain."
            },
            {
                "name": "Leg Press",
                "muscle_group": "Legs",
                "video_url": "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
                "difficulty": "Beginner",
                "description": "Great for targeting quads with lower back support."
            },
            # Arms
            {
                "name": "Bicep Curls",
                "muscle_group": "Biceps",
                "video_url": "https://www.youtube.com/watch?v=ykJmrZ5v0BA",
                "difficulty": "Beginner",
                "description": "Isolation exercise for the biceps brachii."
            },
            {
                "name": "Tricep Pushdowns",
                "muscle_group": "Triceps",
                "video_url": "https://www.youtube.com/watch?v=2-LAMcpzHLU",
                "difficulty": "Beginner",
                "description": "Effective for isolating the triceps using a cable machine."
            },
            {
                "name": "Skull Crushers",
                "muscle_group": "Triceps",
                "video_url": "https://www.youtube.com/watch?v=d_KZxPboQC0",
                "difficulty": "Intermediate",
                "description": "Powerful triceps builder using an EZ bar or dumbbells."
            }
        ]

        for ex_data in exercises:
            existing = db.query(ExerciseLibrary).filter(ExerciseLibrary.name == ex_data["name"]).first()
            if not existing:
                new_lib_ex = ExerciseLibrary(
                    name=ex_data["name"],
                    muscle_group=ex_data["muscle_group"],
                    video_url=ex_data["video_url"],
                    difficulty=ex_data["difficulty"],
                    description=ex_data["description"]
                )
                db.add(new_lib_ex)

        db.commit()
        print("Exercise library seeded successfully!")
    except Exception as e:
        print(f"Error seeding library: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_exercise_library()
