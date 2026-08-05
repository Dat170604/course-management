from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import user
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.auth import hash_password


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()



@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    
    hashed_password = hash_password(
        user.password
    )
    

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Email đã tồn tại")


    return new_user

