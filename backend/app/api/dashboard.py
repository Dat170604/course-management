from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_admin
from app.models.user import User
from app.schemas.dashboard import (
    AdminDashboardResponse,
)
from app.services.dashboard_service import get_admin_dashboard

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/admin", response_model=AdminDashboardResponse)
def admin_dashboard(
    current_user: User = Depends(require_admin), db: Session = Depends(get_db)
):
    return get_admin_dashboard(current_user, db)
