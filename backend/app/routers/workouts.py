from fastapi import APIRouter
router = APIRouter(prefix="/api/workouts", tags=["Workouts"])
@router.get("/")
async def get_workouts(): return {"message": "Workouts stub"}
