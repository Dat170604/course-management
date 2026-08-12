from pydantic import BaseModel

from app.schemas.course import CourseResponse

class EnrollmentResponse(BaseModel):
    id: int
    student_id: int
    course_id: int

    class Config:
        from_attributes = True

class EnrollmentCourseResponse(BaseModel):
    id: int
    course: CourseResponse

    class Config:
        from_attributes = True