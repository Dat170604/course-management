from fastapi import HTTPException

from sqlalchemy import func

from app.models.course import Course
from app.models.enrollment import Enrollment
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

def get_courses(
    db,
    page,
    limit,
    search,
    min_price,
    max_price,
    teacher_id,
    sort
):
    query = db.query(Course)

    if search:
        query = query.filter(
            Course.title.ilike(f"%{search}%")
        )

    if min_price is not None:
        query = query.filter(
            Course.price >= min_price
    )
    
    if max_price is not None:
        query = query.filter(
            Course.price <= max_price
        )

    if teacher_id is not None:
        query = query.filter(
            Course.teacher_id == teacher_id
        )

    if sort == "price":
        query = query.order_by(
            Course.price.asc()
        )
    elif sort == "-price":
        query = query.order_by(
            Course.price.desc()
    )
    else:
        query = query.order_by(
            Course.id.asc()
        )
        
    total = query.count()

    skip = (page - 1) * limit

    courses = query.offset(
        skip
    ).limit(
        limit
    ).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "courses": courses
    }

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

def get_teacher_dashboard(
    current_user,
    db
):
    if current_user.role != UserRole.TEACHER:
        raise HTTPException(
            status_code=403,
            detail="Only teachers can access dashboard"
        )

    courses = (
        db.query(
            Course,
            func.count(Enrollment.id).label("student_count")
        )
        .outerjoin(
            Enrollment,
            Enrollment.course_id == Course.id
        )
        .filter(
            Course.teacher_id == current_user.id
        )
        .group_by(
            Course.id
        ).all()
    )

    result = []

    for course, student_count in courses:
        result.append(
            {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "price": course.price,
                "student_count": student_count
            }
        )
    return result