from sqlalchemy.orm import Session

from fastapi import HTTPException

from app.models.user import User

from app.core.security import (
    verify_password,
    create_access_token,
)

def login_user(
    email: str,
    password: str,
    db: Session
):
    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Email hoặc mật khẩu không đúng"
        )

    if not verify_password(
        password,
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Email hoặc mật khẩu không đúng"
        )

    access_token = create_access_token(
        data={"sub": user.email}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }