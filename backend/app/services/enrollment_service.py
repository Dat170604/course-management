from fastapi import HTTPException
from sqlalchemy.orm import joinedload

from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.enums import UserRole
from app.models.user import User


def enroll_course(course_id, current_user, db):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=403, detail="Only students can enroll in courses"
        )

    course = db.query(Course).filter(Course.id == course_id).first()

    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")

    existing = (
        db.query(Enrollment)
        .filter(
            Enrollment.student_id == current_user.id, Enrollment.course_id == course_id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400, detail="You already enrolled in this course"
        )

    enrollment = Enrollment(student_id=current_user.id, course_id=course_id)

    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)

    return enrollment


def get_my_enrollments(current_user, db):
    return (
        db.query(Enrollment)
        .options(joinedload(Enrollment.course))
        .filter(Enrollment.student_id == current_user.id)
        .all()
    )


def get_course_students(course_id, current_user, db):
    course = db.query(Course).filter(Course.id == course_id).first()

    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")

    if current_user.role != UserRole.TEACHER:
        raise HTTPException(status_code=403, detail="Only teachers can view students")

    if course.teacher_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="You cannot view students of this course"
        )

    students = (
        db.query(User)
        .join(Enrollment, Enrollment.student_id == User.id)
        .filter(Enrollment.course_id == course_id)
        .all()
    )

    return students


def cancel_enrollment(course_id, current_user, db):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=403, detail="Only students can cancel enrollment"
        )

    enrollment = (
        db.query(Enrollment)
        .filter(
            Enrollment.student_id == current_user.id, Enrollment.course_id == course_id
        )
        .first()
    )

    if enrollment is None:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    db.delete(enrollment)
    db.commit()

    return {"message": "Enrollment cancelled successfully"}
