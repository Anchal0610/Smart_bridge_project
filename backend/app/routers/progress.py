from fastapi import APIRouter
router = APIRouter(prefix="/api/progress", tags=["Progress"])
@router.get("/")
async def get_progress(): return {"message": "Progress stub"}
