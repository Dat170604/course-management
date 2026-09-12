from pydantic import BaseModel

from app.schemas.course import CourseResponse
from app.schemas.user import UserResponse


class AdminDashboardResponse(BaseModel):
    total_students: int
    total_teachers: int
    total_courses: int
    total_enrollments: int


class AdminGetUserResponse(BaseModel):
    students: list[UserResponse]
    teachers: list[UserResponse]


class AdminGetCourseResponse(BaseModel):
    courses: list[CourseResponse]
