from fastapi import APIRouter
router = APIRouter(prefix="/api/aromi", tags=["AROMI AI Coach"])
@router.get("/")
async def get_coach(): return {"message": "AROMI AI Coach stub"}
