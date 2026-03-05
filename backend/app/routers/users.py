from fastapi import APIRouter
router = APIRouter(prefix="/api/users", tags=["Users"])
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..utils.auth import get_current_user
from ..models.user import User as UserModel
from ..schemas.user import User as UserSchema, UserUpdate

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/me", response_model=UserSchema)
async def get_me(current_user: UserModel = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserSchema)
async def update_me(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)
    return current_user
