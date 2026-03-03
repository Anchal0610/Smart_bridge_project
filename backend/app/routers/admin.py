from fastapi import APIRouter
router = APIRouter(prefix="/api/admin", tags=["Admin"])
@router.get("/")
async def get_admin(): return {"message": "Admin stub"}
