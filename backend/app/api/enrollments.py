from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.enrollment import EnrollmentCourseResponse, EnrollmentResponse
from app.services.enrollment_service import (
    cancel_enrollment,
    enroll_course,
    get_my_enrollments,
)

router = APIRouter(prefix="/enrollments", tags=["Enrollments"])


@router.get("/me", response_model=list[EnrollmentCourseResponse])
def get_my_enrollments_api(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return get_my_enrollments(current_user, db)


@router.post("/{course_id}", response_model=EnrollmentResponse)
def enroll(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return enroll_course(course_id, current_user, db)


@router.delete("/{course_id}")
def cancel_enrollment_api(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return cancel_enrollment(course_id, current_user, db)
