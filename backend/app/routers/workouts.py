from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..utils.auth import get_current_user
from ..models.user import User
from ..schemas.fitness import WorkoutPlan, WorkoutPlanCreate, Exercise, ExerciseLibrary
from ..models.fitness import ExerciseLibrary as LibraryModel
from ..services.workout_service import WorkoutService

router = APIRouter(
    prefix="/api/workouts",
    tags=["Workouts"]
)

@router.get("/library", response_model=List[ExerciseLibrary])
async def get_exercise_library(
    muscle_group: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(LibraryModel)
    if muscle_group:
        query = query.filter(LibraryModel.muscle_group == muscle_group)
    return query.all()

@router.get("/library/{exercise_name}", response_model=ExerciseLibrary)
async def get_library_exercise(
    exercise_name: str,
    db: Session = Depends(get_db)
):
    exercise = db.query(LibraryModel).filter(LibraryModel.name == exercise_name).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found in library")
    return exercise

@router.get("/plans", response_model=List[WorkoutPlan])
async def get_workout_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..models.fitness import WorkoutPlan as WorkoutModel
    return db.query(WorkoutModel).filter(WorkoutModel.user_id == current_user.id).all()

@router.post("/generate", response_model=WorkoutPlan)
async def generate_plan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await WorkoutService.generate_workout_plan(db, current_user.id)

@router.patch("/exercises/{exercise_id}/complete", response_model=Exercise)
async def complete_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..models.fitness import Exercise as ExerciseModel, WorkoutPlan as PlanModel
    from datetime import datetime

    exercise = db.query(ExerciseModel).join(PlanModel).filter(
        ExerciseModel.id == exercise_id,
        PlanModel.user_id == current_user.id
    ).first()

    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    # Prevent marking future exercises as complete
    if exercise.scheduled_date and exercise.scheduled_date.date() > datetime.now().date():
        raise HTTPException(
            status_code=400,
            detail="Cannot mark future exercises as complete"
        )

    exercise.is_completed = True
    exercise.completed_at = datetime.now()
    db.commit()
    db.refresh(exercise)
    return exercise

@router.get("/plans/active", response_model=WorkoutPlan)
async def get_active_plan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..models.fitness import WorkoutPlan as WorkoutModel
    plan = db.query(WorkoutModel).filter(
        WorkoutModel.user_id == current_user.id,
        WorkoutModel.is_active == True
    ).first()
    if not plan:
        raise HTTPException(status_code=404, detail="No active plan found")
    return plan
