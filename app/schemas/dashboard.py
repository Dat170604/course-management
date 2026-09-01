from pydantic import BaseModel


class AdminDashboardResponse(BaseModel):
    total_students: int
    total_teachers: int
    total_courses: int
    total_enrollments: int
