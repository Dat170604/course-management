from fastapi import HTTPException

from app.core.security import hash_password
from app.models.enums import UserRole
from app.models.user import User


def create_teacher(teacher_data, db):
    existing_user = db.query(User).filter(User.email == teacher_data.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    teacher = User(
        username=teacher_data.username,
        email=teacher_data.email,
        password=hash_password(teacher_data.password),
        role=UserRole.TEACHER,
    )

    db.add(teacher)
    db.commit()
    db.refresh(teacher)

    return teacher
