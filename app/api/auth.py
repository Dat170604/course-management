from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.user import (
    AccessTokenResponse,
    LoginRequest,
    RefreshTokenRequest,
    TokenResponse,
    UserCreate,
    UserResponse,
)
from app.services.auth_service import login_user, logout, refresh_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, email=user.email, password=hashed_password)
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email đã tồn tại")
    return new_user


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    return login_user(request.email, request.password, db)


@router.post("/logout")
def logout_api(data: RefreshTokenRequest):
    return logout(data.refresh_token)


@router.post("/token", response_model=TokenResponse)
def token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    return login_user(form_data.username, form_data.password, db)


@router.post("/refresh", response_model=AccessTokenResponse)
def refresh_token(data: RefreshTokenRequest):
    return refresh_access_token(data.refresh_token)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
