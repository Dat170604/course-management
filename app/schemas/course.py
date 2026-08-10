from pydantic import BaseModel


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

    class Config:
        from_attributes = True

class CourseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    price: float | None = None