from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_admin
from app.models.user import User
from app.schemas.dashboard import (
    AdminDashboardResponse,
    AdminGetCourseResponse,
    AdminGetUserResponse,
)
from app.services.dashboard_service import get_admin_dashboard, get_course, get_user, delete_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/admin", response_model=AdminDashboardResponse)
def admin_dashboard(
    current_user: User = Depends(require_admin), db: Session = Depends(get_db)
):
    return get_admin_dashboard(current_user, db)


@router.get("/admin/users", response_model=AdminGetUserResponse)
def admin_users(
    current_user: User = Depends(require_admin), db: Session = Depends(get_db)
):
    return get_user(current_user, db)


@router.delete("/admin/users/{user_id}")
def admin_delete_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return delete_user(user_id, current_user, db)