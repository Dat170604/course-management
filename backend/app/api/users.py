from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_admin
from app.models.user import User
from app.schemas.user import TeacherCreate, UpdateRoleRequest, UserResponse
from app.services.user_service import (
    create_teacher,
    delete_user,
    get_user,
    upgrade_role,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=list[UserResponse])
def get_users(
    current_user: User = Depends(require_admin), db: Session = Depends(get_db)
):
    return get_user(current_user, db)


@router.delete("/{user_id}")
def delete_users(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return delete_user(user_id, current_user, db)


@router.put("/{user_id}/role")
def upgrade_roles(
    user_id: int,
    role: UpdateRoleRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return upgrade_role(user_id, role, current_user, db)


@router.post("/teachers", response_model=UserResponse)
def create_teachers(
    teacher_data: TeacherCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return create_teacher(teacher_data, db)
