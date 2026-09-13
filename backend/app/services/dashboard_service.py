from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.enums import UserRole
from app.models.user import User


def get_admin_dashboard(current_user, db):

    total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()

    total_teachers = db.query(User).filter(User.role == UserRole.TEACHER).count()

    total_courses = db.query(Course).count()

    total_enrollments = db.query(Enrollment).count()

    return {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_courses": total_courses,
        "total_enrollments": total_enrollments,
    }


def get_user(current_user, db):

    students = db.query(User).filter(User.role == UserRole.STUDENT)

    teachers = db.query(User).filter(User.role == UserRole.TEACHER)

    return {"students": students, "teachers": teachers}


def get_course(current_user, db):

    courses = db.query(Course)
    return {"courses": courses}
