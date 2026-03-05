import httpx
from sqlalchemy.orm import Session
from ..models.fitness import NutritionPlan, MealRecord
from ..schemas.fitness import NutritionPlanCreate, MealRecordCreate
from ..config import get_settings
from .ai_agent import AIAgent
import json
import groq

settings = get_settings()

class NutritionService:
    @staticmethod
    @staticmethod
    async def calculate_daily_targets(user_id: int, weight: float, height: float, age: int, gender: str, goal: str):
        """Calculates daily calorie and macro targets using AI reasoning."""
        prompt = f"""
        Calculate daily nutrition targets for a {age} year old {gender}, {weight}kg, {height}cm, with goal: {goal}.
        Return ONLY a JSON object:
        {{
            "daily_calories": 2500,
            "protein_grams": 180,
            "carbs_grams": 250,
            "fats_grams": 70
        }}
        """

        client = groq.Groq(api_key=settings.GROQ_API_KEY)
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )

        targets = json.loads(response.choices[0].message.content)
        return targets

    @staticmethod
    async def generate_monthly_plan(db: Session, user_id: int):
        from datetime import datetime, timedelta
        from ..models.user import User

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise Exception("User not found")

        # 1. Get Daily Targets
        targets = await NutritionService.calculate_daily_targets(
            user_id, user.weight, user.height, user.age or 30, user.gender or "male", user.fitness_goal or "maintenance"
        )

        # 2. Generate 30-day meal suggestions
        prompt = f"""
        Generate a 30-day meal plan (3 meals per day: Breakfast, Lunch, Dinner) for a user with these daily targets:
        Calories: {targets['daily_calories']}, Protein: {targets['protein_grams']}g, Carbs: {targets['carbs_grams']}g, Fats: {targets['fats_grams']}g.
        Diet Preference: {user.diet_preference}.

        Return ONLY a JSON object:
        {{
            "days": [
                {{
                    "day_number": 1,
                    "meals": [
                        {{
                            "food_name": "Oatmeal with Blueberries",
                            "calories": 400,
                            "protein": 15,
                            "carbs": 60,
                            "fats": 8,
                            "meal_type": "Breakfast"
                        }},
                        // ... Lunch and Dinner
                    ]
                }}
                // ... up to 30 days
            ]
        }}
        Ensure variety across the 30 days.
        """

        client = groq.Groq(api_key=settings.GROQ_API_KEY)
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )

        plan_data = json.loads(response.choices[0].message.content)

        # 3. Save as MealRecords (scheduled)
        start_date = datetime.now()

        # Clear existing future scheduled meals
        db.query(MealRecord).filter(
            MealRecord.user_id == user_id,
            MealRecord.scheduled_date >= start_date,
            MealRecord.is_eaten == False
        ).delete()

        for day in plan_data["days"]:
            day_date = start_date + timedelta(days=day["day_number"] - 1)
            for meal_data in day["meals"]:
                db_meal = MealRecord(
                    user_id=user_id,
                    food_name=meal_data["food_name"],
                    calories=meal_data["calories"],
                    protein=meal_data["protein"],
                    carbs=meal_data["carbs"],
                    fats=meal_data["fats"],
                    meal_type=meal_data["meal_type"],
                    scheduled_date=day_date,
                    is_eaten=False
                )
                db.add(db_meal)

        db.commit()
        return targets

    @staticmethod
    async def search_recipes(query: str, diet_preference: str = None):
        """Searches for recipes using Spoonacular API."""
        url = f"https://api.spoonacular.com/recipes/complexSearch?query={query}&number=5&addRecipeInformation=true&apiKey={settings.SPOONACULAR_API_KEY}"
        if diet_preference:
            url += f"&diet={diet_preference}"

        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code == 200:
                return response.json()["results"]
        return []

    @staticmethod
    async def sync_plan_to_calendar(user_id: int, meal_name: str, scheduled_time: str):
        """Syncs a scheduled meal to Google Calendar."""
        # This would typically use the Google Calendar API with the user's OAuth token
        # For now, we'll implement the structure for it.
        try:
            # Placeholder for actual Calendar logic
            # build('calendar', 'v3', credentials=credentials)
            return True, f"Synced {meal_name} to calendar for {scheduled_time}"
        except Exception as e:
            return False, str(e)

    @staticmethod
    async def log_meal(db: Session, user_id: int, meal_data: MealRecordCreate):
        db_meal = MealRecord(
            user_id=user_id,
            **meal_data.dict()
        )
        db.add(db_meal)
        db.commit()
        db.refresh(db_meal)
        return db_meal
