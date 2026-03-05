from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..utils.auth import get_current_user
from ..models.user import User
from ..schemas.fitness import WorkoutPlan, WorkoutPlanCreate
from ..services.workout_service import WorkoutService

router = APIRouter(
    prefix="/api/workouts",
    tags=["Workouts"]
)

@router.get("/plans", response_model=List[WorkoutPlan])
async def get_workout_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..models.fitness import WorkoutPlan as WorkoutModel
    return db.query(WorkoutModel).filter(WorkoutModel.user_id == current_user.id).all()

@router.post("/generate", response_model=WorkoutPlan)
async def generate_plan(
    goal: str = Query(...),
    fitness_level: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await WorkoutService.generate_workout_plan(db, current_user.id, goal, fitness_level)

@router.get("/plans/{plan_id}", response_model=WorkoutPlan)
async def get_plan_details(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..models.fitness import WorkoutPlan as WorkoutModel
    plan = db.query(WorkoutModel).filter(
        WorkoutModel.id == plan_id,
        WorkoutModel.user_id == current_user.id
    ).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan
