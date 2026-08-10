from fastapi import Depends, HTTPException

from jose import JWTError

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.user import User
from app.models.enums import UserRole

from app.core.security import (
    oauth2_scheme,
    decode_access_token
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = decode_access_token(token)
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
    email = payload.get("sub")
    user = db.query(User).filter(
        User.email == email
    ).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    return user

def require_teacher(
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.TEACHER,UserRole.ADMIN]:
        raise HTTPException(
            status_code=403,
            detail="Only teachers can perform this action"
        )

    return current_user