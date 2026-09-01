from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.user import TeacherCreate, UserResponse
from app.services.user_service import create_teacher

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
def get_users():
    return {"message": "Danh sách user"}


@router.post("/teachers", response_model=UserResponse)
def create_teacher_api(
    teacher_data: TeacherCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can create teachers")

    return create_teacher(teacher_data, db)
