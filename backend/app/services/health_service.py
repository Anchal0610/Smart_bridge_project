from sqlalchemy.orm import Session
from ..models.fitness import HealthAssessment
from ..schemas.fitness import HealthAssessmentCreate
from .ai_agent import AIAgent
import groq
import json
from ..config import get_settings

settings = get_settings()

class HealthService:
    @staticmethod
    async def create_assessment(db: Session, user_id: int, assessment: HealthAssessmentCreate):
        db_assessment = HealthAssessment(
            user_id=user_id,
            **assessment.dict()
        )
        db.add(db_assessment)
        db.commit()
        db.refresh(db_assessment)
        return db_assessment

    @staticmethod
    async def get_health_trends(db: Session, user_id: int):
        assessments = db.query(HealthAssessment).filter(HealthAssessment.user_id == user_id).order_by(HealthAssessment.created_at.desc()).limit(5).all()

        if not assessments:
            return {"status": "no_data", "message": "Start your first assessment to see trends!"}

        # AI analysis of trends
        history = [{"weight": a.weight, "energy": a.energy_level, "date": a.created_at.isoformat()} for a in assessments]

        prompt = f"""
        Analyze these 5 recent health assessments and provide a 1-sentence trend summary:
        {json.dumps(history)}
        """

        client = groq.Groq(api_key=settings.GROQ_API_KEY)
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            max_tokens=100
        )

        return {
            "history": history,
            "ai_analysis": response.choices[0].message.content.strip()
        }
