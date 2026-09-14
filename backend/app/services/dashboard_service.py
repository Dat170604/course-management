from fastapi import HTTPException

from app.exception.user import UserNotFoundException
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


def delete_user(user_id, current_user, db):
    user = db.query(User).filter(User.id == user_id).first()

    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot delete yourself")

    if not user:
        raise UserNotFoundException()

    db.delete(user)
    db.commit()

    return {"message": "Deleted user successfully"}
