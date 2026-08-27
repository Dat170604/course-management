from sqlalchemy.orm import Session

from fastapi import HTTPException

from app.models.user import User

from app.core.security import (
    verify_password,
    create_access_token,
)

from app.redis import redis_client

def login_user(
    email: str,
    password: str,
    db: Session
):
    cache_key = f"login_attempt:{email}"

    attempts = redis_client.get(cache_key)

    if attempts and int(attempts) >= 5:
        raise HTTPException(
            status_code=429,
            detail="Too many login attempts. Try again later."
        )

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

    try:
        access_token = create_access_token(
            data={"sub": user.email}
        )

        redis_client.delete(cache_key)

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    except:
        attempts = redis_client.incr(cache_key)

        if attempts == 1:
            redis_client.expire(cache_key, 60)