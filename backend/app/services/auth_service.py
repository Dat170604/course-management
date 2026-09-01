from fastapi import HTTPException
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from app.models.user import User
from app.redis import redis_client


def login_user(email: str, password: str, db: Session):
    cache_key = f"login_attempt:{email}"

    attempts = redis_client.get(cache_key)

    if attempts and int(attempts) >= 5:
        raise HTTPException(
            status_code=429, detail="Too many login attempts. Try again later."
        )

    attempts = redis_client.incr(cache_key)
    if attempts == 1:
        redis_client.expire(cache_key, 60)

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không đúng")

    if not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không đúng")

    access_token = create_access_token(data={"sub": user.email})

    refresh_token = create_refresh_token(data={"sub": user.email})

    redis_client.delete(cache_key)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


def refresh_access_token(refresh_token: str):

    try:
        payload = decode_token(refresh_token)

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    jti = payload.get("jti")
    cache_key = f"revoked:refresh:{jti}"
    if redis_client.exists(cache_key):
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")

    email = payload.get("sub")

    if not email:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    access_token = create_access_token({"sub": email})

    return {"access_token": access_token, "token_type": "bearer"}


def logout(refresh_token: str):

    try:
        payload = decode_token(refresh_token)

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    jti = payload.get("jti")

    if not jti:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    cache_key = f"revoked:refresh:{jti}"

    redis_client.set(cache_key, "1", ex=7 * 24 * 60 * 60)

    return {"message": "Logout successful"}
