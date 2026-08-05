from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models import user
from app.models.user import User

from app.schemas.user import LoginRequest, UserCreate, UserResponse

from app.core.security import hash_password

from app.services.auth_service import login_user

from app.dependencies import get_current_user

from app.dependencies import get_db

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

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

@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):  

    return login_user(
        request.email,
        request.password,
        db
    )

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user