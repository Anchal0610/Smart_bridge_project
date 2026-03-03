from fastapi import APIRouter
router = APIRouter(prefix="/api/nutrition", tags=["Nutrition"])
@router.get("/")
async def get_nutrition(): return {"message": "Nutrition stub"}
