from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class WorkoutPlan(Base):
    __tablename__ = "workout_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    goal = Column(String)
    difficulty = Column(String)
    duration_weeks = Column(Integer, default=4)
    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="workout_plans")
    exercises = relationship("Exercise", back_populates="plan", cascade="all, delete-orphan")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("workout_plans.id"))
    name = Column(String, nullable=False)
    sets = Column(Integer)
    reps = Column(String) # For "10-12" or "Fail"
    rest_seconds = Column(Integer)
    instructions = Column(String)
    video_url = Column(String, nullable=True) # Linked to YouTube API
    category = Column(String) # Chest, Legs, etc.
    scheduled_date = Column(DateTime(timezone=True))
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    plan = relationship("WorkoutPlan", back_populates="exercises")

class NutritionPlan(Base):
    __tablename__ = "nutrition_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    daily_calories = Column(Integer)
    protein_grams = Column(Integer)
    carbs_grams = Column(Integer)
    fats_grams = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="nutrition_plans")

class MealRecord(Base):
    __tablename__ = "meal_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    food_name = Column(String, nullable=False)
    calories = Column(Integer)
    protein = Column(Float)
    carbs = Column(Float)
    fats = Column(Float)
    meal_type = Column(String) # Breakfast, Lunch, etc.
    scheduled_date = Column(DateTime(timezone=True))
    is_eaten = Column(Boolean, default=False)
    logged_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="meal_records")

class HealthAssessment(Base):
    __tablename__ = "health_assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    weight = Column(Float)
    height = Column(Float)
    energy_level = Column(Integer) # 1-10
    sleep_hours = Column(Float)
    notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="health_assessments")

class ExerciseLibrary(Base):
    __tablename__ = "exercise_library"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    muscle_group = Column(String, index=True)
    video_url = Column(String)
    thumbnail_url = Column(String, nullable=True)
    description = Column(String, nullable=True)
    difficulty = Column(String) # Beginner, Intermediate, etc.
    metadata_json = Column(JSON, nullable=True) # For additional YT metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
