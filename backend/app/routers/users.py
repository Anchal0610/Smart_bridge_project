from fastapi import APIRouter
router = APIRouter(prefix="/api/users", tags=["Users"])
@router.get("/")
async def get_users(): return {"message": "Users stub"}
