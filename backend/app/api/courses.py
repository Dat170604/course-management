from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db, require_teacher
from app.models.user import User
from app.schemas.course import (
    CourseCreate,
    CourseListResponse,
    CourseResponse,
    CourseUpdate,
    TeacherCourseResponse,
)
from app.schemas.user import UserResponse
from app.services.course_service import (
    create_course,
    delete_course,
    get_course_by_id,
    get_courses,
    get_my_courses,
    get_teacher_dashboard,
    update_course,
)
from app.services.enrollment_service import get_course_students

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("", response_model=CourseListResponse)
def get_all_courses(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query(None),
    min_price: float = Query(None, ge=0),
    max_price: float = Query(None, ge=0),
    teacher_id: int = Query(None, ge=1),
    sort: str = Query(None),
):
    return get_courses(db, page, limit, search, min_price, max_price, teacher_id, sort)


@router.post("", response_model=CourseResponse)
def create(
    course: CourseCreate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
):
    return create_course(course, current_user, db)


@router.get("/my", response_model=list[CourseResponse])
def my_courses(
    current_user: User = Depends(require_teacher), db: Session = Depends(get_db)
):
    return get_my_courses(current_user, db)


@router.get("/dashboard", response_model=list[TeacherCourseResponse])
def teacher_dashboard(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query(None),
):
    return get_teacher_dashboard(current_user, db, page, limit, search)


@router.get("/{course_id}/students", response_model=list[UserResponse])
def get_students(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_course_students(course_id, current_user, db)


@router.get("/{course_id}", response_model=CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db)):
    return get_course_by_id(course_id, db)


@router.put("/{course_id}", response_model=CourseResponse)
def update_course_api(
    course_id: int,
    course_data: CourseUpdate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
):
    return update_course(course_id, course_data, current_user, db)


@router.delete("/{course_id}")
def delete_course_api(
    course_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db),
):
    return delete_course(course_id, current_user, db)
