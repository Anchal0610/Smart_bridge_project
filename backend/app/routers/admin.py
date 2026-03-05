from fastapi import APIRouter, Depends
from ..services.ai_agent import AIAgent
from ..utils.auth import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/diagnose/groq")
async def diagnose_groq(_: User = Depends(get_current_user)):
    success, message = await AIAgent.verify_groq()
    return {"success": success, "message": message}

@router.get("/diagnose/gemini")
async def diagnose_gemini(_: User = Depends(get_current_user)):
    success, message = await AIAgent.verify_gemini()
    return {"success": success, "message": message}

@router.get("/diagnose/youtube")
async def diagnose_youtube(_: User = Depends(get_current_user)):
    success, message = await AIAgent.verify_youtube()
    return {"success": success, "message": message}

@router.get("/diagnose/spoonacular")
async def diagnose_spoonacular(_: User = Depends(get_current_user)):
    success, message = await AIAgent.verify_spoonacular()
    return {"success": success, "message": message}

@router.get("/diagnose/openai")
async def diagnose_openai(_: User = Depends(get_current_user)):
    success, message = await AIAgent.verify_openai()
    return {"success": success, "message": message}

@router.get("/diagnose/calendar")
async def diagnose_calendar(_: User = Depends(get_current_user)):
    success, message = await AIAgent.verify_calendar()
    return {"success": success, "message": message}

@router.get("/diagnose/db")
async def diagnose_db(_: User = Depends(get_current_user)):
    # If the user reached here, the DB is working (auth depends on it)
    return {"success": True, "message": "Database connection healthy"}
