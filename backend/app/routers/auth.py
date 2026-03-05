import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
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
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=schemas.User)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    """Protected route — returns the currently authenticated user's profile."""
    return current_user


# ─── PASSWORD RESET: STEP 1 ────────────────────────────────────────────────────

@router.post("/password-reset/request", response_model=schemas.PasswordChangeResponse)
def request_password_reset(
    body: schemas.PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """
    Accepts an email address. If a matching user exists, generates a secure
    6-hour reset token and stores a HASH of it in the database.

    NOTE: Always returns 200 OK regardless of whether the email exists —
    this prevents user enumeration attacks.
    In production, replace the response body with an actual email send.
    """
    user = db.query(models.User).filter(models.User.email == body.email).first()

    # Always return a success-looking message to prevent email enumeration
    if not user:
        return {"message": "If that email is registered, a reset link has been sent."}

    # Generate a cryptographically secure random token (URL-safe, 32 bytes)
    raw_token = secrets.token_urlsafe(32)

    # Store the HASH (never store raw tokens in the DB)
    user.password_reset_token = auth.get_password_hash(raw_token)
    user.password_reset_expires = datetime.now(timezone.utc) + timedelta(hours=6)

    db.commit()

    # TODO: Replace with actual email delivery (e.g., SendGrid / SMTP)
    # Returning token in response for development/testing only
    return {"message": f"[DEV] Password reset token: {raw_token}"}


# ─── PASSWORD RESET: STEP 2 ────────────────────────────────────────────────────

@router.post("/password-reset/confirm", response_model=schemas.PasswordChangeResponse)
def confirm_password_reset(
    body: schemas.PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    """
    Accepts the raw reset token + new password.
    Verifies the token against the stored hash and ensures it hasn't expired.
    On success, updates the password and clears the reset token from the DB.
    """
    # Fetch all users with a non-expired reset token
    users_with_token = db.query(models.User).filter(
        models.User.password_reset_token != None,
        models.User.password_reset_expires > datetime.now(timezone.utc)
    ).all()

    # Find the one whose stored hash matches the provided raw token
    matched_user = None
    for u in users_with_token:
        if auth.verify_password(body.token, u.password_reset_token):
            matched_user = u
            break

    if not matched_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset token."
        )

    # Set new password and clear the reset token fields
    matched_user.hashed_password = auth.get_password_hash(body.new_password)
    matched_user.password_reset_token = None
    matched_user.password_reset_expires = None

    db.commit()
    return {"message": "Password reset successfully. Please log in with your new password."}
