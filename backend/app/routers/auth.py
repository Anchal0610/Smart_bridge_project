from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from ..database import get_db
from ..models import user as models
from ..schemas import user as schemas
from ..utils import auth
from ..config import get_settings

settings = get_settings()
router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.User)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user_email = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user_username = db.query(models.User).filter(models.User.username == user_in.username).first()
    if db_user_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = auth.get_password_hash(user_in.password)
    db_user = models.User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        age=user_in.age,
        gender=user_in.gender,
        height=user_in.height,
        weight=user_in.weight,
        fitness_level=user_in.fitness_level,
        fitness_goal=user_in.fitness_goal,
        workout_preference=user_in.workout_preference,
        diet_preference=user_in.diet_preference
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=schemas.Token)
def login(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = None
    if user_in.email:
        user = db.query(models.User).filter(models.User.email == user_in.email).first()
    elif user_in.username:
        user = db.query(models.User).filter(models.User.username == user_in.username).first()

    if not user or not auth.verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
