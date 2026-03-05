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
    async def generate_workout_plan(db: Session, user_id: int, goal: str, fitness_level: str):
        # 1. AI Generation via Groq
        prompt = f"""
        Generate a comprehensive 4-week workout plan for a {fitness_level} focus on {goal}.
        Return ONLY a JSON object with this structure:
        {{
            "name": "Plan Name",
            "description": "Short description",
            "exercises": [
                {{
                    "name": "Exercise Name",
                    "sets": 3,
                    "reps": "12",
                    "rest_seconds": 60,
                    "instructions": "How to perform",
                    "category": "Muscle Group"
                }}
            ]
        }}
        """

        client = groq.Groq(api_key=settings.GROQ_API_KEY)
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )

        plan_data = json.loads(response.choices[0].message.content)

        # 2. Create the Plan in DB
        db_plan = WorkoutPlan(
            user_id=user_id,
            name=plan_data["name"],
            goal=goal,
            difficulty=fitness_level
        )
        db.add(db_plan)
        db.commit()
        db.refresh(db_plan)

        # 3. Process Exercises + YouTube Sync
        for ex_data in plan_data["exercises"]:
            # Sync with YouTube for instructional video
            video_url = await WorkoutService._get_exercise_video(ex_data["name"])

            db_exercise = Exercise(
                plan_id=db_plan.id,
                name=ex_data["name"],
                sets=ex_data["sets"],
                reps=str(ex_data["reps"]),
                rest_seconds=ex_data["rest_seconds"],
                instructions=ex_data["instructions"],
                category=ex_data["category"],
                video_url=video_url
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
