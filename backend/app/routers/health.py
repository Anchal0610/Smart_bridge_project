from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..utils.auth import get_current_user
from ..models.user import User
from ..schemas.fitness import HealthAssessment, HealthAssessmentCreate
from ..services.health_service import HealthService

router = APIRouter(
    prefix="/api/health",
    tags=["Health"]
)

@router.post("/assessment", response_model=HealthAssessment)
async def submit_assessment(
    assessment: HealthAssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await HealthService.create_assessment(db, current_user.id, assessment)

@router.get("/trends")
async def get_trends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await HealthService.get_health_trends(db, current_user.id)
