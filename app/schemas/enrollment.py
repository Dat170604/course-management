from pydantic import BaseModel, ConfigDict

from app.schemas.course import CourseResponse

class EnrollmentResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    model_config = ConfigDict(from_attributes=True)

class EnrollmentCourseResponse(BaseModel):
    id: int
    course: CourseResponse
    model_config = ConfigDict(from_attributes=True)