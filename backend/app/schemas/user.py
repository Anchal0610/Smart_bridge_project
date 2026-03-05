from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import enum

class FitnessLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class FitnessGoal(str, enum.Enum):
    WEIGHT_LOSS = "weight_loss"
    MUSCLE_GAIN = "muscle_gain"
    MAINTENANCE = "maintenance"
    ATHLETIC_PERFORMANCE = "athletic_performance"

class WorkoutPreference(str, enum.Enum):
    HOME = "home"
    GYM = "gym"
    OUTDOOR = "outdoor"

class DietPreference(str, enum.Enum):
    VEGETARIAN = "vegetarian"
    NON_VEGETARIAN = "non_vegetarian"
    VEGAN = "vegan"
    PESCATARIAN = "pescatarian"
    KETO = "keto"

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str

class UserCreate(UserBase):
    password: str
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    fitness_level: Optional[FitnessLevel] = FitnessLevel.BEGINNER
    fitness_goal: Optional[FitnessGoal] = FitnessGoal.MAINTENANCE
    workout_preference: Optional[WorkoutPreference] = WorkoutPreference.HOME
    muscle_split: Optional[int] = 1 # 1 or 2 muscles per day
    diet_preference: Optional[DietPreference] = DietPreference.VEGETARIAN

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    fitness_level: Optional[FitnessLevel] = None
    fitness_goal: Optional[FitnessGoal] = None
    workout_preference: Optional[WorkoutPreference] = None
    muscle_split: Optional[int] = None
    diet_preference: Optional[DietPreference] = None

class User(UserBase):
    id: int
    is_active: bool
    muscle_split: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    username: Optional[str] = None

class UserLogin(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: str


class PasswordResetRequest(BaseModel):
    """Step 1: User provides their email to initiate a password reset."""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Step 2: User provides the token they received + their new password."""
    token: str
    new_password: str = Field(..., min_length=8, description="New password (minimum 8 characters)")


class PasswordChangeResponse(BaseModel):
    """Standard success response for password-related operations."""
    message: str
