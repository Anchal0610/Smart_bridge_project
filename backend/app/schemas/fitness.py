from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

# Exercise Schemas
class ExerciseBase(BaseModel):
    name: str
    sets: Optional[int] = None
    reps: Optional[str] = None
    rest_seconds: Optional[int] = None
    instructions: Optional[str] = None
    video_url: Optional[str] = None
    category: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    is_completed: bool = False
    completed_at: Optional[datetime] = None

class ExerciseCreate(ExerciseBase):
    pass

class Exercise(ExerciseBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    plan_id: int
    library_data: Optional['ExerciseLibrary'] = None

# Workout Plan Schemas
class WorkoutPlanBase(BaseModel):
    name: str
    goal: Optional[str] = None
    difficulty: Optional[str] = None
    duration_weeks: int = 4
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: bool = True

class WorkoutPlanCreate(WorkoutPlanBase):
    pass

class WorkoutPlan(WorkoutPlanBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    created_at: datetime
    exercises: List[Exercise] = []

# Nutrition Schemas
class NutritionPlanBase(BaseModel):
    daily_calories: int
    protein_grams: int
    carbs_grams: int
    fats_grams: int

class NutritionPlanCreate(NutritionPlanBase):
    pass

class NutritionPlan(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    created_at: datetime

# Meal Schemas
class MealRecordBase(BaseModel):
    food_name: str
    calories: int
    protein: float
    carbs: float
    fats: float
    meal_type: str
    scheduled_date: Optional[datetime] = None
    is_eaten: bool = False

class MealRecordCreate(MealRecordBase):
    pass

class MealRecord(MealRecordBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    logged_at: datetime

# Health Assessment Schemas
class HealthAssessmentBase(BaseModel):
    weight: float
    height: float
    energy_level: int
    sleep_hours: float
    notes: Optional[str] = None

class HealthAssessmentCreate(HealthAssessmentBase):
    pass

class HealthAssessment(HealthAssessmentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    created_at: datetime

class ExerciseLibrary(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    muscle_group: str
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    metadata_json: Optional[dict] = None
    created_at: datetime
