from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, require_teacher

from app.models.user import User

from app.schemas.course import CourseCreate, CourseResponse, CourseUpdate

from app.services.course_service import create_course, get_courses, get_course_by_id, update_course, delete_course


router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)

@router.post(
    "",
    response_model=CourseResponse
)
def create(
    course: CourseCreate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    return create_course(
        course,
        current_user,
        db
    )

@router.get(
    "",
    response_model=list[CourseResponse]
)
def get_all_courses(
    db: Session = Depends(get_db)
):
    return get_courses(db)

@router.get(
    "/{course_id}",
    response_model=CourseResponse
)
def get_course(
    course_id: int,
    db: Session = Depends(get_db)
):
    return get_course_by_id(
        course_id,
        db
    )

@router.put(
    "/{course_id}",
    response_model=CourseResponse
)
def update_course_api(
    course_id: int,
    course_data: CourseUpdate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    return update_course(
        course_id,
        course_data,
        current_user,
        db
    )

@router.delete(
    "/{course_id}"
)
def delete_course(
    course_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    return delete_course(
        course_id,
        current_user,
        db
    )