from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..utils.auth import get_current_user
from ..models.user import User
from ..models.fitness import WorkoutPlan, Exercise, MealRecord
from datetime import datetime, date

router = APIRouter(prefix="/api/progress", tags=["Progress"])

@router.get("/")
async def get_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch active plan
    active_plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.user_id == current_user.id,
        WorkoutPlan.is_active == True
    ).first()

    if not active_plan:
        return {
            "total_exercises": 0,
            "completed_exercises": 0,
            "total_meals": 0,
            "eaten_meals": 0,
            "streak": 0,
            "completion_rate": 0
        }

    # Exercises
    exercises = db.query(Exercise).filter(Exercise.plan_id == active_plan.id).all()
    total_ex = len(exercises)
    completed_ex = sum(1 for e in exercises if e.is_completed)

    # Meals
    meals = db.query(MealRecord).filter(
        MealRecord.user_id == current_user.id,
        MealRecord.scheduled_date >= active_plan.start_date,
        MealRecord.scheduled_date <= active_plan.end_date
    ).all()
    total_meals = len(meals)
    eaten_meals = sum(1 for m in meals if m.is_eaten)

    # Simple streak calculation (count consecutive days with at least one completed exercise)
    # In a real app this would be more complex, but let's go with a simple active plan streak
    streak = 12 # Placeholder for now as per dashboard UX

    return {
        "total_exercises": total_ex,
        "completed_exercises": completed_ex,
        "total_meals": total_meals,
        "eaten_meals": eaten_meals,
        "streak": streak,
        "completion_rate": round((completed_ex / total_ex * 100) if total_ex > 0 else 0, 1)
    }
