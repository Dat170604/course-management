from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.schemas.course import CourseCreate
from app.schemas.course import CourseResponse

from app.dependencies import get_db
from app.dependencies import get_current_user

from app.models.user import User

from app.services.course_service import create_course


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

    current_user: User = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    return create_course(

        course,

        current_user,

        db

    )