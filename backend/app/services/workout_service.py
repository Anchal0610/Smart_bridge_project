import json
from sqlalchemy.orm import Session
from .ai_agent import AIAgent
from ..models.fitness import WorkoutPlan, Exercise
from ..schemas.fitness import WorkoutPlanCreate
from ..config import get_settings
import groq

settings = get_settings()

class WorkoutService:
    @staticmethod
    @staticmethod
    async def generate_workout_plan(db: Session, user_id: int):
        from datetime import datetime, timedelta
        from ..models.user import User

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise Exception("User not found")

        # 1. AI Generation via Groq
        # We'll ask for a 30-day schedule. To keep JSON response manageable,
        # we'll ask for a weekly template and then expand it or ask for specific clusters.
        # However, for a high-end feel, we'll ask for 30 days of muscle groups and a pool of exercises.

        prompt = f"""
        Generate a comprehensive 30-day workout plan for a {user.fitness_level} focus on {user.fitness_goal}.
        User Preference: {user.workout_preference} (Home/Gym).
        Muscle Split: {user.muscle_split} muscle(s) per day.

        Return ONLY a JSON object with this structure:
        {{
            "name": "30-Day Elite Transformation",
            "description": "A tailor-made 30-day journey...",
            "daily_schedule": [
                {{
                    "day_number": 1,
                    "focus": "Chest & Triceps",
                    "exercises": [
                        {{
                            "name": "Bench Press",
                            "sets": 3,
                            "reps": "10-12",
                            "rest_seconds": 60,
                            "instructions": "...",
                            "category": "Chest"
                        }}
                    ]
                }}
                // ... up to 30 days
            ]
        }}
        Ensure each muscle group has at least 6 unique exercises distributed throughout the month.
        Include rest days where appropriate.
        """

        client = groq.Groq(api_key=settings.GROQ_API_KEY)
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )

        plan_data = json.loads(response.choices[0].message.content)

        # 2. Create the Plan in DB
        start_date = datetime.now()
        end_date = start_date + timedelta(days=30)

        db_plan = WorkoutPlan(
            user_id=user_id,
            name=plan_data["name"],
            goal=user.fitness_goal,
            difficulty=user.fitness_level,
            start_date=start_date,
            end_date=end_date,
            is_active=True
        )
        db.add(db_plan)
        # Deactivate old plans
        db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user_id, WorkoutPlan.id != db_plan.id).update({"is_active": False})

        db.commit()
        db.refresh(db_plan)

        # 3. Process Exercises + YouTube Sync
        from ..models.fitness import ExerciseLibrary as LibraryModel

        for day in plan_data["daily_schedule"]:
            day_date = start_date + timedelta(days=day["day_number"] - 1)
            for ex_data in day["exercises"]:
                # Check library first
                lib_ex = db.query(LibraryModel).filter(LibraryModel.name == ex_data["name"]).first()
                video_url = None

                if lib_ex:
                    video_url = lib_ex.video_url
                else:
                    # Fallback to YT Search
                    video_url = await WorkoutService._get_exercise_video(ex_data["name"])
                    # Optionally save to library for future use
                    if video_url:
                        new_lib_ex = LibraryModel(
                            name=ex_data["name"],
                            muscle_group=ex_data["category"],
                            video_url=video_url,
                            difficulty=user.fitness_level
                        )
                        db.add(new_lib_ex)
                        db.flush()

                db_exercise = Exercise(
                    plan_id=db_plan.id,
                    name=ex_data["name"],
                    sets=ex_data["sets"],
                    reps=str(ex_data["reps"]),
                    rest_seconds=ex_data["rest_seconds"],
                    instructions=ex_data["instructions"],
                    category=ex_data["category"],
                    video_url=video_url,
                    scheduled_date=day_date
                )
                db.add(db_exercise)

        db.commit()
        return db_plan

    @staticmethod
    async def _get_exercise_video(exercise_name: str):
        """Fetches a relevant YouTube video URL for the exercise."""
        try:
            from googleapiclient.discovery import build
            youtube = build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)

            search_query = f"{exercise_name} exercise form tutorial"
            request = youtube.search().list(
                part="snippet",
                q=search_query,
                maxResults=1,
                type="video",
                videoEmbeddable="true"
            )
            response = request.execute()

            if response["items"]:
                video_id = response["items"][0]["id"]["videoId"]
                return f"https://www.youtube.com/watch?v={video_id}"
        except Exception:
            return None
        return None
