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

@router.get("/targets")
async def get_nutrition_targets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.weight or not current_user.height:
        raise HTTPException(status_code=400, detail="User profile incomplete for nutrition calculation")

    return await NutritionService.calculate_daily_targets(
        current_user.id,
        current_user.weight,
        current_user.height,
        current_user.age or 30,
        current_user.gender or "male",
        current_user.fitness_goal or "maintenance"
    )

@router.get("/recipes/search")
async def search_recipes(
    query: str = Query(...),
    current_user: User = Depends(get_current_user)
):
    return await NutritionService.search_recipes(query, current_user.diet_preference)

@router.post("/log", response_model=MealRecord)
async def log_meal(
    meal: MealRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await NutritionService.log_meal(db, current_user.id, meal)
