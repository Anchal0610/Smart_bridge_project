from fastapi import APIRouter
router = APIRouter(prefix="/api/chat", tags=["Chat"])
@router.get("/")
async def get_chat(): return {"message": "Chat stub"}
