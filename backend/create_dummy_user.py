from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.utils.auth import get_password_hash

def create_dummy_user():
    db = SessionLocal()
    try:
        # Check if dummy user exists
        dummy = db.query(User).filter(User.username == "dummyuser").first()
        if dummy:
            print("Dummy user 'dummyuser' already exists.")
            return

        hashed_password = get_password_hash("password123")
        new_user = User(
            email="dummy@example.com",
            username="dummyuser",
            hashed_password=hashed_password,
            full_name="Dummy User",
            age=25,
            gender="male",
            height=180.0,
            weight=75.0,
            fitness_level="beginner",
            fitness_goal="muscle_gain",
            workout_preference="gym",
            muscle_split=1,
            diet_preference="non_vegetarian"
        )
        db.add(new_user)
        db.commit()
        print("Dummy user 'dummyuser' created successfully!")
        print("Username: dummyuser")
        print("Password: password123")
    except Exception as e:
        print(f"Error creating dummy user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_dummy_user()
