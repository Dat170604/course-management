from fastapi import HTTPException

from app.models.course import Course
from app.models.enums import UserRole


def create_course(
    course,
    current_user,
    db
):
    if current_user.role != UserRole.TEACHER:
        raise HTTPException(
            status_code=403,
            detail="Only teachers can create courses"
        )

    new_course = Course(
        title=course.title,
        description=course.description,
        price=course.price,
        teacher_id=current_user.id
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

def get_courses(db):
    return db.query(Course).all()

def get_course_by_id(
    course_id,
    db
):
    course = db.query(Course).filter(
        Course.id == course_id
    ).first()

    if course is None:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )
    return course

def update_course(
    course_id,
    course_data,
    current_user,
    db
):
    course = db.query(Course).filter(
        Course.id == course_id
    ).first()
    if course is None:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    if (current_user.role != UserRole.ADMIN and course.teacher_id != current_user.id):
        raise HTTPException(
            status_code=403,
            detail="You cannot modify this course"
        )

    data = course_data.model_dump(
        exclude_unset=True
    )
    for key, value in data.items():
        setattr(
            course,
            key,
            value
        )

    db.commit()
    db.refresh(course)

    return course

def delete_course(
    course_id,
    current_user,
    db
):
    course = db.query(Course).filter(
        Course.id == course_id
    ).first()
    if course is None:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )
    
    if (current_user.role != UserRole.ADMIN and course.teacher_id != current_user.id):
        raise HTTPException(
            status_code=403,
            detail="You cannot delete this course"
        )

    db.delete(course)
    db.commit()

    return {
        "message": "Course deleted successfully"
    }

def get_my_courses(
    current_user,
    db
):
    courses = db.query(Course).filter(
        Course.teacher_id == current_user.id
    ).all()

    return courses