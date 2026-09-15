from fastapi import HTTPException

from app.core.security import hash_password
from app.exception.user import UserNotFoundException
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


def get_user(current_user, db):

    students = db.query(User).filter(User.role == UserRole.STUDENT)

    teachers = db.query(User).filter(User.role == UserRole.TEACHER)

    return {"students": students, "teachers": teachers}


def delete_user(user_id, current_user, db):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise UserNotFoundException()

    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot delete yourself")

    db.delete(user)
    db.commit()

    return {"message": "Deleted user successfully"}


def upgrade_role(user_id, role, current_user, db):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise UserNotFoundException()

    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot upgrade yourself")

    user.role = role

    db.commit()
    db.refresh(user)

    return {
        "message": "User role updated successfully",
        "user_id": user.id,
        "username": user.username,
        "role": user.role,
    }
