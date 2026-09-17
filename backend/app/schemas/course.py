from pydantic import BaseModel, ConfigDict


class CourseCreate(BaseModel):
    title: str
    description: str
    price: float


class CourseResponse(BaseModel):
    id: int
    title: str
    description: str
    price: float
    teacher_id: int
    model_config = ConfigDict(from_attributes=True)


class CourseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    price: float | None = None


class TeacherCourseResponse(BaseModel):
    id: int
    title: str
    description: str
    price: float
    teacher_name: str
    student_count: int
    model_config = ConfigDict(from_attributes=True)


class CourseListResponse(BaseModel):
    total: int
    total_pages: int
    page: int
    limit: int
    courses: list[TeacherCourseResponse]
