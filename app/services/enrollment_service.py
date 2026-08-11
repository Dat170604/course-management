from fastapi import HTTPException

from app.models.enrollment import Enrollment
from app.models.course import Course
from app.models.enums import UserRole

def enroll_course(
    course_id,
    current_user,
    db
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=403,
            detail="Only students can enroll in courses"
        )

    course = db.query(Course).filter(
        Course.id == course_id
    ).first()

    if course is None:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    existing = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="You already enrolled in this course"
        )

    enrollment = Enrollment(
        student_id=current_user.id,
        course_id=course_id
    )

    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)

    return enrollment

def get_my_enrollments(
    current_user,
    db
):
    return db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id
    ).all()