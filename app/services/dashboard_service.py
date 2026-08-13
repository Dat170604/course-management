from fastapi import HTTPException

from app.models.user import User
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.enums import UserRole

def get_admin_dashboard(
    current_user,
    db
):

    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only admins can access dashboard"
        )

    total_students = db.query(User).filter(
        User.role == UserRole.STUDENT
    ).count()

    total_teachers = db.query(User).filter(
        User.role == UserRole.TEACHER
    ).count()

    total_courses = db.query(Course).count()

    total_enrollments = db.query(Enrollment).count()

    return {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_courses": total_courses,
        "total_enrollments": total_enrollments
    }