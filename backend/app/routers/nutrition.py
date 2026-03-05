from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..utils.auth import get_current_user
from ..models.user import User
from ..schemas.fitness import NutritionPlan, MealRecord, MealRecordCreate
from ..services.nutrition_service import NutritionService

router = APIRouter(
    prefix="/api/nutrition",
    tags=["Nutrition"]
)

@router.post("/generate", response_model=dict)
async def generate_monthly_plan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await NutritionService.generate_monthly_plan(db, current_user.id)

@router.patch("/meals/{meal_id}/eat", response_model=MealRecord)
async def mark_meal_eaten(
    meal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..models.fitness import MealRecord as MealModel
    meal = db.query(MealModel).filter(
        MealModel.id == meal_id,
        MealModel.user_id == current_user.id
    ).first()

    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    meal.is_eaten = True
    db.commit()
    db.refresh(meal)
    return meal

@router.get("/current-plan")
async def get_current_nutrition_plan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..models.fitness import MealRecord as MealModel
    from datetime import datetime, timedelta

    # Get meals for the next 7 days or full month
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    meals = db.query(MealModel).filter(
        MealModel.user_id == current_user.id,
        MealModel.scheduled_date >= today
    ).order_by(MealModel.scheduled_date.asc()).all()

    return meals
